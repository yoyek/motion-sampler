import HistoryItem from '@/components/HistoryItem'
import { TrashIcon } from '@heroicons/react/24/outline'

export default function HistoryPicker({
  history,
  onRemoveItem,
  onFlush,
  onUrlChange,
  className
}) {

  const flushConfirm = () => {
    if (window.confirm("This will remove all you history. Are you sure?")) {
      onFlush()
    }
  }

  if (!history?.length) return ''

  return (
    <div className={`history-picker ${className}`}>
      <h2 className="text-2xl pl-5 lg:pl-0 mt-5 mb-5">History</h2>
      <ul className="lg:grid grid-cols-4 gap-5">
        {history.map(item => (
          <HistoryItem
            key={item.id}
            item={item}
            onRemoveItem={onRemoveItem}
            onUrlChange={onUrlChange}
          />
        ))}
      </ul>
      {history.length && (
        <button
          onClick={flushConfirm}
          className="text-red-400 py-3 block opacity-60 text-sm flex"
        >
          <TrashIcon className="h-5 w-5 pt-0 mr-1.5" />
          Clear history
        </button>
      )}
    </div>
  )
}
