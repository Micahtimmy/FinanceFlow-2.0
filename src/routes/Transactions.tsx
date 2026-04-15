import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Search, Receipt, DollarSign } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import type { Transaction, TransactionType } from '@/types'

export function Transactions() {
  const { state, addTransaction } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all')
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Form state
  const [newMerchant, setNewMerchant] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newType, setNewType] = useState<TransactionType>('expense')
  const [newCategory, setNewCategory] = useState('')

  // Filter and group transactions
  const filteredTransactions = useMemo(() => {
    let filtered = state.transactions

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tx) =>
          tx.merchantName.toLowerCase().includes(query) ||
          state.categories.find((c) => c.id === tx.categoryId)?.name.toLowerCase().includes(query)
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((tx) => tx.type === filterType)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [state.transactions, state.categories, searchQuery, filterType])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    filteredTransactions.forEach((tx) => {
      const txDate = new Date(tx.date)
      let dateKey: string

      if (txDate.toDateString() === today.toDateString()) {
        dateKey = 'Today'
      } else if (txDate.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday'
      } else {
        dateKey = txDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(tx)
    })

    return Object.entries(groups)
  }, [filteredTransactions])

  const handleAddTransaction = () => {
    if (!newMerchant || !newAmount || !newCategory) return

    const newTx: Transaction = {
      id: crypto.randomUUID(),
      userId: '1',
      date: new Date(),
      amount: parseFloat(newAmount),
      currency: 'USD',
      type: newType,
      categoryId: newCategory,
      merchantName: newMerchant,
      isRecurring: false,
      importSource: 'manual',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addTransaction(newTx)
    setNewMerchant('')
    setNewAmount('')
    setNewType('expense')
    setNewCategory('')
    setAddDialogOpen(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Transactions</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Track and manage your transactions
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-10 pr-4 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
              <option value="transfer">Transfers</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              All Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {groupedTransactions.map(([date, transactions]) => (
                <div key={date}>
                  <h3 className="mb-3 text-sm font-medium text-[var(--color-text-muted)]">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {transactions.map((tx) => {
                      const category = state.categories.find((c) => c.id === tx.categoryId)
                      return (
                        <Link
                          key={tx.id}
                          to={`/transactions/${tx.id}`}
                          className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-background-secondary)]"
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                            style={{ backgroundColor: category?.color ? `${category.color}20` : 'var(--color-background-secondary)' }}
                          >
                            {category?.icon || tx.merchantName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[var(--color-text-primary)]">{tx.merchantName}</p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                              {category?.name || 'Uncategorized'} • {new Date(tx.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </p>
                          </div>
                          <span
                            className={`text-base font-semibold tabular-nums ${
                              tx.type === 'income' ? 'text-[var(--color-success)]' : 'text-[var(--color-text-primary)]'
                            }`}
                          >
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10 mb-4">
              <Receipt className="h-8 w-8 text-[var(--color-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              {searchQuery || filterType !== 'all' ? 'No matching transactions' : 'No transactions yet'}
            </h3>
            <p className="text-[var(--color-text-secondary)] text-center mb-6 max-w-sm">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Start tracking your spending by adding your first transaction.'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Your First Transaction
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Transaction Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Merchant</label>
              <input
                type="text"
                value={newMerchant}
                onChange={(e) => setNewMerchant(e.target.value)}
                placeholder="e.g., Grocery Store, Amazon"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Amount</label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-9 pr-4 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as TransactionType)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              >
                <option value="">Select a category</option>
                {state.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              className="w-full"
              onClick={handleAddTransaction}
              disabled={!newMerchant || !newAmount || !newCategory}
            >
              Add Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
