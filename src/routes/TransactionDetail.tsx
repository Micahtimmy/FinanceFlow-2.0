import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  Repeat,
  FileText,
} from 'lucide-react'
import { useUser } from '@/context/UserContext'
import type { Transaction, TransactionType } from '@/types'

export function TransactionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, updateTransaction, deleteTransaction } = useUser()

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Edit form state
  const [editMerchant, setEditMerchant] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editType, setEditType] = useState<TransactionType>('expense')
  const [editNote, setEditNote] = useState('')

  useEffect(() => {
    const found = state.transactions.find((t) => t.id === id)
    if (found) {
      setTransaction(found)
      setEditMerchant(found.merchantName)
      setEditAmount(found.amount.toString())
      setEditDate(new Date(found.date).toISOString().split('T')[0])
      setEditCategory(found.categoryId)
      setEditType(found.type)
      setEditNote(found.note || '')
    }
  }, [id, state.transactions])

  if (!transaction) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Transaction not found
          </h2>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            The transaction you're looking for doesn't exist.
          </p>
          <Button asChild className="mt-4">
            <Link to="/transactions">Back to Transactions</Link>
          </Button>
        </div>
      </div>
    )
  }

  const category = state.categories.find((c) => c.id === transaction.categoryId)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSave = () => {
    if (!transaction) return

    const updated: Transaction = {
      ...transaction,
      merchantName: editMerchant,
      amount: parseFloat(editAmount),
      date: new Date(editDate),
      categoryId: editCategory,
      type: editType,
      note: editNote || undefined,
      updatedAt: new Date(),
    }

    updateTransaction(updated)
    setTransaction(updated)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (!transaction) return
    deleteTransaction(transaction.id)
    navigate('/transactions')
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/transactions"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {transaction.merchantName}
            </h1>
            <p className="mt-1 text-[var(--color-text-secondary)]">
              Transaction Details
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transaction Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[var(--color-text-secondary)]">Merchant</label>
                    <input
                      type="text"
                      value={editMerchant}
                      onChange={(e) => setEditMerchant(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-[var(--color-text-secondary)]">Amount</label>
                      <input
                        type="text"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                        className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[var(--color-text-secondary)]">Date</label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-[var(--color-text-secondary)]">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                      >
                        {state.categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-[var(--color-text-secondary)]">Type</label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as TransactionType)}
                        className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                        <option value="transfer">Transfer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--color-text-secondary)]">Note</label>
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                      style={{ backgroundColor: category?.color + '20' }}
                    >
                      {category?.icon || '💰'}
                    </div>
                    <div>
                      <p
                        className={`text-3xl font-bold tabular-nums ${
                          transaction.type === 'income'
                            ? 'text-[var(--color-success)]'
                            : 'text-[var(--color-text-primary)]'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-[var(--color-text-secondary)]">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-[var(--color-text-muted)]" />
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">Date</p>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-[var(--color-text-muted)]" />
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">Category</p>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {category?.icon} {category?.name || 'Uncategorized'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {transaction.isRecurring && (
                    <div className="flex items-center gap-3 rounded-lg bg-[var(--color-accent)]/10 p-4">
                      <Repeat className="h-5 w-5 text-[var(--color-accent)]" />
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          Recurring Transaction
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {transaction.recurrencePattern?.charAt(0).toUpperCase()}
                          {transaction.recurrencePattern?.slice(1)}
                        </p>
                      </div>
                    </div>
                  )}

                  {transaction.note && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-[var(--color-text-muted)]" />
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">Note</p>
                        <p className="text-[var(--color-text-primary)]">{transaction.note}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Transaction ID</p>
                <p className="font-mono text-sm text-[var(--color-text-secondary)]">
                  {transaction.id.slice(0, 8)}...
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Import Source</p>
                <p className="text-[var(--color-text-primary)]">
                  {transaction.importSource.charAt(0).toUpperCase() +
                    transaction.importSource.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Created</p>
                <p className="text-[var(--color-text-primary)]">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Last Updated</p>
                <p className="text-[var(--color-text-primary)]">
                  {new Date(transaction.updatedAt).toLocaleDateString()}
                </p>
              </div>
              {transaction.tags.length > 0 && (
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Tags</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {transaction.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--color-background-secondary)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
