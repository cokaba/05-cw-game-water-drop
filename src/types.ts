export type DropType = 'good' | 'bad' | 'golden' | 'sludge';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  name: string;
  target: number;
  fallDurationMin: number;
  fallDurationMax: number;
  sludgeDurationMin: number;
  sludgeDurationMax: number;
  spawnRate: number;
  speedTag: string;
  color: string;
}

export interface DropItem {
  id: string;
  x: number; // in pixels relative to container width
  size: number; // in pixels (diameter)
  duration: number; // animation fall duration in seconds
  type: DropType;
  createdAt: number;
}

export interface SplashEffect {
  id: string;
  x: number;
  y: number;
  type: DropType;
  pointsText: string;
}

export interface GameStats {
  score: number;
  goodCaught: number;
  badClicked: number;
  goldenCaught: number;
  sludgeClicked: number;
  missedGood: number;
  highScore: number;
}
