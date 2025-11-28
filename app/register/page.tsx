'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Key, Shield, AlertCircle, ArrowLeft } from 'lucide-react'
import { WalletSignaturePrompt } from '@/components/wallet-signature-prompt'

// Simulated account status enum (matches real Orderly)
enum AccountStatus {
    NotConnected = 0,
    Connected = 1,
    NotSignedIn = 2,
    SignedIn = 3,
    DisabledTrading = 4,
    EnableTrading = 5,
}

const STATUS_INFO = {
    [AccountStatus.NotConnected]: {
        label: 'Not Connected',
        description: 'Wallet needs to be connected to Orderly',
        color: 'bg-gray-500',
    },
    [AccountStatus.Connected]: {
        label: 'Connected',
        description: 'Wallet connected, ready to create account',
        color: 'bg-blue-500',
    },
    [AccountStatus.NotSignedIn]: {
        label: 'Not Signed In',
        description: 'Need to create Orderly account',
        color: 'bg-yellow-500',
    },
    [AccountStatus.SignedIn]: {
        label: 'Signed In',
        description: 'Account created, need to add trading key',
        color: 'bg-orange-500',
    },
    [AccountStatus.DisabledTrading]: {
        label: 'Trading Disabled',
        description: 'Trading key expired, need to create new key',
        color: 'bg-red-500',
    },
    [AccountStatus.EnableTrading]: {
        label: 'Trading Enabled',
        description: 'Fully registered and ready to trade',
        color: 'bg-green-500',
    },
}

type RegistrationStep = 'idle' | 'creating-account' | 'account-created' | 'creating-key' | 'saving' | 'complete'

export default function RegisterPage() {
    const router = useRouter()
    const [currentStatus, setCurrentStatus] = useState<AccountStatus>(AccountStatus.Connected)
    const [step, setStep] = useState<RegistrationStep>('idle')
    const [isExpiredKey, setIsExpiredKey] = useState(false)

    // Simulate checking if user has expired key
    useEffect(() => {
        const hasExpiredKey = localStorage.getItem('orderly_key_expired') === 'true'
        if (hasExpiredKey) {
            setCurrentStatus(AccountStatus.DisabledTrading)
            setIsExpiredKey(true)
        }
    }, [])

    const handleCreateAccount = async () => {
        setStep('creating-account')

        // Simulate wallet signature delay
        await new Promise(resolve => setTimeout(resolve, 2500))

        setCurrentStatus(AccountStatus.SignedIn)
        setStep('account-created')
    }

    const handleCreateKey = async () => {
        setStep('creating-key')

        // Simulate wallet signature delay
        await new Promise(resolve => setTimeout(resolve, 2500))

        // Auto-proceed to save
        setStep('saving')
        await new Promise(resolve => setTimeout(resolve, 1000))

        setStep('complete')
        setCurrentStatus(AccountStatus.EnableTrading)

        // Clear expired key flag and mark as registered
        localStorage.removeItem('orderly_key_expired')
        localStorage.setItem('orderly_registered', 'true')

        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push('/create')
    }

    const needsAccountCreation = currentStatus <= AccountStatus.NotSignedIn
    const needsKeyCreation = currentStatus === AccountStatus.SignedIn || currentStatus === AccountStatus.DisabledTrading
    const isProcessing = step !== 'idle' && step !== 'account-created' && step !== 'complete'

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Register with Orderly</CardTitle>
                                <CardDescription>
                                    {isExpiredKey
                                        ? 'Your trading key has expired. Renew it to continue trading.'
                                        : 'Two-step setup to enable AI agent trading'}
                                </CardDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Current Status */}
                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Current Status</span>
                            <Badge variant="outline" className="gap-2">
                                <div className={`h-2 w-2 rounded-full ${STATUS_INFO[currentStatus].color}`} />
                                {STATUS_INFO[currentStatus].label}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {STATUS_INFO[currentStatus].description}
                        </p>
                    </div>

                    {/* Expired Key Warning */}
                    {isExpiredKey && step === 'idle' && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-destructive">Trading Key Expired</p>
                                <p className="text-xs text-muted-foreground">
                                    Your trading key has reached its 365-day expiration. Renew it below to continue trading.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Create Account (if needed) */}
                    {needsAccountCreation && step === 'idle' && (
                        <div className="space-y-4">
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                                    Create Orderly Account
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    First, we'll create your Orderly account on-chain. This requires one wallet signature.
                                </p>
                                <Button onClick={handleCreateAccount} className="w-full" size="lg">
                                    <Key className="mr-2 h-4 w-4" />
                                    Create Account
                                </Button>
                            </div>

                            <div className="bg-muted/30 border border-border rounded-lg p-4 opacity-60">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-muted-foreground text-sm">2</span>
                                    Create Trading Key
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Available after account creation
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Wallet Signature: Creating Account */}
                    {step === 'creating-account' && (
                        <WalletSignaturePrompt
                            message="Creating Orderly Account"
                            description="Please sign the registration message in your wallet"
                        />
                    )}

                    {/* Step 2: Create Trading Key */}
                    {(step === 'account-created' || (needsKeyCreation && step === 'idle')) && (
                        <div className="space-y-4">
                            {step === 'account-created' && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-500">Account Created Successfully</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Now let's create your trading key
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm">
                                        {needsAccountCreation ? '2' : '1'}
                                    </span>
                                    {isExpiredKey ? 'Renew Trading Key' : 'Create Trading Key'}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Generate a 365-day trading key to authorize agent execution. This requires one wallet signature.
                                </p>
                                <Button onClick={handleCreateKey} className="w-full" size="lg">
                                    <Key className="mr-2 h-4 w-4" />
                                    {isExpiredKey ? 'Renew Key (365 days)' : 'Create Key (365 days)'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Wallet Signature: Creating Key */}
                    {step === 'creating-key' && (
                        <WalletSignaturePrompt
                            message="Creating Trading Key"
                            description="Please sign the key addition message in your wallet"
                        />
                    )}

                    {/* Saving to Backend */}
                    {step === 'saving' && (
                        <WalletSignaturePrompt
                            message="Saving Credentials"
                            description="Securely storing your keys..."
                        />
                    )}

                    {/* Complete */}
                    {step === 'complete' && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 flex flex-col items-center text-center space-y-3">
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="font-medium text-green-500">Registration Complete!</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Redirecting to agent creation...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Info Section (only show when idle) */}
                    {step === 'idle' && !isExpiredKey && (
                        <div className="bg-muted/30 border border-border rounded-lg p-4">
                            <h4 className="font-medium mb-2">What is Orderly?</h4>
                            <p className="text-sm text-muted-foreground">
                                Orderly is a decentralized trading infrastructure that powers your AI trading agent.
                                Registration is free and only needs to be done once.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
