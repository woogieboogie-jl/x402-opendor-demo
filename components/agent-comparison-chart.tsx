'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { TrendingUp, ExternalLink } from 'lucide-react'

interface AgentData {
  id: string
  name: string
  color: string
  currentValue: number
  sharpeRatio: number
  winRate: number
}

const agents: AgentData[] = [
  { id: '1', name: 'Whale Tracker', color: '#8b5cf6', currentValue: 12287.65, sharpeRatio: 2.3, winRate: 67.5 },
  { id: '4', name: 'Sentiment Scalper', color: '#3b82f6', currentValue: 10476.04, sharpeRatio: 2.8, winRate: 71.2 },
  { id: '5', name: 'Breakout Hunter', color: '#f97316', currentValue: 6740.09, sharpeRatio: 2.1, winRate: 58.3 },
  { id: '6', name: 'Volume Rider', color: '#1f2937', currentValue: 5226.24, sharpeRatio: 2.5, winRate: 64.8 },
  { id: '7', name: 'Momentum Master', color: '#6366f1', currentValue: 4485.14, sharpeRatio: 1.9, winRate: 55.2 },
  { id: '8', name: 'Grid Trader', color: '#10b981', currentValue: 3734.38, sharpeRatio: 1.7, winRate: 62.1 },
]

// Generate mock historical data
const generateChartData = () => {
  const data = []
  const startDate = new Date('2024-10-18')
  const points = 150
  
  for (let i = 0; i < points; i++) {
    const date = new Date(startDate)
    date.setHours(date.getHours() + i * 3)
    
    const point: any = {
      date: date.toISOString(),
      timestamp: date.getTime(),
    }
    
    agents.forEach((agent, agentIndex) => {
      // Different volatility and trend for each agent
      const baseValue = 10000
      const trend = agentIndex === 1 ? 0.15 : agentIndex === 5 ? -0.35 : (agentIndex - 2) * 0.05
      const volatility = 0.02 + agentIndex * 0.005
      const randomWalk = Math.random() * volatility * 2 - volatility
      
      if (i === 0) {
        point[agent.id] = baseValue
      } else {
        const prevValue = data[i - 1][agent.id]
        point[agent.id] = prevValue * (1 + trend / points + randomWalk)
      }
    })
    
    data.push(point)
  }
  
  return data
}

const chartData = generateChartData()

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  const agent = agents.find(a => a.id === payload[0].dataKey)
  if (!agent) return null

  return (
    <Card className="border-2 shadow-xl" style={{ borderColor: agent.color }}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: agent.color }}
          />
          <p className="font-semibold text-lg">{agent.name}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between gap-6">
            <span className="text-sm text-muted-foreground">Account Value:</span>
            <span className="font-bold text-accent">${payload[0].value.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-sm text-muted-foreground">Sharpe Ratio:</span>
            <span className="font-semibold">{agent.sharpeRatio.toFixed(1)}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-sm text-muted-foreground">Win Rate:</span>
            <span className="font-semibold">{agent.winRate}%</span>
          </div>
        </div>

        <Button asChild size="sm" className="w-full">
          <Link href={`/agent/${agent.id}`}>
            View Details
            <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function AgentComparisonChart() {
  const [timeframe, setTimeframe] = useState<'all' | '72h'>('all')
  const [displayMode, setDisplayMode] = useState<'dollar' | 'percent'>('dollar')

  const filteredData = timeframe === '72h' 
    ? chartData.slice(-24) 
    : chartData

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Agent Performance Comparison</h2>
            <p className="text-xs text-muted-foreground">
              Compare total account value across all public agents
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={displayMode === 'dollar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('dollar')}
                className="h-7 px-3"
              >
                $
              </Button>
              <Button
                variant={displayMode === 'percent' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('percent')}
                className="h-7 px-3"
              >
                %
              </Button>
            </div>
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={timeframe === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe('all')}
                className="h-7 px-3"
              >
                ALL
              </Button>
              <Button
                variant={timeframe === '72h' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe('72h')}
                className="h-7 px-3"
              >
                72H
              </Button>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp)
                  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                }}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {agents.map((agent) => (
                <Line
                  key={agent.id}
                  type="monotone"
                  dataKey={agent.id}
                  stroke={agent.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
