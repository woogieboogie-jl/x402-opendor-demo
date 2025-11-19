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
import { getPublicAgents } from '@/lib/agents-data'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function MarketplacePage() {
  const [sortBy, setSortBy] = useState('sharpe')
  const [searchQuery, setSearchQuery] = useState('')
  const publicAgents = getPublicAgents()

  const sortedAgents = [...publicAgents].sort((a, b) => {
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
        <div className="w-full max-w-6xl">
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
