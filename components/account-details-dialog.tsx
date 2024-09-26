import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TradingAccount } from "@/types/trading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area } from 'recharts'

interface AccountDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  account: TradingAccount
}

interface PeriodMetrics {
  trades: number
  profit: number
  lots: number
  pips: number
  gain: number
  wonTradesPercent?: number
}

interface Metrics {
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  profit: number
  trades: number
  balance: number
  highestBalance: number
  highestBalanceDate: string
  wonTradesPercent: number
  lostTradesPercent: number
  wonTrades: number
  lostTrades: number
  averageWin: number
  averageLoss: number
  pips: number
  averageWinPips: number
  averageLossPips: number
  bestTrade: number
  bestTradeDate: string
  worstTrade: number
  worstTradeDate: string
  bestTradePips: number
  bestTradePipsDate: string
  worstTradePips: number
  worstTradePipsDate: string
  tradingStartBrokerTime: string
  cagr: number
  commissions: number
  profitFactor: number
  absoluteGain: number
  gain: number
  dailyGrowth: Array<{
    date: string
    balance: number
  }>
  maxDrawdown: number
  sharpeRatio: number
  sortinoRatio: number
  periods: {
    thisWeek: PeriodMetrics
    thisMonth: PeriodMetrics
    thisYear: PeriodMetrics
  }
}

export function AccountDetailsDialog({ isOpen, onClose, account }: AccountDetailsDialogProps) {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && account.id) {
      fetchMetrics(account.id)
    }
  }, [isOpen, account.id])

  const fetchMetrics = async (accountId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/trading-accounts/${accountId}/metrics`)
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      } else {
        setError('Failed to fetch metrics')
      }
    } catch (error) {
      setError('Error fetching metrics')
      console.error('Error fetching metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const chartColors = {
    primary: "rgba(191,219,254,1)",
    secondary: "rgba(191,219,254,0.6)",
    background: "#1c1c1c",
    text: "#ffffff", // Changed to white
  }

  const renderWinRateChart = (wonTradesPercent: number, lostTradesPercent: number) => {
    const data = [
      { name: 'Won', value: wonTradesPercent },
      { name: 'Lost', value: lostTradesPercent },
    ]
    const COLORS = [chartColors.primary, chartColors.secondary]

    return (
      <Card className="bg-[#1c1c1c] border-none">
        <CardHeader>
          <CardTitle className="text-[rgba(191,219,254,1)]">Win Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: chartColors.background, borderColor: chartColors.text }} 
                  itemStyle={{ color: chartColors.text }}
                  labelStyle={{ color: chartColors.text }}
                />
                <Legend 
                  wrapperStyle={{ color: chartColors.text }}
                  formatter={(value, entry, index) => <span style={{ color: chartColors.text }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderBarChart = (title: string, data: Array<{ name: string; value: number }>, dataKey: string) => (
    <Card className="bg-[#1c1c1c] border-none">
      <CardHeader>
        <CardTitle className="text-[rgba(191,219,254,1)]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.text} opacity={0.1} />
              <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
              <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
              <Tooltip
                contentStyle={{ backgroundColor: chartColors.background, borderColor: chartColors.text }}
                itemStyle={{ color: chartColors.text }}
                labelStyle={{ color: chartColors.text }}
              />
              <Bar dataKey={dataKey}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? chartColors.primary : chartColors.secondary} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )

  const renderRatioCard = (title: string, value: number) => {
    const getColor = (val: number) => {
      if (val >= 2) return chartColors.primary;
      if (val >= 1) return chartColors.secondary;
      return "rgba(239, 68, 68, 0.7)"; // soft red for lower values
    }

    const getDescription = (val: number) => {
      if (val >= 2) return "Excellent";
      if (val >= 1) return "Good";
      return "Needs Improvement";
    }

    const color = getColor(value);

    return (
      <Card className="bg-[#1c1c1c] border-none">
        <CardHeader className="p-4">
          <CardTitle className="text-[rgba(191,219,254,1)] text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[100px] flex flex-col items-center justify-center">
            <div className="text-2xl font-bold" style={{ color }}>
              {value.toFixed(2)}
            </div>
            <div className="text-[rgba(191,219,254,0.6)] mt-1 text-xs">
              {getDescription(value)}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderBalanceEquityChart = (balance: number, equity: number) => {
    const data = [
      { name: 'Balance', value: balance },
      { name: 'Equity', value: equity },
    ]
    return renderBarChart("Balance vs Equity", data, "value")
  }

  const renderBestWorstTradeChart = (bestTrade: number, worstTrade: number) => {
    const data = [
      { name: 'Best Trade', value: bestTrade },
      { name: 'Worst Trade', value: Math.abs(worstTrade) },
    ]
    return renderBarChart("Best vs Worst Trade", data, "value")
  }

  const renderAverageWinLossChart = (averageWin: number, averageLoss: number) => {
    const data = [
      { name: 'Average Win', value: averageWin },
      { name: 'Average Loss', value: Math.abs(averageLoss) },
    ]
    return renderBarChart("Average Win vs Loss", data, "value")
  }

  const renderMaxDrawdownChart = (maxDrawdown: number) => {
    // Create dummy data for visualization
    const data = [
      { name: 'Start', value: 100 },
      { name: 'Drawdown', value: 100 - maxDrawdown },
      { name: 'Current', value: 100 },
    ]

    return (
      <Card className="bg-[#1c1c1c] border-none">
        <CardHeader>
          <CardTitle className="text-[rgba(191,219,254,1)]">Maximum Drawdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.text} opacity={0.1} />
                <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                <Tooltip
                  contentStyle={{ backgroundColor: chartColors.background, borderColor: chartColors.text }}
                  itemStyle={{ color: chartColors.text }}
                  labelStyle={{ color: chartColors.text }}
                />
                <Area type="monotone" dataKey="value" stroke={chartColors.primary} fill={chartColors.secondary} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <span className="text-[rgba(191,219,254,1)] text-lg font-bold">{maxDrawdown.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderPeriodMetricsTable = (periods: Metrics['periods']) => (
    <Card className="bg-[#1c1c1c] border-none">
      <CardHeader>
        <CardTitle className="text-[rgba(191,219,254,1)]">Period Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[rgba(191,219,254,0.9)]">Period</TableHead>
              <TableHead className="text-[rgba(191,219,254,0.9)]">Trades</TableHead>
              <TableHead className="text-[rgba(191,219,254,0.9)]">Profit</TableHead>
              <TableHead className="text-[rgba(191,219,254,0.9)]">Lots</TableHead>
              <TableHead className="text-[rgba(191,219,254,0.9)]">Pips</TableHead>
              <TableHead className="text-[rgba(191,219,254,0.9)]">Gain</TableHead>
              <TableHead className="text-[rgba(191,219,254,0.9)]">Win Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-white">
            <TableRow>
              <TableCell className="font-medium">This Week</TableCell>
              <TableCell>{periods.thisWeek.trades}</TableCell>
              <TableCell>${periods.thisWeek.profit.toFixed(2)}</TableCell>
              <TableCell>{periods.thisWeek.lots.toFixed(2)}</TableCell>
              <TableCell>{periods.thisWeek.pips.toFixed(2)}</TableCell>
              <TableCell>{periods.thisWeek.gain.toFixed(2)}%</TableCell>
              <TableCell>{periods.thisWeek.wonTradesPercent?.toFixed(2) ?? 'N/A'}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">This Month</TableCell>
              <TableCell>{periods.thisMonth.trades}</TableCell>
              <TableCell>${periods.thisMonth.profit.toFixed(2)}</TableCell>
              <TableCell>{periods.thisMonth.lots.toFixed(2)}</TableCell>
              <TableCell>{periods.thisMonth.pips.toFixed(2)}</TableCell>
              <TableCell>{periods.thisMonth.gain.toFixed(2)}%</TableCell>
              <TableCell>{periods.thisMonth.wonTradesPercent?.toFixed(2) ?? 'N/A'}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">This Year</TableCell>
              <TableCell>{periods.thisYear.trades}</TableCell>
              <TableCell>${periods.thisYear.profit.toFixed(2)}</TableCell>
              <TableCell>{periods.thisYear.lots.toFixed(2)}</TableCell>
              <TableCell>{periods.thisYear.pips.toFixed(2)}</TableCell>
              <TableCell>{periods.thisYear.gain.toFixed(2)}%</TableCell>
              <TableCell>{periods.thisYear.wonTradesPercent?.toFixed(2) ?? 'N/A'}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const renderProfitCard = (profit: number) => {
    const color = profit >= 0 ? chartColors.primary : "rgba(239, 68, 68, 0.7)"; // Use red for negative profit

    return (
      <Card className="bg-[#1c1c1c] border-none">
        <CardHeader className="p-4">
          <CardTitle className="text-[rgba(191,219,254,1)] text-sm">Profit</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[100px] flex flex-col items-center justify-center">
            <div className="text-2xl font-bold" style={{ color }}>
              ${profit.toFixed(2)}
            </div>
            <div className="text-[rgba(191,219,254,0.6)] mt-1 text-xs">
              {profit >= 0 ? "Profitable" : "Loss"}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141414] text-white border-none max-w-4xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-[rgba(191,219,254,1)]">Account Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 overflow-y-auto">
          <div className="space-y-6 pb-6">
            {isLoading && <div className="text-center py-4">Loading metrics...</div>}
            {error && <div className="text-red-500 text-center py-4">{error}</div>}

            <Card className="bg-[#1c1c1c] border-none">
              <CardHeader>
                <CardTitle className="text-[rgba(191,219,254,1)]">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[rgba(191,219,254,0.6)]">Name</span>
                    <span className="text-[rgba(191,219,254,1)]">{account.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[rgba(191,219,254,0.6)]">Login</span>
                    <span className="text-[rgba(191,219,254,1)]">{account.login}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[rgba(191,219,254,0.6)]">Server</span>
                    <span className="text-[rgba(191,219,254,1)]">{account.server}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[rgba(191,219,254,0.6)]">Balance</span>
                    <span className="text-[rgba(191,219,254,1)]">{account.accountInfo?.balance}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[rgba(191,219,254,0.6)]">Equity</span>
                    <span className="text-[rgba(191,219,254,1)]">{account.accountInfo?.equity}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[rgba(191,219,254,0.6)]">Leverage</span>
                    <span className="text-[rgba(191,219,254,1)]">{account.accountInfo?.leverage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {metrics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderProfitCard(metrics.profit)}
                  {renderRatioCard("Profit Factor", metrics.profitFactor)}
                  {renderRatioCard("Sharpe Ratio", metrics.sharpeRatio)}
                  {renderRatioCard("Sortino Ratio", metrics.sortinoRatio)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderWinRateChart(metrics.wonTradesPercent, metrics.lostTradesPercent)}
                  {renderBalanceEquityChart(metrics.balance, metrics.equity)}
                  {renderBestWorstTradeChart(metrics.bestTrade, metrics.worstTrade)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderAverageWinLossChart(metrics.averageWin, metrics.averageLoss)}
                  {renderMaxDrawdownChart(metrics.maxDrawdown)}
                </div>

                {renderPeriodMetricsTable(metrics.periods)}

                <Card className="bg-[#1c1c1c] border-none">
                  <CardHeader>
                    <CardTitle className="text-[rgba(191,219,254,1)]">Balance History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics.dailyGrowth}>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.text} opacity={0.1} />
                          <XAxis dataKey="date" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                          <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: chartColors.background, borderColor: chartColors.text }}
                            itemStyle={{ color: chartColors.text }}
                            labelStyle={{ color: chartColors.text }}
                          />
                          <Line type="monotone" dataKey="balance" stroke={chartColors.primary} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <Card className="bg-[#1c1c1c] border-none">
              <CardHeader>
                <CardTitle className="text-[rgba(191,219,254,1)]">Open Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[rgba(191,219,254,0.9)]">Symbol</TableHead>
                      <TableHead className="text-[rgba(191,219,254,0.9)]">Type</TableHead>
                      <TableHead className="text-[rgba(191,219,254,0.9)]">Volume</TableHead>
                      <TableHead className="text-[rgba(191,219,254,0.9)]">Open Price</TableHead>
                      <TableHead className="text-[rgba(191,219,254,0.9)]">Current Price</TableHead>
                      <TableHead className="text-[rgba(191,219,254,0.9)]">Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-white">
                    {account.openTrades && account.openTrades.length > 0 ? (
                      account.openTrades.map((trade, index) => (
                        <TableRow key={index}>
                          <TableCell>{trade.symbol}</TableCell>
                          <TableCell>{trade.type}</TableCell>
                          <TableCell>{trade.volume}</TableCell>
                          <TableCell>{trade.openPrice}</TableCell>
                          <TableCell>{trade.currentPrice}</TableCell>
                          <TableCell>{trade.profit}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No open trades</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}