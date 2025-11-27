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
import { AgentRankingTable } from '@/components/agent-ranking-table'
import { AgentCard, AgentCardProps } from '@/components/agent-card'
import { getPublicAgents } from '@/lib/agents-data'
import { Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function MarketplacePage() {
  const [sortBy, setSortBy] = useState('sharpe')
  const [searchQuery, setSearchQuery] = useState('')
  const [showKOLOnly, setShowKOLOnly] = useState(false)
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

  const filteredAgents = sortedAgents.filter(agent => {
    // Apply KOL filter
    if (showKOLOnly && !agent.isKOL) {
      return false
    }
    // Apply search filter
    return agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.strategy.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-sm text-muted-foreground">
                Discover and invest in top-performing AI trading agents created by the community
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8 items-stretch">
            <div className="md:col-span-2">
          <AgentComparisonChart />
            </div>
            <div className="md:col-span-1">
              <AgentRankingTable agents={publicAgents} />
            </div>
          </div>

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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className={`h-4 w-4 ${showKOLOnly ? 'text-purple-500' : 'text-muted-foreground'}`} />
                <Label htmlFor="kol-filter" className="text-sm font-medium cursor-pointer">
                  KOL Only
                </Label>
                <Switch
                  id="kol-filter"
                  checked={showKOLOnly}
                  onCheckedChange={setShowKOLOnly}
                  aria-label="Filter to show only KOL agents"
                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:hover:bg-purple-600"
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
