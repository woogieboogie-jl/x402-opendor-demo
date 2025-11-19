'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, Activity, Bot, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const mockChartData = [
  { time: '00:00', value: 10000 },
  { time: '04:00', value: 10240 },
  { time: '08:00', value: 9980 },
  { time: '12:00', value: 10580 },
  { time: '16:00', value: 11120 },
  { time: '20:00', value: 10905 },
  { time: '24:00', value: 11582 },
]

interface PortfolioStats {
  totalEquity: number
  tradingEquity: number
  availableBalance: number
  totalPnl: number
  pnlPercentage: number
  sharpeRatio: number
  winRate: number
  activeAgents: number
}

const mockStats: PortfolioStats = {
  totalEquity: 11582,
  tradingEquity: 7340,
  availableBalance: 4242,
  totalPnl: 905.14,
  pnlPercentage: 8.47,
  sharpeRatio: 2.15,
  winRate: 63.4,
  activeAgents: 2,
}

export function PortfolioOverview() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    console.log("[v0] Portfolio chart data:", mockChartData)
  }, [])
  
  // Theme-aware colors for charts
  const isDark = mounted && theme === 'dark'
  const chartColors = {
    grid: isDark ? '#374151' : '#e5e7eb', // gray-700 / gray-200
    axis: isDark ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
    line: isDark ? '#a78bfa' : '#8884d8', // violet-400 / purple-500
    tooltipBg: isDark ? '#1f2937' : '#ffffff', // gray-800 / white
    tooltipBorder: isDark ? '#374151' : '#e5e7eb', // gray-700 / gray-200
    tooltipText: isDark ? '#f3f4f6' : '#111827', // gray-100 / gray-900
  }
  
  if (!mounted) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Card className="p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Total Equity</p>
            </div>
            <p className="text-xl font-bold leading-none">${mockStats.totalEquity.toLocaleString()}</p>
          </Card>
          <Card className="p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Trading Equity</p>
            </div>
            <p className="text-xl font-bold leading-none">${mockStats.tradingEquity.toLocaleString()}</p>
          </Card>
          <Card className="p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Available Balance</p>
            </div>
            <p className="text-xl font-bold leading-none">${mockStats.availableBalance.toLocaleString()}</p>
          </Card>
        </div>
        <Card className="p-4">
          <div className="h-[200px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Card className="p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet className="h-3.5 w-3.5 text-primary" />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Total Equity</p>
          </div>
          <p className="text-xl font-bold leading-none">${mockStats.totalEquity.toLocaleString()}</p>
        </Card>

        <Card className="p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Trading Equity</p>
          </div>
          <p className="text-xl font-bold leading-none">${mockStats.tradingEquity.toLocaleString()}</p>
        </Card>

        <Card className="p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Available Balance</p>
          </div>
          <p className="text-xl font-bold leading-none">${mockStats.availableBalance.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Total Equity Performance</h3>
            <div className="h-[200px] w-full">
              {mounted && mockChartData && mockChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData} margin={{ top: 15, right: 15, left: 15, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 11, fill: chartColors.axis }}
                      stroke={chartColors.grid}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: chartColors.axis }}
                      stroke={chartColors.grid}
                      tickLine={false}
                      domain={['dataMin - 200', 'dataMax + 200']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: chartColors.tooltipBg,
                        border: `1px solid ${chartColors.tooltipBorder}`,
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: chartColors.tooltipText,
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={chartColors.line} 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: chartColors.line, stroke: isDark ? '#1f2937' : 'white', strokeWidth: 2 }}
                      isAnimationActive={false}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading chart...</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[140px]">
            <div className="p-2 rounded-md bg-muted/30">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Total P&L</p>
              <div className="flex items-center gap-1">
                {mockStats.totalPnl >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-accent" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <p className={`text-sm font-bold leading-none ${mockStats.totalPnl >= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {mockStats.totalPnl >= 0 ? '+' : ''}${mockStats.totalPnl.toLocaleString()}
                </p>
              </div>
              <p className={`text-[10px] mt-0.5 ${mockStats.pnlPercentage >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {mockStats.pnlPercentage >= 0 ? '+' : ''}{mockStats.pnlPercentage}%
              </p>
            </div>

            <div className="p-2 rounded-md bg-muted/30">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Sharpe Ratio</p>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-primary" />
                <p className="text-sm font-bold leading-none">{mockStats.sharpeRatio.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-2 rounded-md bg-muted/30">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Win Rate</p>
              <p className="text-sm font-bold leading-none">{mockStats.winRate}%</p>
            </div>

            <div className="p-2 rounded-md bg-muted/30">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Active Agents</p>
              <div className="flex items-center gap-1">
                <Bot className="h-3 w-3 text-primary" />
                <p className="text-sm font-bold leading-none">{mockStats.activeAgents}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
