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
import { KeyRenewalModal } from '@/components/modals/key-renewal-modal'
import { WalletSignaturePrompt } from '@/components/wallet-signature-prompt'
import { useState, useEffect } from 'react'
import { TrendingUp, Volume2, Twitter, BarChart3, Globe, LinkIcon, Sparkles, Database, Zap, Cpu, CheckCircle2, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Trigger = 'timer' | 'price' | 'social'
type Context = 'market' | 'social' | 'onchain'
type MemorySize = '8k' | '32k' | '128k'
type TimerInterval = 3600000 | 14400000 | 86400000 // 1hr, 4hr, 1day in ms

const triggers = [
  { id: 'timer' as Trigger, label: 'Timer', icon: Clock, description: 'Execute at fixed intervals', cost: 0.0005 },
  { id: 'price' as Trigger, label: 'Price Movement', icon: TrendingUp, description: 'Technical price action signals', cost: 0.001 },
  { id: 'social' as Trigger, label: 'Social Signal', icon: Twitter, description: 'Twitter/social media triggers', cost: 0.002 },
]

const timerIntervals = [
  { value: 3600000 as TimerInterval, label: '1 Hour', description: 'Short-term strategies' },
  { value: 14400000 as TimerInterval, label: '4 Hours', description: 'Medium-term (recommended)' },
  { value: 86400000 as TimerInterval, label: '1 Day', description: 'Long-term strategies' },
]

const contexts = [
  { id: 'market' as Context, label: 'Market Context', icon: BarChart3, description: 'Price action, indicators, order book', cost: 0.001 },
  { id: 'social' as Context, label: 'Social Context', icon: Globe, description: 'Sentiment analysis, trends, influencers', cost: 0.001 },
  { id: 'onchain' as Context, label: 'On-chain Context', icon: LinkIcon, description: 'Whale movements, exchange flows', cost: 0.002 },
]

const memoryOptions = [
  { id: '8k' as MemorySize, label: 'Standard (8k)', description: 'Good for simple strategies', price: 0 },
  { id: '32k' as MemorySize, label: 'Enhanced (32k)', description: 'Better for complex reasoning', price: 20 },
  { id: '128k' as MemorySize, label: 'Pro (128k)', description: 'Maximum context retention', price: 50 },
]

export default function CreateAgentPage() {
  const router = useRouter()
  const [agentName, setAgentName] = useState('')
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null)
  const [selectedContexts, setSelectedContexts] = useState<Context[]>([])
  const [strategy, setStrategy] = useState('')
  const [memorySize, setMemorySize] = useState<MemorySize>('32k')
  const [showSocialConfig, setShowSocialConfig] = useState(false)
  const [twitterHandles, setTwitterHandles] = useState('aeyakovenko')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSubAccountModal, setShowSubAccountModal] = useState(false)
  const [isCreatingSubAccount, setIsCreatingSubAccount] = useState(false)
  const [subAccountId, setSubAccountId] = useState<string | null>(null)
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true)
  const [timerInterval, setTimerInterval] = useState<TimerInterval>(14400000) // Default: 4 hours
  const [showRenewalModal, setShowRenewalModal] = useState(false)

  // Check if user is registered with exchange
  useEffect(() => {
    const checkRegistration = async () => {
      setIsCheckingRegistration(true)
      // Simulate async check
      await new Promise(resolve => setTimeout(resolve, 500))

      const isRegistered = localStorage.getItem('exchange_registered') === 'true'
      const isKeyExpired = localStorage.getItem('exchange_key_expired') === 'true'

      // If key is expired, show renewal modal instead of redirecting
      if (isKeyExpired) {
        setShowRenewalModal(true)
        setIsCheckingRegistration(false)
        return
      }

      if (!isRegistered) {
        router.push('/register')
      } else {
        setIsCheckingRegistration(false)
      }
    }

    checkRegistration()
  }, [router])

  const handleRenewalSuccess = () => {
    setShowRenewalModal(false)
    // Dispatch event to update other components
    window.dispatchEvent(new Event('localStorageChange'))
  }

  const calculateDeploymentFee = () => {
    let baseFee = 10 // Base 10 USDC

    // Add fee for memory
    const memoryFee = memoryOptions.find(m => m.id === memorySize)?.price || 0

    // Add fee based on strategy length (complexity)
    const strategyFee = Math.floor(strategy.length / 100) * 2 // 2 USDC per 100 characters

    return baseFee + memoryFee + strategyFee
  }

  const calculateStreamingCost = () => {
    let baseRate = 0.002 // Base compute cost per hour

    // Add trigger cost
    if (selectedTrigger) {
      const trigger = triggers.find(t => t.id === selectedTrigger)
      if (trigger) baseRate += trigger.cost
    }

    // Add context cost
    selectedContexts.forEach(ctx => {
      const context = contexts.find(c => c.id === ctx)
      if (context) baseRate += context.cost
    })

    return baseRate
  }

  const deploymentFee = calculateDeploymentFee()
  const streamingCost = calculateStreamingCost()

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

  const handleLaunch = async () => {
    // Step 1: Create sub-account (simulates wallet signature)
    setShowSubAccountModal(true)
    setIsCreatingSubAccount(true)

    // Simulate wallet signature for sub-account creation
    await new Promise(resolve => setTimeout(resolve, 2500))

    const newSubAccountId = `sub_${Math.random().toString(36).substr(2, 9)}`
    setSubAccountId(newSubAccountId)
    setIsCreatingSubAccount(false)

    // Brief pause to show success
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Step 2: Show payment modal
    setShowSubAccountModal(false)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    router.push('/my-agents')
  }

  const isValid = agentName && selectedTrigger && selectedContexts.length > 0 && strategy.length >= 50

  // Show loading state while checking registration
  if (isCheckingRegistration) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <main className="container mx-auto px-4 py-4">
          <div className="mx-auto max-w-6xl flex items-center justify-center py-16">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-sm text-muted-foreground">Checking registration status...</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <main className="container mx-auto px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Create AI Trading Agent</h1>
            <p className="text-sm text-muted-foreground">
              Configure your agent's behavior, memory, and data sources.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Agent Identity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    Identity & Memory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                      id="agent-name"
                      placeholder="e.g., Momentum Hunter, Whale Tracker"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Memory Size (Context Window)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {memoryOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setMemorySize(option.id)}
                          className={`flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-all ${memorySize === option.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                          <div className="text-xs font-semibold mt-1">
                            {option.price === 0 ? 'Included' : `+${option.price} USDC`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trigger Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Trigger
                  </CardTitle>
                  <CardDescription>What signal wakes up the agent?</CardDescription>
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
                          className={`flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all ${isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="font-medium text-sm">{trigger.label}</p>
                            <p className="text-xs text-muted-foreground">{trigger.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Timer Interval Selector */}
                  {selectedTrigger === 'timer' && (
                    <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                      <Label className="text-sm font-medium mb-2 block">Execution Interval</Label>
                      <Select
                        value={timerInterval.toString()}
                        onValueChange={(value) => setTimerInterval(Number(value) as TimerInterval)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timerIntervals.map((interval) => (
                            <SelectItem key={interval.value} value={interval.value.toString()}>
                              <div className="flex items-center justify-between w-full">
                                <span>{interval.label}</span>
                                <span className="text-xs text-muted-foreground ml-2">{interval.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-2">
                        Agent will execute every {timerIntervals.find(i => i.value === timerInterval)?.label.toLowerCase()}
                      </p>
                    </div>
                  )}

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
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Data Contexts
                  </CardTitle>
                  <CardDescription>Additional data sources for reasoning (max 3)</CardDescription>
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
                          className={`flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all ${isSelected
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
                    placeholder="e.g., When @aeyakovenko tweets about Solana TPS milestones and on-chain activity spikes by 50%, go long SOL with 3x leverage. Exit when price increases 5% or if network congestion detected..."
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
                <Card className="border-l-4 border-l-primary shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle>Cost Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Deployment Fee */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold">One-time Deployment</Label>
                        <X402Badge />
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Base Fee</span>
                          <span>10 USDC</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Memory ({memorySize})</span>
                          <span>+{memoryOptions.find(m => m.id === memorySize)?.price} USDC</span>
                        </div>
                        {strategy.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Strategy Complexity</span>
                            <span>+{Math.floor(strategy.length / 100) * 2} USDC</span>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span>{deploymentFee} USDC</span>
                        </div>
                      </div>
                    </div>

                    {/* Streaming Cost */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold">Running Cost (Est.)</Label>
                        <Badge variant="outline" className="text-[10px] font-normal">x402 Stream</Badge>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Compute Base</span>
                          <span>$0.002/hr</span>
                        </div>
                        {selectedTrigger && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Trigger ({triggers.find(t => t.id === selectedTrigger)?.label})</span>
                            <span>+${triggers.find(t => t.id === selectedTrigger)?.cost}/hr</span>
                          </div>
                        )}
                        {selectedContexts.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Contexts ({selectedContexts.length})</span>
                            <span>+${(selectedContexts.length * 0.001).toFixed(3)}/hr</span>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-accent">
                          <span>Rate</span>
                          <span>${streamingCost.toFixed(4)}/hr</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2 text-center">
                        Deducted real-time from your x402 balance
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      disabled={!isValid}
                      onClick={handleLaunch}
                    >
                      Deploy Agent
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

      {/* Sub-Account Creation Modal */}
      {showSubAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Creating Sub-Account</CardTitle>
              <CardDescription>Setting up isolated trading account for your agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCreatingSubAccount ? (
                <WalletSignaturePrompt
                  message="Creating Trading Sub-Account"
                  description="Please sign the sub-account creation message in your wallet"
                />
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-500">Sub-Account Created</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {subAccountId}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showPaymentModal && (
        <LaunchPaymentModal
          agentName={agentName}
          trigger={triggers.find(t => t.id === selectedTrigger)?.label || ''}
          contexts={selectedContexts.map(ctx => contexts.find(c => c.id === ctx)?.label || '')}
          strategy={strategy}
          launchFee={deploymentFee}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <KeyRenewalModal
        isOpen={showRenewalModal}
        onClose={() => setShowRenewalModal(false)}
        onSuccess={handleRenewalSuccess}
        isExpired={true}
      />
    </div>
  )
}
