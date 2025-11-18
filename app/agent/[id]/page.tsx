'use client'

import { NavHeader } from '@/components/nav-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X402Badge } from '@/components/x402-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const performanceData = [
  { time: '00:00', value: 5000 },
  { time: '04:00', value: 5120 },
  { time: '08:00', value: 5240 },
  { time: '12:00', value: 5180 },
  { time: '16:00', value: 5340 },
  { time: '20:00', value: 5487 },
]

const positions = [
  { id: '1', asset: 'BTC/USD', type: 'Long', entry: 42350, current: 43120, pnl: 770, leverage: '3x', txHash: '0x1234...5678' },
  { id: '2', asset: 'ETH/USD', type: 'Short', entry: 3250, current: 3180, pnl: 210, leverage: '2x', txHash: '0xabcd...ef01' },
]

const completedTrades = [
  { id: '1', date: '2024-01-15 14:32', asset: 'BTC/USD', type: 'Long', entry: 41200, exit: 42100, pnl: 900, duration: '4h 23m', txHash: '0x9876...5432' },
  { id: '2', date: '2024-01-15 08:15', asset: 'SOL/USD', type: 'Short', entry: 98.5, exit: 95.2, pnl: 198, duration: '2h 15m', txHash: '0xfedc...ba98' },
  { id: '3', date: '2024-01-14 22:45', asset: 'ETH/USD', type: 'Long', entry: 3100, exit: 3080, pnl: -120, duration: '6h 12m', txHash: '0x1111...2222' },
]

const transactions = [
  { id: '1', type: 'Creation', amount: 10, date: '2024-01-10 10:00', txHash: '0xaaaa...bbbb', chain: 'Ethereum' },
  { id: '2', type: 'Deposit', amount: 5000, date: '2024-01-10 10:15', txHash: '0xcccc...dddd', chain: 'Ethereum' },
  { id: '3', type: 'Trade', amount: 900, date: '2024-01-15 14:32', txHash: '0x9876...5432', chain: 'Ethereum' },
  { id: '4', type: 'Deposit', amount: 240, date: '2024-01-14 16:20', txHash: '0xeeee...ffff', chain: 'Ethereum' },
]

const reasoningLog = [
  { id: '1', time: '2024-01-15 14:32', trigger: 'Volume Spike', context: 'On-chain whale movement detected', action: 'Opened long position BTC 3x leverage', reasoning: 'Large wallet transferred 1000 BTC to exchange, historically precedes price increase' },
  { id: '2', time: '2024-01-15 08:15', trigger: 'Price Movement', context: 'SOL broke resistance', action: 'Opened short position SOL 2x', reasoning: 'Price hit overbought RSI levels combined with decreasing volume' },
]

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const [showTxModal, setShowTxModal] = useState(false)
  const [selectedTx, setSelectedTx] = useState<any>(null)

  const handleTxClick = (tx: any) => {
    setSelectedTx(tx)
    setShowTxModal(true)
  }

  console.log("[v0] Agent detail chart data:", performanceData)

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/my-agents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Agents
              </Link>
            </Button>
            
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">Whale Tracker</h1>
                  <Badge variant="default">Active</Badge>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    Public
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  Follows large on-chain movements and executes counter-trend trades with 2-5x leverage
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Volume Spike</Badge>
                  <Badge variant="outline">On-chain Context</Badge>
                  <Badge variant="outline">Market Context</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Deposit More</Button>
                <Button variant="outline" className="text-destructive">Unpublish</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Funded Amount</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$5,240</p>
                <p className="text-xs text-muted-foreground mt-1">Total deposits: $15,640</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total P&L</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <p className="text-2xl font-bold text-accent">+$1,247.32</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Sharpe Ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">2.3</p>
                <p className="text-xs text-accent mt-1">Above 2.0 target</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Collateral Stake</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$500</p>
                <p className="text-xs text-muted-foreground mt-1">USDC locked</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 15, right: 35, bottom: 15, left: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      domain={['dataMin - 100', 'dataMax + 100']}
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
                      activeDot={{ r: 7, fill: 'hsl(var(--primary))', stroke: 'white', strokeWidth: 2 }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="positions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="trades">Completed Trades</TabsTrigger>
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              <TabsTrigger value="reasoning">Agent Reasoning</TabsTrigger>
            </TabsList>

            <TabsContent value="positions">
              <Card>
                <CardHeader>
                  <CardTitle>Current Open Positions</CardTitle>
                  <CardDescription>Active trades being managed by the agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Entry Price</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Leverage</TableHead>
                        <TableHead>Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positions.map((pos) => (
                        <TableRow key={pos.id}>
                          <TableCell className="font-medium">{pos.asset}</TableCell>
                          <TableCell>
                            <Badge variant={pos.type === 'Long' ? 'default' : 'secondary'}>
                              {pos.type}
                            </Badge>
                          </TableCell>
                          <TableCell>${pos.entry.toLocaleString()}</TableCell>
                          <TableCell>${pos.current.toLocaleString()}</TableCell>
                          <TableCell className={pos.pnl >= 0 ? 'text-accent' : 'text-destructive'}>
                            {pos.pnl >= 0 ? '+' : ''}${pos.pnl}
                          </TableCell>
                          <TableCell>{pos.leverage}</TableCell>
                          <TableCell>
                            <X402Badge onClick={() => handleTxClick({ txHash: pos.txHash, type: 'Trade' })} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trades">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Trades</CardTitle>
                  <CardDescription>Historical trade performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Entry</TableHead>
                        <TableHead>Exit</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-mono text-xs">{trade.date}</TableCell>
                          <TableCell className="font-medium">{trade.asset}</TableCell>
                          <TableCell>
                            <Badge variant={trade.type === 'Long' ? 'default' : 'secondary'}>
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell>${trade.entry.toLocaleString()}</TableCell>
                          <TableCell>${trade.exit.toLocaleString()}</TableCell>
                          <TableCell className={trade.pnl >= 0 ? 'text-accent font-semibold' : 'text-destructive font-semibold'}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{trade.duration}</TableCell>
                          <TableCell>
                            <X402Badge onClick={() => handleTxClick({ txHash: trade.txHash, type: 'Trade', amount: trade.pnl })} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History (x402)</CardTitle>
                  <CardDescription>All transactions recorded via x402 protocol</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Chain</TableHead>
                        <TableHead>Transaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <Badge variant="outline">{tx.type}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {tx.type === 'Creation' ? `${tx.amount} USDC` : `$${tx.amount.toLocaleString()}`}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{tx.date}</TableCell>
                          <TableCell>{tx.chain}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleTxClick(tx)}
                              className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
                            >
                              {tx.txHash}
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reasoning">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Reasoning Log</CardTitle>
                  <CardDescription>Decision-making process and trade rationale</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reasoningLog.map((log) => (
                      <div key={log.id} className="border-l-2 border-primary pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-mono text-xs text-muted-foreground">{log.time}</p>
                          <Badge variant="outline">{log.trigger}</Badge>
                        </div>
                        <p className="font-semibold mb-1">{log.action}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Context:</span> {log.context}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Reasoning:</span> {log.reasoning}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showTxModal && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowTxModal(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Transaction Receipt</CardTitle>
              <CardDescription>x402 Protocol Transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Transaction Hash</Label>
                <p className="font-mono text-sm break-all">{selectedTx.txHash}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Chain</Label>
                <p className="text-sm">{selectedTx.chain || 'Ethereum'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Timestamp</Label>
                <p className="text-sm">{selectedTx.date || new Date().toLocaleString()}</p>
              </div>
              {selectedTx.amount && (
                <div>
                  <Label className="text-xs text-muted-foreground">Amount</Label>
                  <p className="text-sm font-semibold">${selectedTx.amount}</p>
                </div>
              )}
              <Button className="w-full" onClick={() => setShowTxModal(false)}>
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={className}>{children}</label>
}
