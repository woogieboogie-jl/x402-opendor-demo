'use client'

import { NavHeader } from '@/components/nav-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PortfolioOverview } from '@/components/portfolio-overview'
import { AgentCard, AgentCardProps } from '@/components/agent-card'
import Link from 'next/link'
import { Bot, Plus } from 'lucide-react'
import { useState } from 'react'

const generatePerformanceData = (startValue: number, trend: 'up' | 'down' | 'flat') => {
  const data = []
  let value = startValue
  for (let i = 0; i < 24; i++) {
    const change = trend === 'up' ? Math.random() * 100 : trend === 'down' ? -Math.random() * 100 : (Math.random() - 0.5) * 50
    value += change
    data.push({ time: `${i}:00`, value })
  }
  return data
}

const initialAgents: AgentCardProps[] = [
  {
    id: '1',
    name: 'Whale Tracker',
    strategy: 'Follows large on-chain movements and executes counter-trend trades',
    funded: 5240,
    pnl: 1247.32,
    winRate: 67.5,
    sharpeRatio: 2.3,
    isOwned: true,
    status: 'active',
    isPublished: true,
    sharpeTarget: 2.0,
    totalDeposits: 15640,
    collateralStake: 500,
    investorCount: 12,
    triggers: ['Volume Spike'],
    contexts: ['On-chain', 'Market'],
    performanceData: generatePerformanceData(5000, 'up'),
  },
  {
    id: '2',
    name: 'Elon Follower',
    strategy: 'Monitors Elon Musk tweets and trades based on sentiment',
    funded: 2100,
    pnl: -342.18,
    winRate: 42.1,
    sharpeRatio: 1.2,
    isOwned: true,
    status: 'active',
    isPublished: false,
    sharpeTarget: 2.0,
    triggers: ['Social Signal'],
    contexts: ['Social'],
    performanceData: generatePerformanceData(2500, 'down'),
    qualificationCriteria: {
      sharpeRatio: { current: 1.2, target: 2.0 },
      poolSize: { current: 2100, target: 5000 },
      tradingVolume: { current: 8500, target: 20000 },
      benchmarkPerformance: { current: 3.2, target: 8.1 },
    },
  },
  {
    id: '3',
    name: 'Momentum Hunter',
    strategy: 'Scalps momentum breakouts with tight stop losses',
    funded: 0,
    pnl: 0,
    winRate: 0,
    sharpeRatio: 0,
    isOwned: true,
    status: 'paused',
    isPublished: false,
    sharpeTarget: 2.0,
    triggers: ['Price Movement'],
    contexts: ['Market'],
    performanceData: [],
    qualificationCriteria: {
      sharpeRatio: { current: 0, target: 2.0 },
      poolSize: { current: 0, target: 5000 },
      tradingVolume: { current: 0, target: 20000 },
      benchmarkPerformance: { current: 0, target: 8.1 },
    },
  },
]

export default function MyAgentsPage() {
  const [agents, setAgents] = useState(initialAgents)

  const handleTogglePause = (agentId: string) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId
          ? { ...agent, status: agent.status === 'active' ? 'paused' : 'active' as 'active' | 'paused' }
          : agent
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-8 flex justify-center items-start">
        <div className="w-full max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-bold leading-tight">My Agents</h1>
              <p className="text-sm text-muted-foreground">
                Manage your AI trading agents and track performance
              </p>
            </div>
            <Button asChild>
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Agent
              </Link>
            </Button>
          </div>

          <PortfolioOverview />

          {agents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">No agents yet</h3>
                <p className="mb-6 text-center text-muted-foreground">
                  Create your first AI trading agent to get started
                </p>
                <Button asChild>
                  <Link href="/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Agent
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {agents.map((agent) => (
                <AgentCard 
                  key={agent.id} 
                  {...agent} 
                  onTogglePause={() => handleTogglePause(agent.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
