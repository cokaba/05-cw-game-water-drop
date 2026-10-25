# charity: water – Water Drop Game (React)

A responsive, high-performance React application rewritten with Vite, TypeScript, and Tailwind CSS based on the charity: water Water Drop challenge.

## Features

- **Catch Clean Water Drops**: Tap falling blue water drops to earn **+1 point**.
- **Avoid Murky Contaminants**: Avoid red drops that deduct **-1 point**.
- **Golden Bonus Drops**: Rare yellow jerry-can drops award **+3 points**.
- **30-Second Countdown**: Race against the clock to collect as much clean water as possible.
- **Goal & Dynamic Win/Loss Messages**:
  - Scoring **20 or more points** triggers an celebratory winning state with confetti and randomly selected congratulatory messages from `WINNING_MESSAGES`.
  - Scoring **under 20 points** provides encouragement with randomized try-again messages from `TRY_AGAIN_MESSAGES`.
- **Sound Effects (Web Audio API)**:
  - Synthesized fluid water droplet chime
  - Murky drop squelch/buzzer
  - Golden bonus arpeggio
  - Victory fanfare & try-again cues
  - Built-in audio mute toggle
- **charity: water Brand Guidelines**:
  - Clean Yellow (`#FFC907`), Blue (`#2E9DF7`), and secondary palette
  - Authentic charity: water logo and Jerry Can asset integration
  - Mission impact ticker highlighting clean water facts
- **Persistent High Scores**: Stored in `localStorage` across plays.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build
```
