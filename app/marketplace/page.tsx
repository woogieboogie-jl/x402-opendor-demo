'use client'

import { NavHeader } from '@/components/nav-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AgentComparisonChart } from '@/components/agent-comparison-chart'
import { AgentCard, AgentCardProps } from '@/components/agent-card'
import { Search } from 'lucide-react'
import { useState } from 'react'

const mockPublicAgents: AgentCardProps[] = [
  {
    id: '1',
    name: 'Whale Tracker',
    creator: '0x742d...4e89',
    strategy: 'Follows large on-chain movements and executes counter-trend trades with 2-5x leverage',
    funded: 5240,
    pnl: 8247.32,
    winRate: 67.5,
    sharpeRatio: 2.3,
    totalDeposits: 45640,
    collateralStake: 500,
    investorCount: 12,
    triggers: ['Volume Spike'],
    contexts: ['On-chain', 'Market'],
  },
  {
    id: '4',
    name: 'Sentiment Scalper',
    creator: '0x8f3a...2b1c',
    strategy: 'Analyzes social sentiment across Twitter and Reddit, scalps quick moves on trending tokens',
    funded: 0,
    pnl: 12450.18,
    winRate: 71.2,
    sharpeRatio: 2.8,
    totalDeposits: 67320,
    collateralStake: 1000,
    investorCount: 24,
    triggers: ['Social Signal'],
    contexts: ['Social', 'Market'],
  },
  {
    id: '5',
    name: 'Breakout Hunter',
    creator: '0x6d2e...9a4f',
    strategy: 'Identifies technical breakout patterns and rides momentum with trailing stops',
    funded: 0,
    pnl: 5630.92,
    winRate: 58.3,
    sharpeRatio: 2.1,
    totalDeposits: 32180,
    collateralStake: 350,
    investorCount: 8,
    triggers: ['Price Movement'],
    contexts: ['Market'],
  },
  {
    id: '6',
    name: 'Volume Rider',
    creator: '0x1a5c...7e3d',
    strategy: 'Enters positions when unusual volume spikes occur across multiple timeframes',
    funded: 0,
    pnl: 9872.45,
    winRate: 64.8,
    sharpeRatio: 2.5,
    totalDeposits: 51200,
    collateralStake: 750,
    investorCount: 16,
    triggers: ['Volume Spike'],
    contexts: ['Market', 'On-chain'],
  },
]

export default function MarketplacePage() {
  const [sortBy, setSortBy] = useState('sharpe')
  const [searchQuery, setSearchQuery] = useState('')

  const sortedAgents = [...mockPublicAgents].sort((a, b) => {
    switch (sortBy) {
      case 'sharpe':
        return b.sharpeRatio - a.sharpeRatio
      case 'deposits':
        return (b.totalDeposits || 0) - (a.totalDeposits || 0)
      case 'winrate':
        return b.winRate - a.winRate
      case 'pnl':
        return b.pnl - a.pnl
      default:
        return 0
    }
  })

  const filteredAgents = sortedAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.strategy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-8 flex justify-center items-start">
        <div className="w-full max-w-7xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold leading-tight">Public Agents Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and invest in top-performing AI trading agents created by the community
            </p>
          </div>

          <AgentComparisonChart />

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sharpe">Sharpe Ratio</SelectItem>
                  <SelectItem value="deposits">Total Deposits</SelectItem>
                  <SelectItem value="winrate">Win Rate</SelectItem>
                  <SelectItem value="pnl">Total P&L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} {...agent} />
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">No agents found</h3>
                <p className="text-center text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
