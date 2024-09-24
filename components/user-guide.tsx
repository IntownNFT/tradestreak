import { Plus, GripVertical, Undo, Trophy } from "lucide-react"

export function UserGuide() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-[rgba(191,219,254,0.9)]">User guide</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-start space-x-4">
          <Plus className="w-6 h-6 mt-1 text-[rgba(191,219,254,1)]" />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-[rgba(191,219,254,0.9)]">Adding trades</h3>
            <p className="text-base text-[rgba(156,163,175,1)]">
              Type your trade plan and press Enter or click the Add button.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <GripVertical className="w-6 h-6 mt-1 text-[rgba(191,219,254,1)]" />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-[rgba(191,219,254,0.9)]">Reordering trades</h3>
            <p className="text-base text-[rgba(156,163,175,1)]">
              Drag and drop a trade to change its position in the list.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <Undo className="w-6 h-6 mt-1 text-[rgba(191,219,254,1)]" />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-[rgba(191,219,254,0.9)]">Undoing a trade</h3>
            <p className="text-base text-[rgba(156,163,175,1)]">
              Click the undo icon next to a completed trade to mark it as incomplete.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <Trophy className="w-6 h-6 mt-1 text-[rgba(191,219,254,1)]" />
          <div>
            <h3 className="text-xl font-semibold mb-2 text-[rgba(191,219,254,0.9)]">Tracking progress</h3>
            <p className="text-base text-[rgba(156,163,175,1)]">
              View your streak and completed trades in the Statistics tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}