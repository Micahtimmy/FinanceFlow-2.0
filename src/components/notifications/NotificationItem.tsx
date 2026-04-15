import { motion } from 'framer-motion'
import { X, Bell, AlertTriangle, TrendingUp, Lightbulb, Info, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Notification } from '@/types/notification'
import { formatDistanceToNow } from 'date-fns'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
}

const typeIcons = {
  bill_due: Bell,
  budget_alert: AlertTriangle,
  savings_milestone: TrendingUp,
  insight: Lightbulb,
  system: Info,
}

const severityColors = {
  high: 'var(--color-danger)',
  medium: 'var(--color-warning)',
  low: 'var(--color-accent)',
}

export function NotificationItem({ notification, onMarkAsRead, onDismiss }: NotificationItemProps) {
  const Icon = typeIcons[notification.type]
  const severityColor = severityColors[notification.severity]

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id)
    }
  }

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`group relative flex gap-3 rounded-lg p-3 transition-colors ${
        notification.isRead
          ? 'bg-transparent hover:bg-[var(--color-surface-hover)]'
          : 'bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10'
      }`}
      onClick={handleClick}
    >
      {/* Severity indicator */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        style={{ backgroundColor: severityColor }}
      />

      {/* Icon */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${severityColor}20` }}
      >
        <Icon className="h-4 w-4" style={{ color: severityColor }} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-medium ${
              notification.isRead
                ? 'text-[var(--color-text-secondary)]'
                : 'text-[var(--color-text-primary)]'
            }`}
          >
            {notification.title}
          </p>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDismiss(notification.id)
            }}
            className="shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-[var(--color-surface-hover)] group-hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)] line-clamp-2">
          {notification.message}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-muted)]">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </span>
          {notification.actionUrl && notification.actionLabel && (
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]">
              {notification.actionLabel}
              <ExternalLink className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
      )}
    </motion.div>
  )

  if (notification.actionUrl) {
    return (
      <Link to={notification.actionUrl} className="block">
        {content}
      </Link>
    )
  }

  return content
}
