// charity: water Brand Guidelines colors:
// Primary Colors:
// - Yellow:     #FFC907
// - Blue:       #2E9DF7
// Secondary Colors:
// - Light Blue: #8BD1CB
// - Green:      #4FCB53
// - Orange:     #FF902A
// - Red:        #F5402C
// - Dark Green: #159A48
// - Pink:       #F16061

export const BRAND_COLORS = {
  yellow: '#FFC907',
  blue: '#2E9DF7',
  lightBlue: '#8BD1CB',
  green: '#4FCB53',
  orange: '#FF902A',
  red: '#F5402C',
  darkGreen: '#159A48',
  pink: '#F16061',
  dark: '#131313',
  cardBg: '#e6f7ff',
} as const;

export const GAME_DURATION_SECONDS = 30;
export const WINNING_SCORE_THRESHOLD = 20;

// Required by README.md: Array of winning messages when score >= 20
export const WINNING_MESSAGES: string[] = [
  "Incredible work! You collected enough clean water to change lives!",
  "You're a clean water hero! Every single drop counts for communities around the world!",
  "Amazing reflexes! You hit 20+ drops and brought clean drinking water home!",
  "Fantastic victory! Your speed and precision keep clean water flowing!",
  "Pure excellence! You reached the target and conquered the Water Drop challenge!",
  "Brilliant job! Clean water changes everything, and you just proved it!"
];

// Required by README.md: Array of try-again messages when score < 20
export const TRY_AGAIN_MESSAGES: string[] = [
  "Almost there! Every drop matters — give it another shot!",
  "Good effort! Tap faster to reach 20 drops and bring clean water home!",
  "Don't give up! Dodge those murky red drops and catch the clean blue ones!",
  "Close call! With a little more practice, you'll easily break 20 points!",
  "Keep going! Clear waters are within reach — click Start to try again!",
  "You've got this! Quick fingers will help you reach 20 points next round!"
];

export const DID_YOU_KNOW_FACTS: string[] = [
  "703 million people worldwide live without clean, safe water. That's about 1 in 10 people on earth.",
  "100% of public donations to charity: water go directly to fund clean water projects.",
  "Access to clean water restores hours each day to women and girls who used to walk miles to fetch water.",
  "Clean water means fewer sick days, better school attendance, and brighter economic futures.",
  "charity: water uses remote sensors on water points to monitor water flow and ensure long-term sustainability."
];
