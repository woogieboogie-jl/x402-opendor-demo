'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, MoreVertical, Pause, Play, Settings, Trash2, Shield, Users, ChevronDown, ChevronUp, CheckCircle2, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Progress } from '@/components/ui/progress'

export interface QualificationCriteria {
  sharpeRatio: { current: number; target: number }
  poolSize: { current: number; target: number }
  tradingVolume: { current: number; target: number }
  benchmarkPerformance: { current: number; target: number }
}

export interface AgentCardProps {
  id: string
  name: string
  strategy: string
  funded: number
  pnl: number
  winRate: number
  sharpeRatio: number
  
  // My Agents specific
  isOwned?: boolean
  status?: 'active' | 'paused'
  isPublished?: boolean
  sharpeTarget?: number
  totalDeposits?: number
  qualificationCriteria?: QualificationCriteria
  performanceData?: Array<{ time: string; value: number }>
  onTogglePause?: () => void
  
  // Public Agents specific
  creator?: string
  
  // Both
  collateralStake?: number
  investorCount?: number
  triggers?: string[]
  contexts?: string[]
}

export function AgentCard({
  id,
  name,
  strategy,
  funded,
  pnl,
  winRate,
  sharpeRatio,
  isOwned = false,
  status,
  isPublished = false,
  sharpeTarget = 2.0,
  totalDeposits,
  creator,
  collateralStake,
  investorCount,
  triggers = [],
  contexts = [],
  qualificationCriteria,
  performanceData = [],
  onTogglePause,
}: AgentCardProps) {
  const isReadyToPublish = isOwned && !isPublished && sharpeRatio >= sharpeTarget
  const [isQualificationExpanded, setIsQualificationExpanded] = useState(false)
  const router = useRouter()

  const calculateProgress = () => {
    if (!qualificationCriteria) return 0
    const criteria = [
      qualificationCriteria.sharpeRatio.current >= qualificationCriteria.sharpeRatio.target,
      qualificationCriteria.poolSize.current >= qualificationCriteria.poolSize.target,
      qualificationCriteria.tradingVolume.current >= qualificationCriteria.tradingVolume.target,
      qualificationCriteria.benchmarkPerformance.current >= qualificationCriteria.benchmarkPerformance.target,
    ]
    return (criteria.filter(Boolean).length / criteria.length) * 100
  }

  const qualificationProgress = calculateProgress()
  const completedCriteria = qualificationCriteria ? 
    [
      qualificationCriteria.sharpeRatio.current >= qualificationCriteria.sharpeRatio.target,
      qualificationCriteria.poolSize.current >= qualificationCriteria.poolSize.target,
      qualificationCriteria.tradingVolume.current >= qualificationCriteria.tradingVolume.target,
      qualificationCriteria.benchmarkPerformance.current >= qualificationCriteria.benchmarkPerformance.target,
    ].filter(Boolean).length : 0

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('[role="menuitem"]')
    ) {
      return
    }
    router.push(`/agent/${id}`)
  }

  console.log("[v0] Agent card sparkline data:", performanceData)

  return (
    <Card 
      className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer group h-full"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2.5">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              <CardTitle className="text-2xl leading-tight group-hover:text-primary transition-colors">
                {name}
              </CardTitle>
              
              {performanceData.length > 0 && (
                <div className="w-[120px] h-[40px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={pnl >= 0 ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'} 
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              {creator && <span className="text-xs text-muted-foreground">by {creator}</span>}
              
              {isOwned && status && (
                <Badge variant={status === 'active' ? 'default' : 'secondary'} className="text-[10px] py-0 px-1.5 h-5">
                  {status === 'active' ? (
                    <>
                      <Play className="mr-1 h-2.5 w-2.5" />
                      Active
                    </>
                  ) : (
                    <>
                      <Pause className="mr-1 h-2.5 w-2.5" />
                      Paused
                    </>
                  )}
                </Badge>
              )}
              
              {isPublished && (
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[10px] py-0 px-1.5 h-5">
                  Public
                </Badge>
              )}
              
              {isReadyToPublish && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] py-0 px-1.5 h-5">
                  Ready to Publish
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {isOwned && onTogglePause && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onTogglePause()
                }}
              >
                {status === 'active' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {isOwned && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Strategy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Delete Agent
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
            <p className="text-[10px] text-muted-foreground mb-0.5 leading-tight">Funded</p>
            <p className="text-lg font-bold leading-tight">
              ${funded.toLocaleString()}
            </p>
            {isPublished && totalDeposits && (
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                Total: ${totalDeposits.toLocaleString()}
              </p>
            )}
          </div>
          
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5 leading-tight">Total P&L</p>
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
          
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5 leading-tight">Win Rate</p>
            <p className="text-lg font-bold leading-tight">{winRate}%</p>
          </div>
          
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5 leading-tight">Sharpe Ratio</p>
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-bold leading-tight">{sharpeRatio.toFixed(2)}</p>
              {isOwned && (
                <span className="text-[10px] text-muted-foreground">/ {sharpeTarget.toFixed(1)}</span>
              )}
            </div>
            {isOwned && sharpeRatio >= sharpeTarget && (
              <p className="text-[10px] text-accent mt-0.5 leading-tight">Target reached!</p>
            )}
          </div>
        </div>

        {isOwned && !isPublished && qualificationCriteria && (
          <div 
            className="border rounded-lg overflow-hidden"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <div 
              className="p-2.5 bg-muted/30 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsQualificationExpanded(!isQualificationExpanded)
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold">Path to Public Agent</p>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    {completedCriteria}/4 Complete
                  </Badge>
                </div>
                
                {!isQualificationExpanded && (
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      variant={qualificationCriteria.sharpeRatio.current >= qualificationCriteria.sharpeRatio.target ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      {qualificationCriteria.sharpeRatio.current >= qualificationCriteria.sharpeRatio.target ? (
                        <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                      ) : (
                        <Clock className="mr-1 h-2.5 w-2.5" />
                      )}
                      Sharpe {qualificationCriteria.sharpeRatio.current.toFixed(1)}
                    </Badge>
                    <Badge 
                      variant={qualificationCriteria.poolSize.current >= qualificationCriteria.poolSize.target ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      {qualificationCriteria.poolSize.current >= qualificationCriteria.poolSize.target ? (
                        <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                      ) : (
                        <Clock className="mr-1 h-2.5 w-2.5" />
                      )}
                      Pool ${(qualificationCriteria.poolSize.current / 1000).toFixed(1)}k
                    </Badge>
                    <Badge 
                      variant={qualificationCriteria.tradingVolume.current >= qualificationCriteria.tradingVolume.target ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      {qualificationCriteria.tradingVolume.current >= qualificationCriteria.tradingVolume.target ? (
                        <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                      ) : (
                        <Clock className="mr-1 h-2.5 w-2.5" />
                      )}
                      Volume {Math.round((qualificationCriteria.tradingVolume.current / qualificationCriteria.tradingVolume.target) * 100)}%
                    </Badge>
                    <Badge 
                      variant={qualificationCriteria.benchmarkPerformance.current >= qualificationCriteria.benchmarkPerformance.target ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      {qualificationCriteria.benchmarkPerformance.current >= qualificationCriteria.benchmarkPerformance.target ? (
                        <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                      ) : (
                        <XCircle className="mr-1 h-2.5 w-2.5" />
                      )}
                      Benchmark
                    </Badge>
                  </div>
                )}
              </div>
              
              {isQualificationExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            
            {isQualificationExpanded && (
              <div className="p-3 space-y-3 bg-background">
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold">Overall Progress</p>
                    <p className="text-xs text-muted-foreground">{Math.round(qualificationProgress)}%</p>
                  </div>
                  <Progress value={qualificationProgress} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {qualificationCriteria.sharpeRatio.current >= qualificationCriteria.sharpeRatio.target ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-yellow-500" />
                      )}
                      <p className="text-xs font-medium">Sharpe Ratio</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {qualificationCriteria.sharpeRatio.current.toFixed(2)} / {qualificationCriteria.sharpeRatio.target.toFixed(1)} target
                    </p>
                  </div>
                  <Progress 
                    value={Math.min((qualificationCriteria.sharpeRatio.current / qualificationCriteria.sharpeRatio.target) * 100, 100)} 
                    className="h-1.5"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {qualificationCriteria.poolSize.current >= qualificationCriteria.poolSize.target ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-yellow-500" />
                      )}
                      <p className="text-xs font-medium">Minimum Pool Size</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ${qualificationCriteria.poolSize.current.toLocaleString()} / ${qualificationCriteria.poolSize.target.toLocaleString()}
                    </p>
                  </div>
                  <Progress 
                    value={Math.min((qualificationCriteria.poolSize.current / qualificationCriteria.poolSize.target) * 100, 100)} 
                    className="h-1.5"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {qualificationCriteria.tradingVolume.current >= qualificationCriteria.tradingVolume.target ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-yellow-500" />
                      )}
                      <p className="text-xs font-medium">Trading Volume</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ${qualificationCriteria.tradingVolume.current.toLocaleString()} / ${qualificationCriteria.tradingVolume.target.toLocaleString()}
                    </p>
                  </div>
                  <Progress 
                    value={Math.min((qualificationCriteria.tradingVolume.current / qualificationCriteria.tradingVolume.target) * 100, 100)} 
                    className="h-1.5"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {qualificationCriteria.benchmarkPerformance.current >= qualificationCriteria.benchmarkPerformance.target ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <p className="text-xs font-medium">Benchmark Performance</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{qualificationCriteria.benchmarkPerformance.current.toFixed(1)}% vs Market +{qualificationCriteria.benchmarkPerformance.target.toFixed(1)}%
                    </p>
                  </div>
                  <Progress 
                    value={Math.min((qualificationCriteria.benchmarkPerformance.current / qualificationCriteria.benchmarkPerformance.target) * 100, 100)} 
                    className="h-1.5"
                  />
                </div>
                
                {qualificationProgress === 100 ? (
                  <Button size="sm" className="w-full h-7 text-xs">
                    Publish Agent Now
                  </Button>
                ) : (
                  <p className="text-xs text-center text-muted-foreground pt-1">
                    Complete {4 - completedCriteria} more {4 - completedCriteria === 1 ? 'requirement' : 'requirements'} to publish
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {(collateralStake || investorCount) && (
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            {collateralStake && (
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground leading-tight">Collateral Staked</p>
                  <p className="text-xs font-semibold leading-tight">${collateralStake} USDC</p>
                </div>
              </div>
            )}
            {investorCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground leading-tight">Investors</p>
                  <p className="text-xs font-semibold leading-tight">{investorCount}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-1.5">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/agent/${id}`)
            }}
          >
            View Details
          </Button>
          {isOwned && isReadyToPublish && (
            <Button 
              size="sm" 
              className="flex-1 h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation()
                // Handle publish action
              }}
            >
              Publish Agent
            </Button>
          )}
          {!isOwned && (
            <Button 
              size="sm" 
              className="flex-1 h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation()
                // Handle deposit action
              }}
            >
              Deposit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
