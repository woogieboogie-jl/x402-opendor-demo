'use client'

import { NavHeader } from '@/components/nav-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X402Badge } from '@/components/x402-badge'
import { LaunchPaymentModal } from '@/components/modals/launch-payment-modal'
import { useState } from 'react'
import { TrendingUp, Volume2, Twitter, BarChart3, Globe, LinkIcon, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Trigger = 'price' | 'volume' | 'social'
type Context = 'market' | 'social' | 'onchain'

const triggers = [
  { id: 'price' as Trigger, label: 'Price Movement', icon: TrendingUp, description: 'Technical price action signals' },
  { id: 'volume' as Trigger, label: 'Volume Spike', icon: Volume2, description: 'Unusual trading volume detection' },
  { id: 'social' as Trigger, label: 'Social Signal', icon: Twitter, description: 'Twitter/social media triggers' },
]

const contexts = [
  { id: 'market' as Context, label: 'Market Context', icon: BarChart3, description: 'Price action, indicators, order book' },
  { id: 'social' as Context, label: 'Social Context', icon: Globe, description: 'Sentiment analysis, trends, influencers' },
  { id: 'onchain' as Context, label: 'On-chain Context', icon: LinkIcon, description: 'Whale movements, exchange flows' },
]

export default function CreateAgentPage() {
  const router = useRouter()
  const [agentName, setAgentName] = useState('')
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null)
  const [selectedContexts, setSelectedContexts] = useState<Context[]>([])
  const [strategy, setStrategy] = useState('')
  const [showSocialConfig, setShowSocialConfig] = useState(false)
  const [twitterHandles, setTwitterHandles] = useState('elonmusk')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const calculateLaunchFee = () => {
    let baseFee = 10 // Base 10 USDC
    
    // Add fee for trigger (already included in base)
    
    // Add fee per context selected
    const contextFee = selectedContexts.length * 5 // 5 USDC per context
    
    // Add fee based on strategy length
    const strategyFee = Math.floor(strategy.length / 100) * 2 // 2 USDC per 100 characters
    
    return baseFee + contextFee + strategyFee
  }

  const launchFee = calculateLaunchFee()

  const handleContextToggle = (contextId: Context) => {
    setSelectedContexts(prev => 
      prev.includes(contextId) 
        ? prev.filter(c => c !== contextId)
        : prev.length < 3 ? [...prev, contextId] : prev
    )
  }

  const handleTriggerSelect = (triggerId: Trigger) => {
    setSelectedTrigger(triggerId)
    setShowSocialConfig(triggerId === 'social')
  }

  const handleLaunch = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    router.push('/my-agents')
  }

  const isValid = agentName && selectedTrigger && selectedContexts.length > 0 && strategy.length >= 50

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Create AI Trading Agent</h1>
            <p className="text-muted-foreground">
              Configure your agent's behavior by selecting triggers, context, and defining a custom strategy
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Agent Name */}
              <Card>
                <CardHeader>
                  <CardTitle>Agent Identity</CardTitle>
                  <CardDescription>Give your agent a unique name</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                      id="agent-name"
                      placeholder="e.g., Momentum Hunter, Whale Tracker, Elon Follower"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Trigger Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Trigger</CardTitle>
                  <CardDescription>Choose what signals initiate trades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {triggers.map((trigger) => {
                      const Icon = trigger.icon
                      const isSelected = selectedTrigger === trigger.id
                      return (
                        <button
                          key={trigger.id}
                          onClick={() => handleTriggerSelect(trigger.id)}
                          className={`flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <div className="font-medium text-sm">{trigger.label}</div>
                            <div className="text-xs text-muted-foreground">{trigger.description}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {showSocialConfig && (
                    <div className="mt-4 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <Label htmlFor="twitter-handles">Twitter Handles to Monitor</Label>
                      <Input
                        id="twitter-handles"
                        placeholder="elonmusk, VitalikButerin, etc."
                        value={twitterHandles}
                        onChange={(e) => setTwitterHandles(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated list of Twitter handles (without @)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Context Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Context</CardTitle>
                  <CardDescription>Select data sources for analysis (choose 1-3)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {contexts.map((context) => {
                      const Icon = context.icon
                      const isSelected = selectedContexts.includes(context.id)
                      return (
                        <button
                          key={context.id}
                          onClick={() => handleContextToggle(context.id)}
                          className={`flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all ${
                            isSelected 
                              ? 'border-accent bg-accent/5' 
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                          <div>
                            <div className="font-medium text-sm">{context.label}</div>
                            <div className="text-xs text-muted-foreground">{context.description}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Strategy Prompt */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Trading Strategy
                      </CardTitle>
                      <CardDescription>Describe your strategy in detail (50-500 characters)</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Get Ideas
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., When Elon tweets about Doge and on-chain volume spikes by 50%, go long with 3x leverage. Exit when price increases 5% or if sentiment turns negative..."
                    className="min-h-[160px] text-base"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={strategy.length >= 50 ? 'text-accent' : 'text-muted-foreground'}>
                      {strategy.length}/500 characters {strategy.length >= 50 && '✓'}
                    </span>
                    {strategy.length >= 50 && (
                      <span className="text-accent font-medium">Strategy looks good!</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <p className="font-medium">{agentName || 'Unnamed Agent'}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Trigger</Label>
                      <div className="mt-1">
                        {selectedTrigger ? (
                          <Badge variant="outline">{triggers.find(t => t.id === selectedTrigger)?.label}</Badge>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not selected</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Context</Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedContexts.length > 0 ? (
                          selectedContexts.map(ctx => (
                            <Badge key={ctx} variant="outline">{contexts.find(c => c.id === ctx)?.label}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">None selected</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Strategy</Label>
                      <p className="text-sm line-clamp-4">
                        {strategy || 'No strategy defined'}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-muted-foreground">Launch Fee</Label>
                        <X402Badge />
                      </div>
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-2xl font-bold">{launchFee} USDC</span>
                        <span className="text-xs text-muted-foreground">+ gas</span>
                      </div>
                      {launchFee > 10 && (
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          <p>Base: 10 USDC</p>
                          {selectedContexts.length > 0 && (
                            <p>Contexts ({selectedContexts.length}): +{selectedContexts.length * 5} USDC</p>
                          )}
                          {strategy.length > 0 && (
                            <p>Strategy: +{Math.floor(strategy.length / 100) * 2} USDC</p>
                          )}
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={!isValid}
                      onClick={handleLaunch}
                    >
                      Launch Agent
                    </Button>

                    {!isValid && (
                      <p className="text-xs text-center text-muted-foreground">
                        Complete all fields to launch
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPaymentModal && (
        <LaunchPaymentModal
          agentName={agentName}
          trigger={triggers.find(t => t.id === selectedTrigger)?.label || ''}
          contexts={selectedContexts.map(ctx => contexts.find(c => c.id === ctx)?.label || '')}
          strategy={strategy}
          launchFee={launchFee}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
