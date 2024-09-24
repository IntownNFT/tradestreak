import { useEffect } from 'react'
import { CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContributionsChartProps {
  completedDays: number[]
  selectedYear: number
  setSelectedYear: (year: number) => void
  availableYears: number[]
  fetchCompletedDays: (projectId: string, year: number) => Promise<void>
  currentProjectId: string | undefined
  onDayClick: (date: string) => void
}

export function ContributionsChart({ 
  completedDays, 
  selectedYear, 
  setSelectedYear, 
  availableYears,
  fetchCompletedDays,
  currentProjectId,
  onDayClick
}: ContributionsChartProps) {
  useEffect(() => {
    if (currentProjectId) {
      fetchCompletedDays(currentProjectId, selectedYear);
    }
  }, [currentProjectId, selectedYear, fetchCompletedDays]);

  const getColor = (value: number) => {
    const colors = [
      'bg-[rgba(191,219,254,0.1)]',
      'bg-[rgba(191,219,254,0.3)]',
      'bg-[rgba(191,219,254,0.5)]',
      'bg-[rgba(191,219,254,0.7)]',
      'bg-[rgba(191,219,254,1)]'
    ]
    return colors[value]
  }

  const startDate = new Date(selectedYear, 0, 1)
  const endDate = new Date(selectedYear, 11, 31)

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year, 10);
    setSelectedYear(newYear);
    if (currentProjectId) {
      fetchCompletedDays(currentProjectId, newYear);
    }
  };

  const handleDayClick = (date: Date) => {
    if (date >= startDate && date <= endDate) {
      onDayClick(date.toISOString().split('T')[0]);
    }
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <Select 
          value={selectedYear.toString()} 
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[180px] bg-[rgba(191,219,254,1)] border-[rgba(191,219,254,0.5)]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent className="bg-[#141414] border-[rgba(191,219,254,0.5)]">
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="w-full overflow-x-auto">
          <div className="flex flex-col gap-1 min-w-[1000px]">
            {Array(7).fill(null).map((_, dayIndex) => (
              <div key={dayIndex} className="flex gap-1">
                {Array(52).fill(null).map((_, weekIndex) => {
                  const date = new Date(startDate.getTime() + (weekIndex * 7 + dayIndex) * 24 * 60 * 60 * 1000)
                  const dayNumber = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
                  const isCompleted = completedDays.includes(dayNumber)
                  const isWithinYear = date >= startDate && date <= endDate

                  return (
                    <div
                      key={`${dayIndex}-${weekIndex}`}
                      className={`w-full h-5 rounded-sm ${isWithinYear ? getColor(isCompleted ? 4 : 0) : 'bg-transparent'} cursor-pointer`}
                      title={isWithinYear ? `${date.toDateString()}: ${isCompleted ? 'Completed' : 'Not completed'}` : ''}
                      onClick={() => handleDayClick(date)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </>
  )
}