'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X402Badge } from '@/components/x402-badge'
import { X, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface DepositModalProps {
  agentName: string
  isOwnAgent: boolean
  onClose: () => void
}

export function DepositModal({ agentName, isOwnAgent, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [txHash, setTxHash] = useState('')

  const walletBalance = 10000
  const gasEstimate = 2.5

  const handleDeposit = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTxHash('0xabcd1234...ef5678')
    setIsSuccess(true)
    setIsProcessing(false)
  }

  const setQuickAmount = (percentage: number) => {
    setAmount((walletBalance * percentage / 100).toFixed(2))
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
        <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-accent" />
            </div>
            <CardTitle className="text-center">Deposit Successful!</CardTitle>
            <CardDescription className="text-center">Your funds have been deposited to {agentName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">${parseFloat(amount).toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs">{txHash}</span>
                  <X402Badge />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Chain</span>
                <span>Ethereum</span>
              </div>
            </div>
            <Button className="w-full" onClick={onClose}>
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fund {agentName}</CardTitle>
              <CardDescription>
                {isOwnAgent ? "Add funds to your agent's trading account" : "Invest in this agent's strategy"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isOwnAgent && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
              You're investing in a public agent. Returns will be shared based on your deposit proportion.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDC)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USDC
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Balance: ${walletBalance.toLocaleString()} USDC</span>
              <div className="flex gap-1">
                <button onClick={() => setQuickAmount(25)} className="hover:text-foreground">25%</button>
                <button onClick={() => setQuickAmount(50)} className="hover:text-foreground">50%</button>
                <button onClick={() => setQuickAmount(75)} className="hover:text-foreground">75%</button>
                <button onClick={() => setQuickAmount(100)} className="hover:text-foreground">100%</button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Transaction Details</span>
              <X402Badge />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vault Deposit</span>
              <span className="font-semibold">{amount || '0'} USDC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gas Estimate</span>
              <span>~${gasEstimate} USDC</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="font-medium">Total</span>
              <span className="font-bold">{(parseFloat(amount || '0') + gasEstimate).toFixed(2)} USDC</span>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance || isProcessing}
            onClick={handleDeposit}
          >
            {isProcessing ? 'Processing...' : 'Confirm Deposit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
