'use client'

import { NavHeader } from '@/components/nav-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Shield, Users } from 'lucide-react'

const performanceData = [
  { date: 'Oct 18', value: 10000 },
  { date: 'Oct 20', value: 10800 },
  { date: 'Oct 22', value: 11500 },
  { date: 'Oct 24', value: 11200 },
  { date: 'Oct 26', value: 11800 },
  { date: 'Oct 28', value: 12400 },
  { date: 'Oct 30', value: 12100 },
  { date: 'Nov 1', value: 12650 },
  { date: 'Nov 3', value: 12450 },
]

export default function SentimentScalperPage() {
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
              <h1 className="text-4xl font-bold mb-2">Sentiment Scalper</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <span>by 0x8f3a...2b1c</span>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  Public Agent
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Analyzes social sentiment across Twitter and Reddit, scalps quick moves on trending tokens
              </p>
            </div>
            <Button size="lg">Deposit to Agent</Button>
          </div>

          <div className="flex gap-2 mb-6">
            <Badge variant="secondary">Social Signal</Badge>
            <Badge variant="outline">Social</Badge>
            <Badge variant="outline">Market</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">2.8</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">71.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <p className="text-3xl font-bold text-accent">+$12,450</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$67,320</p>
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
                <p className="text-2xl font-bold">$1,000 USDC</p>
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
                <p className="text-2xl font-bold">24 users</p>
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
        </div>
      </main>
    </div>
  )
}
