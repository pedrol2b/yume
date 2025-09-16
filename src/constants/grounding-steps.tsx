import { Coffee, Ear, Eye, Flower2, Hand } from 'lucide-react'

export type GroundingStep = {
  number: number
  sense: string
  instruction: string
  icon: React.ReactNode
  color: string
}

export const groundingSteps: GroundingStep[] = [
  {
    number: 5,
    sense: 'See',
    instruction: 'Name 5 things you can see around you',
    icon: <Eye className="h-6 w-6" />,
    color: 'text-primary',
  },
  {
    number: 4,
    sense: 'Touch',
    instruction: 'Touch 4 things around you and notice their texture',
    icon: <Hand className="h-6 w-6" />,
    color: 'text-accent',
  },
  {
    number: 3,
    sense: 'Hear',
    instruction: 'Listen for 3 sounds in your environment',
    icon: <Ear className="h-6 w-6" />,
    color: 'text-secondary',
  },
  {
    number: 2,
    sense: 'Smell',
    instruction: 'Notice 2 things you can smell',
    icon: <Flower2 className="h-5 w-5" />,
    color: 'text-primary',
  },
  {
    number: 1,
    sense: 'Taste',
    instruction: 'Focus on 1 thing you can taste',
    icon: <Coffee className="h-5 w-5" />,
    color: 'text-accent',
  },
]
