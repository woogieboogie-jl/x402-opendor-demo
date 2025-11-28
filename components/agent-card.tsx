'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Play, Pause, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { LineChart, Line, Area, ResponsiveContainer, YAxis } from 'recharts'

export interface AgentCardProps {
  id: string
  name: string
  strategy: string
  funded: number // Treated as Equity
  pnl: number // 24h PnL
  symbol?: string
  status?: 'active' | 'paused' | 'stopped'
  health?: 'healthy' | 'warning' | 'offline'

  // Optional for My Agents but might be passed
  triggers?: string[]
  contexts?: string[]
  performanceData?: Array<{ time: string; value: number }>

  // Legacy/Unused in simplified view but kept for compatibility if needed
  winRate?: number
  sharpeRatio?: number
  isOwned?: boolean
  isPublished?: boolean
  creator?: string
  totalDeposits?: number
  investorCount?: number
  collateralStake?: number
  isKOL?: boolean
  kolName?: string
  socialOracle?: any
  qualificationCriteria?: any
}

export function AgentCard({
  id,
  name,
  strategy,
  funded,
  pnl,
  symbol = "BTC/USDC", // Default symbol
  status = 'active',
  health = 'healthy',
  triggers = [],
  contexts = [],
  performanceData = [],
}: AgentCardProps) {
  const { theme } = useTheme()
  const router = useRouter()

  // Theme-aware sparkline color
  const getSparklineColor = () => {
    if (pnl < 0) return '#ef4444'
    return theme === 'dark' ? '#22c55e' : '#10b981'
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) return
    router.push(`/agent/${id}`)
  }

  const getHealthColor = (h: string) => {
    switch (h) {
      case 'healthy': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card
      className="overflow-hidden transition-all cursor-pointer group h-full hover:border-primary/50"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2.5">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="mb-1.5 flex items-center gap-2">
                <CardTitle className="text-2xl leading-tight group-hover:text-primary transition-colors">
                  {name}
                </CardTitle>
                <div className={`h-2.5 w-2.5 rounded-full ${getHealthColor(health)} ring-2 ring-background`} title={`Health: ${health}`} />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant={status === 'active' ? 'default' : 'secondary'} className="text-[10px] py-0 px-1.5 h-5">
                  {status === 'active' ? (
                    <>
                      <Play className="mr-1 h-2.5 w-2.5" />
                      Running
                    </>
                  ) : (
                    <>
                      <Pause className="mr-1 h-2.5 w-2.5" />
                      Stopped
                    </>
                  )}
                </Badge>

                <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5">
                  {symbol}
                </Badge>
              </div>
            </div>
          </div>

          {performanceData.length > 0 && (
            <div className="flex-shrink-0 w-[120px] h-[36px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <defs>
                    <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={getSparklineColor()} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={getSparklineColor()} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill={`url(#gradient-${id})`}
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getSparklineColor()}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{strategy}</p>

          {(triggers.length > 0 || contexts.length > 0) && (
            <div className="flex flex-wrap gap-1">
              {triggers.map(trigger => (
                <Badge key={trigger} variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                  {trigger}
                </Badge>
              ))}
              {contexts.map(context => (
                <Badge key={context} variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                  {context}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5 leading-tight">Total Equity</p>
            <p className="text-lg font-bold leading-tight">
              ${funded.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5 leading-tight">24h P&L</p>
            <div className="flex items-center gap-1">
              {pnl >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-accent" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              )}
              <p className={`text-lg font-bold leading-tight ${pnl >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {pnl >= 0 ? '+' : ''}{pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/agent/${id}`)
            }}
          >
            Manage Agent
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
