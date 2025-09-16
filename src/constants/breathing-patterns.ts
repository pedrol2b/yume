export type BreathingPattern = {
  name: string
  inhale: number
  hold?: number
  exhale: number
  holdAfter?: number
  description: string
  useCase: string
  recommended?: boolean
}

export const breathingPatterns: BreathingPattern[] = [
  {
    name: '4-4 Basic',
    inhale: 4,
    exhale: 4,
    description: 'Paced Breathing - The most common anti-anxiety pattern',
    useCase: 'Perfect for panic attacks and general anxiety relief. Keep breaths gentle, not deep.',
    recommended: true,
  },
  {
    name: '4-6 Extended Exhale',
    inhale: 4,
    exhale: 6,
    description: 'Extended Exhale Breathing - Highly recommended for panic attacks',
    useCase: 'Longer exhales signal your body to calm down faster. Best for acute anxiety.',
    recommended: true,
  },
  {
    name: '4-7-8 Relaxing',
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: '4-7-8 Technique - Strongly activates the parasympathetic nervous system',
    useCase: 'Excellent for anxiety and sleep preparation. Like blowing out a candle slowly.',
  },
  {
    name: '4-4-4-4 Box',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    description: 'Box Breathing - Used by Navy SEALs for calm focus',
    useCase: 'Great for grounding during acute stress and improving concentration.',
  },
  {
    name: '6-6 Deep',
    inhale: 6,
    exhale: 6,
    description: 'Deep Breathing - Slower, more meditative pace',
    useCase: "For deeper relaxation when you have more time and aren't in acute distress.",
  },
]
