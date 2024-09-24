import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const stats = [
  { name: "30d Change", value: "-2.81%", icon: Activity, trend: "down" },
  // Add more stats here if needed
]

export default function TradingTerminal() {
  return (
    <Card className="w-full bg-[#141414] border-none shadow-xl flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-[rgba(191,219,254,1)] text-2xl font-bold">Portfolio Statistics</CardTitle>
        <CardDescription className="text-[rgba(191,219,254,0.9)]">Overview of your trading performance</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[240px] pr-4">
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-[#1c1c1c] border-none">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <stat.icon className="h-8 w-8 mr-3 text-[rgba(191,219,254,1)]" />
                    <div>
                      <h3 className="text-[rgba(191,219,254,0.9)] font-semibold">{stat.name}</h3>
                      <p className="text-[rgba(229,231,235,1)] text-lg font-bold">{stat.value}</p>
                    </div>
                  </div>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="mt-6">
        <Button className="w-full bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]">
          View Detailed Analytics
        </Button>
      </CardFooter>
    </Card>
  )
}