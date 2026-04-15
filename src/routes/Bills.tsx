import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Calendar, CheckCircle, CreditCard, DollarSign } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import type { Bill } from '@/types'

export function Bills() {
  const { state, markBillPaid, addBill } = useUser()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newBillName, setNewBillName] = useState('')
  const [newBillAmount, setNewBillAmount] = useState('')
  const [newBillDueDay, setNewBillDueDay] = useState('')

  const bills = state.bills
  const totalDue = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0)
  const paidThisMonth = bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0)

  const handleAddBill = () => {
    if (!newBillName || !newBillAmount || !newBillDueDay) return

    const now = new Date()
    let dueDay = parseInt(newBillDueDay)
    let dueDate = new Date(now.getFullYear(), now.getMonth(), dueDay)

    // If the due date has passed this month, set it for next month
    if (dueDate < now) {
      dueDate = new Date(now.getFullYear(), now.getMonth() + 1, dueDay)
    }

    const newBill: Bill = {
      id: crypto.randomUUID(),
      name: newBillName,
      amount: parseFloat(newBillAmount),
      dueDate,
      isPaid: false,
      isRecurring: true,
      recurrencePattern: 'monthly',
    }

    addBill(newBill)
    setNewBillName('')
    setNewBillAmount('')
    setNewBillDueDay('')
    setAddDialogOpen(false)
  }

  const nextBill = bills
    .filter(b => !b.isPaid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Bills</h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Manage your recurring bills and payments
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">Due This Month</p>
            <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
              ${totalDue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">Paid This Month</p>
            <p className="text-2xl font-bold tabular-nums text-[var(--color-success)]">
              ${paidThisMonth.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">Next Due</p>
            {nextBill ? (
              <>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {new Date(nextBill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {nextBill.name} - ${nextBill.amount.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-[var(--color-success)]">All paid!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bills List */}
      {bills.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bills.map((bill) => {
                const dueDate = new Date(bill.dueDate)
                const isOverdue = !bill.isPaid && dueDate < new Date()
                const isDueSoon = !bill.isPaid && dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

                return (
                  <div
                    key={bill.id}
                    className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                      bill.isPaid
                        ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/5'
                        : isOverdue
                        ? 'border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5'
                        : isDueSoon
                        ? 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        bill.isPaid ? 'bg-[var(--color-success)]/20' : 'bg-[var(--color-background-secondary)]'
                      }`}
                    >
                      {bill.isPaid ? (
                        <CheckCircle className="h-5 w-5 text-[var(--color-success)]" />
                      ) : (
                        <Calendar className="h-5 w-5 text-[var(--color-text-muted)]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--color-text-primary)]">{bill.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {bill.isRecurring ? 'Monthly' : 'One-time'} • Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums text-[var(--color-text-primary)]">
                        ${bill.amount.toFixed(2)}
                      </p>
                      {bill.isPaid ? (
                        <span className="text-xs text-[var(--color-success)]">Paid</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-1 h-7 text-xs"
                          onClick={() => markBillPaid(bill.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10 mb-4">
              <CreditCard className="h-8 w-8 text-[var(--color-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              No bills added yet
            </h3>
            <p className="text-[var(--color-text-secondary)] text-center mb-6 max-w-sm">
              Keep track of your recurring bills and never miss a payment. Add your first bill to get started.
            </p>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Your First Bill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Bill Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-[var(--color-text-secondary)]">Bill Name</label>
              <input
                type="text"
                value={newBillName}
                onChange={(e) => setNewBillName(e.target.value)}
                placeholder="e.g., Electric, Internet, Rent"
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
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-9 pr-4 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Due Day of Month</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={newBillDueDay}
                  onChange={(e) => setNewBillDueDay(e.target.value)}
                  placeholder="15"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm tabular-nums focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleAddBill}
              disabled={!newBillName || !newBillAmount || !newBillDueDay}
            >
              Add Bill
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
