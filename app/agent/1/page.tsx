'use client'

import { NavHeader } from '@/components/nav-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Shield, Users } from 'lucide-react'
import { X402Badge } from '@/components/x402-badge'
import { useState } from 'react'

// Mock performance data
const performanceData = [
  { date: 'Oct 18', value: 10000 },
  { date: 'Oct 20', value: 10500 },
  { date: 'Oct 22', value: 11200 },
  { date: 'Oct 24', value: 10800 },
  { date: 'Oct 26', value: 11500 },
  { date: 'Oct 28', value: 12000 },
  { date: 'Oct 30', value: 11800 },
  { date: 'Nov 1', value: 12200 },
  { date: 'Nov 3', value: 12287 },
]

const positions = [
  { asset: 'BTC', type: 'Long', entry: 43250, current: 44180, pnl: 930, leverage: '3x', txHash: '0x8f3a...2b1c' },
  { asset: 'ETH', type: 'Short', entry: 2280, current: 2240, pnl: 180, leverage: '2x', txHash: '0x6d2e...9a4f' },
]

const completedTrades = [
  { date: 'Nov 3', asset: 'SOL', type: 'Long', entry: 98.5, exit: 102.3, pnl: 380, duration: '4h', txHash: '0x1a5c...7e3d' },
  { date: 'Nov 2', asset: 'BTC', type: 'Short', entry: 44500, exit: 43800, pnl: 670, duration: '8h', txHash: '0x9b2f...3c8e' },
  { date: 'Nov 1', asset: 'ETH', type: 'Long', entry: 2210, exit: 2180, pnl: -120, duration: '2h', txHash: '0x4e7d...1a9b' },
]

const transactions = [
  { type: 'Trade', date: 'Nov 3 14:23', amount: 380, txHash: '0x1a5c...7e3d', chain: 'Ethereum' },
  { type: 'Trade', date: 'Nov 2 09:15', amount: 670, txHash: '0x9b2f...3c8e', chain: 'Ethereum' },
  { type: 'Deposit', date: 'Nov 1 16:42', amount: 5000, txHash: '0x7c4b...5f2a', chain: 'Ethereum' },
  { type: 'Trade', date: 'Nov 1 08:30', amount: -120, txHash: '0x4e7d...1a9b', chain: 'Ethereum' },
]

export default function WhaleTrackerPage() {
  const [selectedTx, setSelectedTx] = useState<any>(null)

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Whale Tracker</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <span>by 0x742d...4e89</span>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  Public Agent
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Follows large on-chain movements and executes counter-trend trades with 2-5x leverage
              </p>
            </div>
            <Button size="lg">Deposit to Agent</Button>
          </div>

          <div className="flex gap-2 mb-6">
            <Badge variant="secondary">Volume Spike</Badge>
            <Badge variant="outline">On-chain</Badge>
            <Badge variant="outline">Market</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">2.3</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">67.5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <p className="text-3xl font-bold text-accent">+$8,247</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$45,640</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Collateral Staked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$500 USDC</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Locked to ensure agent legitimacy
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Investors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12 users</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Currently invested in this agent
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={['dataMin - 500', 'dataMax + 500']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="positions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="trades">Completed Trades</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
            </TabsList>

            <TabsContent value="positions">
              {/* Positions content here */}
            </TabsContent>

            <TabsContent value="trades">
              {/* Completed Trades content here */}
            </TabsContent>

            <TabsContent value="transactions">
              {/* Transactions content here */}
            </TabsContent>

            <TabsContent value="reasoning">
              {/* Reasoning content here */}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        {/* Dialog content here */}
      </Dialog>
    </div>
  )
}
