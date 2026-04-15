import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Upload,
  FileSpreadsheet,
  Check,
  X,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { useUser } from '@/context/UserContext'
import type { Transaction, TransactionType } from '@/types'

type ImportStep = 'upload' | 'mapping' | 'preview' | 'complete'

interface CSVRow {
  [key: string]: string
}

interface ColumnMapping {
  date: string
  amount: string
  merchant: string
  category: string
  type: string
  note: string
}

interface ValidationError {
  row: number
  field: string
  message: string
}

const DEFAULT_MAPPING: ColumnMapping = {
  date: '',
  amount: '',
  merchant: '',
  category: '',
  type: '',
  note: '',
}

export function Import() {
  const navigate = useNavigate()
  const { addTransaction } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<ImportStep>('upload')
  const [fileName, setFileName] = useState('')
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(DEFAULT_MAPPING)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [importedCount, setImportedCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Parse CSV file
  const parseCSV = useCallback((text: string) => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) {
      return { headers: [], data: [] }
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"(.*)"$/, '$1'))

    const data: CSVRow[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length === headers.length) {
        const row: CSVRow = {}
        headers.forEach((header, idx) => {
          row[header] = values[idx]
        })
        data.push(row)
      }
    }

    return { headers, data }
  }, [])

  // Parse a single CSV line, handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    values.push(current.trim())
    return values
  }

  // Handle file selection
  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv')) {
        alert('Please select a CSV file')
        return
      }

      setFileName(file.name)

      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const { headers, data } = parseCSV(text)

        setCsvHeaders(headers)
        setCsvData(data)

        // Auto-detect column mappings
        const autoMapping = { ...DEFAULT_MAPPING }
        headers.forEach((header) => {
          const lower = header.toLowerCase()
          if (lower.includes('date')) autoMapping.date = header
          else if (lower.includes('amount') || lower.includes('value'))
            autoMapping.amount = header
          else if (
            lower.includes('merchant') ||
            lower.includes('description') ||
            lower.includes('payee') ||
            lower.includes('name')
          )
            autoMapping.merchant = header
          else if (lower.includes('category') || lower.includes('type'))
            autoMapping.category = header
          else if (lower.includes('note') || lower.includes('memo'))
            autoMapping.note = header
        })

        setColumnMapping(autoMapping)
        setStep('mapping')
      }

      reader.readAsText(file)
    },
    [parseCSV]
  )

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  // Validate mapped data
  const validateData = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = []

    csvData.forEach((row, index) => {
      // Validate required fields
      if (columnMapping.date && !row[columnMapping.date]) {
        errors.push({ row: index + 1, field: 'date', message: 'Missing date' })
      } else if (columnMapping.date && isNaN(Date.parse(row[columnMapping.date]))) {
        errors.push({ row: index + 1, field: 'date', message: 'Invalid date format' })
      }

      if (columnMapping.amount && !row[columnMapping.amount]) {
        errors.push({ row: index + 1, field: 'amount', message: 'Missing amount' })
      } else if (columnMapping.amount) {
        const amount = parseFloat(row[columnMapping.amount].replace(/[^0-9.-]/g, ''))
        if (isNaN(amount)) {
          errors.push({ row: index + 1, field: 'amount', message: 'Invalid amount' })
        }
      }

      if (columnMapping.merchant && !row[columnMapping.merchant]) {
        errors.push({ row: index + 1, field: 'merchant', message: 'Missing merchant' })
      }
    })

    return errors
  }, [csvData, columnMapping])

  // Proceed to preview
  const handleProceedToPreview = () => {
    const errors = validateData()
    setValidationErrors(errors)
    setStep('preview')
  }

  // Import transactions
  const handleImport = () => {
    const validRows = csvData.filter((_, index) => {
      return !validationErrors.some((e) => e.row === index + 1)
    })

    validRows.forEach((row) => {
      const amountStr = columnMapping.amount
        ? row[columnMapping.amount].replace(/[^0-9.-]/g, '')
        : '0'
      const amount = Math.abs(parseFloat(amountStr))
      const isExpense = amountStr.includes('-') || parseFloat(amountStr) < 0

      const transaction: Transaction = {
        id: crypto.randomUUID(),
        userId: '1',
        date: new Date(row[columnMapping.date] || new Date()),
        amount,
        currency: 'USD',
        type: (isExpense ? 'expense' : 'income') as TransactionType,
        categoryId: '2', // Default category
        merchantName: columnMapping.merchant ? row[columnMapping.merchant] : 'Unknown',
        note: columnMapping.note ? row[columnMapping.note] : undefined,
        isRecurring: false,
        importSource: 'csv',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      addTransaction(transaction)
    })

    setImportedCount(validRows.length)
    setStep('complete')
  }

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 'upload':
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <div
              className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                isDragging
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                  : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-[var(--color-text-muted)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                Drop your CSV file here
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInput}
              />
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Select File
              </Button>
            </div>
          </motion.div>
        )

      case 'mapping':
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 rounded-lg bg-[var(--color-background-secondary)] p-4">
              <FileSpreadsheet className="h-5 w-5 text-[var(--color-accent)]" />
              <div className="flex-1">
                <p className="font-medium text-[var(--color-text-primary)]">{fileName}</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {csvData.length} rows found
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Map Your Columns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'date', label: 'Date', required: true },
                  { key: 'amount', label: 'Amount', required: true },
                  { key: 'merchant', label: 'Merchant/Description', required: true },
                  { key: 'category', label: 'Category', required: false },
                  { key: 'note', label: 'Note/Memo', required: false },
                ].map(({ key, label, required }) => (
                  <div key={key} className="flex items-center gap-4">
                    <label className="w-40 text-sm text-[var(--color-text-secondary)]">
                      {label}
                      {required && <span className="text-[var(--color-danger)]"> *</span>}
                    </label>
                    <select
                      value={columnMapping[key as keyof ColumnMapping]}
                      onChange={(e) =>
                        setColumnMapping({ ...columnMapping, [key]: e.target.value })
                      }
                      className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    >
                      <option value="">-- Select column --</option>
                      {csvHeaders.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep('upload')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleProceedToPreview}
                disabled={!columnMapping.date || !columnMapping.amount || !columnMapping.merchant}
              >
                Preview
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )

      case 'preview':
        const errorRowIds = new Set(validationErrors.map((e) => e.row))

        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            {validationErrors.length > 0 && (
              <div className="rounded-lg border border-[var(--color-warning)] bg-[var(--color-warning)]/5 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[var(--color-warning)]" />
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {validationErrors.length} validation issues found
                  </p>
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Rows with issues will be skipped during import
                </p>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preview (First 5 rows)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)]">
                        <th className="px-4 py-2 text-left font-medium text-[var(--color-text-muted)]">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-[var(--color-text-muted)]">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-[var(--color-text-muted)]">
                          Merchant
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-[var(--color-text-muted)]">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, index) => {
                        const hasError = errorRowIds.has(index + 1)
                        return (
                          <tr
                            key={index}
                            className={`border-b border-[var(--color-border)] ${
                              hasError ? 'bg-[var(--color-danger)]/5' : ''
                            }`}
                          >
                            <td className="px-4 py-2">
                              {hasError ? (
                                <X className="h-4 w-4 text-[var(--color-danger)]" />
                              ) : (
                                <Check className="h-4 w-4 text-[var(--color-success)]" />
                              )}
                            </td>
                            <td className="px-4 py-2 text-[var(--color-text-primary)]">
                              {columnMapping.date ? row[columnMapping.date] : '-'}
                            </td>
                            <td className="px-4 py-2 text-[var(--color-text-primary)]">
                              {columnMapping.merchant ? row[columnMapping.merchant] : '-'}
                            </td>
                            <td className="px-4 py-2 text-right font-medium tabular-nums text-[var(--color-text-primary)]">
                              {columnMapping.amount ? row[columnMapping.amount] : '-'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep('mapping')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleImport}>
                Import {csvData.length - validationErrors.length} transactions
              </Button>
            </div>
          </motion.div>
        )

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]"
            >
              <Check className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Import Complete!
            </h3>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              Successfully imported {importedCount} transactions
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Import More
              </Button>
              <Button onClick={() => navigate('/transactions')}>View Transactions</Button>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Import Transactions</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Import transactions from a CSV file
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          {(['upload', 'mapping', 'preview', 'complete'] as ImportStep[]).map((s, index) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  step === s
                    ? 'bg-[var(--color-accent)] text-white'
                    : index < ['upload', 'mapping', 'preview', 'complete'].indexOf(step)
                    ? 'bg-[var(--color-success)] text-white'
                    : 'bg-[var(--color-background-secondary)] text-[var(--color-text-muted)]'
                }`}
              >
                {index <
                ['upload', 'mapping', 'preview', 'complete'].indexOf(step) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div
                  className={`mx-2 h-0.5 w-8 ${
                    index < ['upload', 'mapping', 'preview', 'complete'].indexOf(step)
                      ? 'bg-[var(--color-success)]'
                      : 'bg-[var(--color-border)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-12 text-xs text-[var(--color-text-muted)]">
          <span>Upload</span>
          <span>Map</span>
          <span>Preview</span>
          <span>Done</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
      </div>
    </div>
  )
}
