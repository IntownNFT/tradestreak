import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatisticsProps {
  streak: number
  completedToday: number
}

export function Statistics({ streak, completedToday }: StatisticsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="bg-[#141414] border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-[rgba(191,219,254,0.9)]">{streak} days</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[rgba(156,163,175,1)]">Current streak</p>
        </CardContent>
      </Card>
      <Card className="bg-[#141414] border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-[rgba(191,219,254,0.9)]">{completedToday} tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[rgba(156,163,175,1)]">Completed today</p>
        </CardContent>
      </Card>
    </div>
  )
}