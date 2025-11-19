'use client'

import { NavHeader } from '@/components/nav-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
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
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, Play, Pause, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getAgentById } from '@/lib/agents-data'
import { useRouter, useParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { DepositModal } from '@/components/modals/deposit-modal'

export default function AgentDetailPage() {
  const { theme } = useTheme()
  const [showTxModal, setShowTxModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [agent, setAgent] = useState<ReturnType<typeof getAgentById>>(undefined)
  const router = useRouter()
  const params = useParams()
  
  const handleTogglePause = () => {
    if (agent) {
      setAgent({
        ...agent,
        status: agent.status === 'active' ? 'paused' : 'active'
      })
    }
  }
  
  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    router.push(`/create?edit=${agent?.id}`)
  }
  
  // Theme-aware colors for charts
  const isDark = theme === 'dark'
  const chartColors = {
    grid: isDark ? '#374151' : '#e5e7eb', // gray-700 / gray-200
    axis: isDark ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
    line: isDark ? '#a78bfa' : '#8884d8', // violet-400 / purple-500
    tooltipBg: isDark ? '#1f2937' : '#ffffff', // gray-800 / white
    tooltipBorder: isDark ? '#374151' : '#e5e7eb', // gray-700 / gray-200
    tooltipText: isDark ? '#f3f4f6' : '#111827', // gray-100 / gray-900
    tooltipItem: isDark ? '#a78bfa' : '#8884d8', // violet-400 / purple-500
  }

  useEffect(() => {
    if (params?.id && typeof params.id === 'string') {
      console.log('Fetching agent with ID:', params.id)
      const agentData = getAgentById(params.id)
      console.log('Agent data found:', agentData ? 'Yes' : 'No', agentData)
      setAgent(agentData)
    }
  }, [params?.id])
  
  if (!params?.id) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <h3 className="mb-2 text-xl font-semibold">Agent not found</h3>
                <p className="mb-6 text-center text-muted-foreground">
                  The agent you're looking for doesn't exist.
                </p>
                <Button onClick={() => router.push('/my-agents')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to My Agents
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const handleTxClick = (tx: any) => {
    setSelectedTx(tx)
    setShowTxModal(true)
  }

  // Normalize performance data format
  const performanceData = agent?.performanceData && agent.performanceData.length > 0
    ? agent.performanceData.map(p => ({
        time: 'time' in p ? p.time : p.date,
        value: p.value
      }))
    : []

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => {
                if (agent) {
                  router.push(agent.isOwned ? "/my-agents" : "/marketplace")
                } else {
                  router.push("/marketplace")
                }
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {agent?.isOwned ? "My Agents" : "Marketplace"}
            </Button>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{agent.name}</h1>
                  {agent.status && (
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status === 'active' ? 'Active' : 'Paused'}
                    </Badge>
                  )}
                  {agent.isPublished && (
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      Public
                    </Badge>
                  )}
                  {agent.creator && (
                    <span className="text-sm text-muted-foreground">by {agent.creator}</span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  {agent.strategy}
                </p>
                <div className="flex flex-wrap gap-2">
                  {agent.triggers.map(trigger => (
                    <Badge key={trigger} variant="outline">{trigger}</Badge>
                  ))}
                  {agent.contexts.map(context => (
                    <Badge key={context} variant="outline">{context}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                {agent.isOwned ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTogglePause}
                      className="gap-2"
                    >
                      {agent.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowDepositModal(true)}>Deposit More</Button>
                    {agent.isPublished && (
                      <Button variant="outline" size="sm" className="text-destructive">Unpublish</Button>
                    )}
                  </>
                ) : (
                  <Button onClick={() => setShowDepositModal(true)}>Deposit to Agent</Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Funded Amount</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${agent.funded.toLocaleString()}</p>
                {agent.totalDeposits && (
                  <p className="text-xs text-muted-foreground mt-1">Total deposits: ${agent.totalDeposits.toLocaleString()}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total P&L</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {agent.pnl >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-accent" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                  <p className={`text-2xl font-bold ${agent.pnl >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {agent.pnl >= 0 ? '+' : ''}${agent.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Sharpe Ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{agent.sharpeRatio.toFixed(2)}</p>
                {agent.sharpeTarget && agent.sharpeRatio >= agent.sharpeTarget && (
                  <p className="text-xs text-accent mt-1">Above {agent.sharpeTarget.toFixed(1)} target</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{agent.collateralStake ? 'Collateral Stake' : 'Win Rate'}</CardDescription>
              </CardHeader>
              <CardContent>
                {agent.collateralStake ? (
                  <>
                    <p className="text-2xl font-bold">${agent.collateralStake.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">USDC locked</p>
                  </>
                ) : (
                  <p className="text-2xl font-bold">{agent.winRate}%</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                {performanceData && performanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 15, right: 35, bottom: 15, left: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
                      <XAxis 
                        dataKey="time" 
                        stroke={chartColors.axis} 
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: chartColors.grid }}
                      />
                      <YAxis 
                        stroke={chartColors.axis} 
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: chartColors.grid }}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: chartColors.tooltipBg, 
                          border: `1px solid ${chartColors.tooltipBorder}`,
                          borderRadius: '8px',
                          padding: '8px 12px'
                        }}
                        labelStyle={{ color: chartColors.tooltipText, fontWeight: 'bold' }}
                        itemStyle={{ color: chartColors.tooltipItem }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={chartColors.line} 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 7, fill: chartColors.line, stroke: isDark ? '#1f2937' : 'white', strokeWidth: 2 }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No performance data available</p>
                  </div>
                )}
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
                      {agent.positions.length > 0 ? (
                        agent.positions.map((pos) => (
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No open positions
                          </TableCell>
                        </TableRow>
                      )}
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
                      {agent.completedTrades.length > 0 ? (
                        agent.completedTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="text-xs">{trade.date}</TableCell>
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No completed trades
                          </TableCell>
                        </TableRow>
                      )}
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
                      {agent.transactions.length > 0 ? (
                        agent.transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <Badge variant="outline">{tx.type}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {tx.type === 'Creation' ? `${tx.amount} USDC` : `$${tx.amount.toLocaleString()}`}
                          </TableCell>
                          <TableCell className="text-xs">{tx.date}</TableCell>
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No transactions
                          </TableCell>
                        </TableRow>
                      )}
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
                  {agent.reasoningLog.length > 0 ? (
                    <div className="space-y-4">
                      {agent.reasoningLog.map((log) => (
                      <div key={log.id} className="border-l-2 border-primary pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">{log.time}</p>
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
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No reasoning logs available
                    </div>
                  )}
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

      {showDepositModal && agent && (
        <DepositModal
          agentName={agent.name}
          agentStrategy={agent.strategy}
          agentTrigger={agent.triggers[0]}
          agentContexts={agent.contexts}
          agentPnl={agent.pnl}
          agentSharpeRatio={agent.sharpeRatio}
          agentWinRate={agent.winRate}
          isOwnAgent={agent.isOwned || false}
          onClose={() => setShowDepositModal(false)}
          onSuccess={() => {
            setShowDepositModal(false)
            // Optionally refresh agent data or show success message
          }}
        />
      )}
    </div>
  )
}
