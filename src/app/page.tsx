'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { breathingPatterns } from '@/constants/breathing-patterns'
import { groundingSteps } from '@/constants/grounding-steps'
import { mantras } from '@/constants/mantras'
import { formatTime } from '@/utils/format-time'

import { ArrowRight, Hand, Heart, Moon, Pause, Play, RotateCcw, Settings, Sun, Wind } from 'lucide-react'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfter' | 'paused' | 'stopped'

type AppMode = 'breathing' | 'grounding'

export default function BreathingApp() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [appMode, setAppMode] = useState<AppMode>('breathing')

  // Breathing exercise states
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<Phase>('stopped')
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0])
  const [sessionLength, setSessionLength] = useState([5]) // minutes
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0)
  const [showMantras, setShowMantras] = useState(true)
  const [currentMantra, setCurrentMantra] = useState(mantras[0])
  const [favoriteMantraIds, setFavoriteMantraIds] = useState<number[]>([])
  const [lockedMantraId, setLockedMantraId] = useState<number | null>(null)
  const [showMantraSettings, setShowMantraSettings] = useState(false)

  const [groundingActive, setGroundingActive] = useState(false)
  const [currentGroundingStep, setCurrentGroundingStep] = useState(0)
  const [groundingProgress, setGroundingProgress] = useState<number[]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)

    // Only set initial theme on first mount, don't interfere with user toggles
    // next-themes stores the theme preference in localStorage with key 'theme'
    const hasUserThemePreference = localStorage.getItem('theme')
    if (!hasUserThemePreference) {
      const hour = new Date().getHours()
      const isNightTime = hour >= 18 || hour < 6
      if (isNightTime) {
        setTheme('dark')
      }
    }

    // Load saved mantra preferences
    const savedFavorites = localStorage.getItem('breathingApp_favoriteMantraIds')
    const savedLocked = localStorage.getItem('breathingApp_lockedMantraId')

    if (savedFavorites) {
      setFavoriteMantraIds(JSON.parse(savedFavorites))
    }
    if (savedLocked) {
      setLockedMantraId(JSON.parse(savedLocked))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (cycleCount > 0) {
      let selectedMantra: string

      if (lockedMantraId !== null) {
        // Use locked mantra
        selectedMantra = mantras[lockedMantraId]
      } else if (favoriteMantraIds.length > 0) {
        // Randomly select from favorites
        const randomFavoriteIndex = favoriteMantraIds[Math.floor(Math.random() * favoriteMantraIds.length)]
        selectedMantra = mantras[randomFavoriteIndex]
      } else {
        // Randomly select from all mantras
        selectedMantra = mantras[Math.floor(Math.random() * mantras.length)]
      }

      setCurrentMantra(selectedMantra)
    }
  }, [cycleCount, favoriteMantraIds, lockedMantraId])

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe Out'
      case 'holdAfter':
        return 'Hold'
      case 'paused':
        return 'Paused'
      default:
        return 'Ready to Begin'
    }
  }

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Slowly fill your lungs with air'
      case 'hold':
        return 'Hold your breath gently'
      case 'exhale':
        return 'Slowly release the air'
      case 'holdAfter':
        return 'Rest before the next breath'
      case 'paused':
        return 'Take your time, resume when ready'
      default:
        return 'Find a comfortable position and relax'
    }
  }

  const getCurrentPhaseDuration = (phase?: Phase) => {
    const currentPhaseToCheck = phase || currentPhase
    switch (currentPhaseToCheck) {
      case 'inhale':
        return selectedPattern.inhale
      case 'hold':
        return selectedPattern.hold || 0
      case 'exhale':
        return selectedPattern.exhale
      case 'holdAfter':
        return selectedPattern.holdAfter || 0
      default:
        return 0
    }
  }

  const getNextPhase = (phase: Phase): Phase => {
    switch (phase) {
      case 'inhale':
        return selectedPattern.hold ? 'hold' : 'exhale'
      case 'hold':
        return 'exhale'
      case 'exhale':
        return selectedPattern.holdAfter ? 'holdAfter' : 'inhale'
      case 'holdAfter':
        return 'inhale'
      default:
        return 'inhale'
    }
  }

  const startPhase = (phase: Phase) => {
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current)
      phaseIntervalRef.current = null
    }

    setCurrentPhase(phase)
    const duration = getCurrentPhaseDuration(phase)
    setPhaseTimeRemaining(duration)

    if (duration > 0) {
      phaseIntervalRef.current = setInterval(() => {
        setPhaseTimeRemaining((prev) => {
          if (prev <= 1) {
            if (phaseIntervalRef.current) {
              clearInterval(phaseIntervalRef.current)
              phaseIntervalRef.current = null
            }

            const nextPhase = getNextPhase(phase)
            if (phase === 'exhale' && nextPhase === 'inhale') {
              setCycleCount((prev) => prev + 1)
            } else if (phase === 'holdAfter' && nextPhase === 'inhale') {
              setCycleCount((prev) => prev + 1)
            }

            setTimeout(() => startPhase(nextPhase), 100)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const startSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current)

    setIsActive(true)
    setTimeRemaining(sessionLength[0] * 60)
    setCycleCount(0)
    startPhase('inhale')

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          resetSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseSession = () => {
    setIsActive(false)
    setCurrentPhase('paused')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current)
      phaseIntervalRef.current = null
    }
  }

  const resumeSession = () => {
    setIsActive(true)
    startPhase('inhale')

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          resetSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const resetSession = () => {
    setIsActive(false)
    setCurrentPhase('stopped')
    setTimeRemaining(0)
    setCycleCount(0)
    setPhaseTimeRemaining(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current)
      phaseIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current)
    }
  }, [])

  const getCircleScale = () => {
    if (currentPhase === 'inhale') return 'scale-125'
    if (currentPhase === 'hold') return 'scale-125' // Stay expanded during inhale hold
    if (currentPhase === 'exhale') return 'scale-75'
    if (currentPhase === 'holdAfter') return 'scale-75' // Stay contracted during exhale hold
    return 'scale-100'
  }

  const getCircleStyle = () => {
    const duration = getCurrentPhaseDuration()
    const transitionDuration =
      currentPhase === 'hold' || currentPhase === 'holdAfter' ? '0s' : duration > 0 ? `${duration}s` : '0.5s'

    return {
      transition: `all ${transitionDuration} ease-in-out`,
      boxShadow:
        currentPhase === 'inhale' || currentPhase === 'exhale'
          ? theme === 'dark'
            ? '0 0 60px rgba(56, 189, 248, 0.4), 0 0 120px rgba(56, 189, 248, 0.2)' // Bright sky blue for dark mode
            : '0 0 60px rgba(14, 165, 233, 0.4), 0 0 120px rgba(14, 165, 233, 0.2)' // Vibrant sky blue for light mode
          : theme === 'dark'
            ? '0 0 30px rgba(56, 189, 248, 0.2)'
            : '0 0 30px rgba(14, 165, 233, 0.2)',
    }
  }

  const startGroundingExercise = () => {
    setGroundingActive(true)
    setCurrentGroundingStep(0)
    setGroundingProgress([])
  }

  const nextGroundingStep = () => {
    const newProgress = [...groundingProgress, currentGroundingStep]
    setGroundingProgress(newProgress)

    if (currentGroundingStep < groundingSteps.length - 1) {
      setCurrentGroundingStep(currentGroundingStep + 1)
    } else {
      // Exercise completed
      setGroundingActive(false)
      setCurrentGroundingStep(0)
      setGroundingProgress([])
    }
  }

  const resetGroundingExercise = () => {
    setGroundingActive(false)
    setCurrentGroundingStep(0)
    setGroundingProgress([])
  }

  const renderGroundingExercise = () => {
    if (!groundingActive) {
      return (
        <div className="space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-foreground text-2xl font-bold">5-4-3-2-1 Grounding</h2>
            <p className="text-muted-foreground text-balance">
              This technique helps you stay present by engaging all your senses. Perfect for managing anxiety and panic
              attacks.
            </p>
          </div>

          <Card className="from-card to-card/50 border-primary/20 space-y-4 bg-gradient-to-br p-6">
            <h3 className="mb-4 text-lg font-semibold">How it works:</h3>
            <div className="space-y-3 text-left">
              {groundingSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`${step.color} flex-shrink-0`}>{step.icon}</div>
                  <div>
                    <span className="font-medium">
                      {step.number} things to {step.sense.toLowerCase()}
                    </span>
                    <p className="text-muted-foreground text-sm">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Button onClick={startGroundingExercise} size="lg" className="h-auto px-12 py-4 text-lg">
            <Play className="mr-3 h-6 w-6" />
            Start Grounding Exercise
          </Button>
        </div>
      )
    }

    const currentStep = groundingSteps[currentGroundingStep]
    const isLastStep = currentGroundingStep === groundingSteps.length - 1

    if (currentGroundingStep >= groundingSteps.length) {
      return (
        <div className="space-y-6 text-center">
          <div className="from-accent to-primary mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
            <div className="text-5xl text-white">✓</div>
          </div>
          <h2 className="text-foreground text-2xl font-bold">Well Done!</h2>
          <p className="text-muted-foreground text-balance">
            You&apos;ve completed the grounding exercise. Take a moment to notice how you feel now.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={startGroundingExercise}
              variant="outline"
              size="lg"
              className="h-auto bg-transparent px-8 py-3"
            >
              Do It Again
            </Button>
            <Button onClick={() => setAppMode('breathing')} size="lg" className="h-auto px-8 py-3">
              Try Breathing Exercise
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6 text-center">
        {/* Progress indicator */}
        <div className="mb-6 flex justify-center gap-2">
          {groundingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-4 w-4 rounded-full transition-colors ${
                index < currentGroundingStep
                  ? 'bg-green-500'
                  : index === currentGroundingStep
                    ? 'bg-primary'
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Current step */}
        <div className="space-y-6">
          <div
            className={`from-primary/30 to-secondary/30 border-primary/40 mx-auto flex h-40 w-40 items-center justify-center rounded-full border-4 bg-gradient-to-br shadow-lg ${currentStep.color}`}
          >
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold">{currentStep.number}</div>
              <div className="text-xl">{currentStep.sense}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-foreground text-xl font-semibold">{currentStep.instruction}</h2>
            <p className="text-muted-foreground text-balance">
              Take your time. When you&apos;re ready, tap next to continue.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={resetGroundingExercise}
            variant="outline"
            size="lg"
            className="h-auto bg-transparent px-8 py-3"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
          <Button onClick={nextGroundingStep} size="lg" className="h-auto px-12 py-4 text-lg">
            {isLastStep ? 'Complete' : 'Next'}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    )
  }

  const toggleFavoriteMantra = (index: number) => {
    const newFavorites = favoriteMantraIds.includes(index)
      ? favoriteMantraIds.filter((id) => id !== index)
      : [...favoriteMantraIds, index]

    setFavoriteMantraIds(newFavorites)
    localStorage.setItem('breathingApp_favoriteMantraIds', JSON.stringify(newFavorites))
  }

  const toggleLockedMantra = (index: number) => {
    const newLocked = lockedMantraId === index ? null : index
    setLockedMantraId(newLocked)
    localStorage.setItem('breathingApp_lockedMantraId', JSON.stringify(newLocked))
  }

  const getRandomMantra = () => {
    let availableMantras: number[]

    if (favoriteMantraIds.length > 0) {
      availableMantras = favoriteMantraIds
    } else {
      availableMantras = mantras.map((_, index) => index)
    }

    const randomIndex = availableMantras[Math.floor(Math.random() * availableMantras.length)]
    setCurrentMantra(mantras[randomIndex])
  }

  return (
    <div className="from-background via-primary/10 to-secondary/15 flex min-h-screen flex-col bg-gradient-to-br p-4">
      <header className="mb-8 flex items-center justify-between text-center">
        <div className="flex-1" />
        <div className="flex-1">
          <h1 className="text-foreground mb-2 text-3xl font-bold">{appMode === 'breathing' ? 'Breathe' : 'Ground'}</h1>
          <p className="text-muted-foreground">
            {appMode === 'breathing'
              ? 'Find your calm through mindful breathing'
              : 'Stay present with the 5-4-3-2-1 technique'}
          </p>
        </div>
        <div className="flex flex-1 justify-end">
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 p-0"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center pb-20">
        {appMode === 'grounding' ? (
          renderGroundingExercise()
        ) : (
          <>
            {/* Breathing Circle */}
            <div className="relative mb-12">
              <div
                className={`from-primary/30 via-secondary/20 to-primary/40 border-primary/50 flex h-72 w-72 items-center justify-center rounded-full border-4 bg-gradient-to-br shadow-2xl ease-in-out ${getCircleScale()}`}
                style={getCircleStyle()}
              >
                <div className="text-center">
                  <div className="text-foreground mb-2 text-2xl font-semibold">{getPhaseText()}</div>
                  {phaseTimeRemaining > 0 && <div className="text-muted-foreground text-lg">{phaseTimeRemaining}s</div>}
                </div>
              </div>
            </div>

            {/* Instructions and Mantras */}
            <div className="mb-8 space-y-4 text-center">
              <p className="text-card-foreground mb-4 text-lg">{getPhaseInstruction()}</p>

              {showMantras && isActive && (
                <div className="from-primary/15 to-secondary/15 border-primary/30 flex items-center justify-center gap-2 rounded-lg border bg-gradient-to-r p-4">
                  <Heart className="text-primary h-5 w-5 flex-shrink-0" />
                  <p className="text-primary font-medium text-balance">{currentMantra}</p>
                </div>
              )}

              {isActive && (
                <div className="text-muted-foreground flex justify-center gap-6 text-sm">
                  <span>Time: {formatTime(timeRemaining)}</span>
                  <span>Cycles: {cycleCount}</span>
                </div>
              )}
            </div>

            <div className="mb-8 flex gap-4">
              {!isActive && currentPhase !== 'paused' ? (
                <Button
                  onClick={startSession}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 h-auto px-12 py-4 text-lg"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Start
                </Button>
              ) : currentPhase === 'paused' ? (
                <>
                  <Button onClick={resumeSession} size="lg" className="h-auto px-8 py-3">
                    <Play className="mr-2 h-5 w-5" />
                    Resume
                  </Button>
                  <Button
                    onClick={resetSession}
                    variant="outline"
                    size="lg"
                    className="h-auto bg-transparent px-8 py-3"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reset
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={pauseSession}
                    variant="outline"
                    size="lg"
                    className="h-auto bg-transparent px-8 py-3"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </Button>
                  <Button
                    onClick={resetSession}
                    variant="outline"
                    size="lg"
                    className="h-auto bg-transparent px-8 py-3"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reset
                  </Button>
                </>
              )}

              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="lg"
                className="h-auto bg-transparent px-8 py-3"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <Card className="from-card/90 to-primary/15 border-primary/30 w-full space-y-6 bg-gradient-to-br p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Settings</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowMantraSettings(!showMantraSettings)}
                      variant={showMantraSettings ? 'default' : 'outline'}
                      size="sm"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Mantras
                    </Button>
                    <Button
                      onClick={() => setShowMantras(!showMantras)}
                      variant={showMantras ? 'default' : 'outline'}
                      size="sm"
                    >
                      {showMantras ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </div>

                {showMantraSettings && (
                  <div className="border-primary/20 space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Manage Mantras</h4>
                      <div className="flex gap-2">
                        <Button onClick={getRandomMantra} variant="outline" size="sm">
                          Random
                        </Button>
                        {lockedMantraId !== null && (
                          <Button onClick={() => toggleLockedMantra(lockedMantraId)} variant="outline" size="sm">
                            Unlock
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {mantras.map((mantra, index) => (
                        <div
                          key={index}
                          className={`rounded-lg border p-3 text-sm transition-colors ${
                            lockedMantraId === index
                              ? 'border-accent bg-accent/10'
                              : favoriteMantraIds.includes(index)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex-1 text-balance">{mantra}</span>
                            <div className="ml-2 flex gap-1">
                              <Button
                                onClick={() => toggleFavoriteMantra(index)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    favoriteMantraIds.includes(index)
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              </Button>
                              <Button
                                onClick={() => toggleLockedMantra(index)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                {lockedMantraId === index ? (
                                  <div className="border-accent bg-accent h-4 w-4 rounded border-2" />
                                ) : (
                                  <div className="border-muted-foreground h-4 w-4 rounded border-2" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-muted-foreground space-y-1 text-xs">
                      <p>• Heart icon: Add to favorites (random selection from favorites only)</p>
                      <p>• Lock icon: Use this mantra exclusively</p>
                      <p>
                        • {favoriteMantraIds.length} favorites, {lockedMantraId !== null ? '1 locked' : 'none locked'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Breathing Pattern</label>
                  <div className="space-y-3">
                    {breathingPatterns.map((pattern) => (
                      <div
                        key={pattern.name}
                        className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                          selectedPattern.name === pattern.name
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPattern(pattern)}
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {pattern.name}
                            {pattern.recommended && (
                              <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs">
                                Recommended
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-1 text-xs">{pattern.description}</p>
                        <p className="text-card-foreground text-xs">{pattern.useCase}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Length: {sessionLength[0]} minutes</label>
                  <Slider
                    value={sessionLength}
                    onValueChange={setSessionLength}
                    max={15}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="text-muted-foreground text-sm">
                  <p>
                    <strong>Current Pattern:</strong>
                  </p>
                  <p>Inhale: {selectedPattern.inhale}s</p>
                  {selectedPattern.hold && <p>Hold: {selectedPattern.hold}s</p>}
                  <p>Exhale: {selectedPattern.exhale}s</p>
                  {selectedPattern.holdAfter && <p>Hold: {selectedPattern.holdAfter}s</p>}
                </div>
              </Card>
            )}
          </>
        )}
      </main>

      <nav className="from-background/95 to-background/80 border-primary/30 fixed right-0 bottom-0 left-0 border-t bg-gradient-to-t backdrop-blur-sm">
        <div className="mx-auto flex max-w-md">
          <Button
            variant={appMode === 'breathing' ? 'default' : 'ghost'}
            onClick={() => setAppMode('breathing')}
            className="flex h-16 flex-1 flex-col gap-1 rounded-none border-0"
          >
            <Wind className="h-6 w-6" />
            <span className="text-xs">Breathing</span>
          </Button>
          <Button
            variant={appMode === 'grounding' ? 'default' : 'ghost'}
            onClick={() => setAppMode('grounding')}
            className="flex h-16 flex-1 flex-col gap-1 rounded-none border-0"
          >
            <Hand className="h-6 w-6" />
            <span className="text-xs">Grounding</span>
          </Button>
        </div>
      </nav>

      <footer className="text-muted-foreground mt-8 pb-20 text-center text-sm">
        <p>Take a moment for yourself. You deserve this peace.</p>
      </footer>
    </div>
  )
}
