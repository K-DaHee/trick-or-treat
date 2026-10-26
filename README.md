# 🍬 Trick or Treat 🍬

### G🎃! Pumpkin!

A Halloween-themed, mobile-friendly endless runner where a bouncing pumpkin collects candy and dodges spooky obstacles.

## 🎃 About the Game

**Trick or Treat** is a casual browser game designed to be simple, fast-paced, and fun.

Players control a little pumpkin traveling along a three-lane haunted path. The goal is to collect as much candy as possible while avoiding ghosts and bats.

The game is designed primarily for mobile devices, allowing players to jump straight into the action through a shared link or QR code without downloading an app.

The initial focus is on building one complete, enjoyable game experience before expanding its features.

## 🕹️ Gameplay

### Core Mechanics

**Movement**

- The pumpkin continuously bounces forward.
- Players swipe left or right to switch between three lanes.
- The scrolling environment creates the feeling of continuous forward movement.

**Candy Collection**

- Candy appears along the path.
- Collecting candy increases the player's score.
- Players aim to collect as much candy as possible before the game ends.

**Obstacles**

- Bats and ghosts appear as obstacles.
- Players must switch lanes to avoid collisions.
- Hitting an obstacle ends the run.

**Game Over**

- The final score and collected candy count are displayed.
- The player's personal best is saved locally.
- Players can immediately retry and challenge their previous record.

## ✨ Game Experience

The game should feel playful, slightly spooky, and easy to understand.

Its visual direction is inspired by Halloween, featuring a cartoon-style pumpkin, colorful candy, flying bats, ghosts, and a haunted environment.

Rather than creating a genuinely frightening horror game, the goal is to combine cute characters with unexpected, humorous reactions.

### Planned Collision Effects

**Bat Collision — Candy Explosion**

When the pumpkin collides with a bat, the pumpkin bursts apart and candy particles scatter across the screen.

**Ghost Collision — Surprise!**

When the pumpkin collides with a ghost, the pumpkin explodes and the ghost suddenly moves toward the screen for a playful jump-scare effect.

These effects are planned as part of the game's visual polish.

## 🗺️ Development Roadmap

### Phase 1 — MVP

Build a complete, playable endless runner.

- [ ] Set up the React and TypeScript project
- [ ] Integrate Phaser
- [ ] Create the start screen and game interface
- [ ] Render and animate the pumpkin
- [ ] Implement three-lane movement and swipe controls
- [ ] Build the Halloween environment and scrolling system
- [ ] Spawn candy and obstacles
- [ ] Implement collision detection and scoring
- [ ] Add game-over, retry, and personal-best functionality

### Phase 2 — Polish

Improve the game's visual feedback, atmosphere, and replayability.

- [ ] Add progressive difficulty
- [ ] Implement pumpkin explosion animations
- [ ] Add bat collision candy effects
- [ ] Implement ghost jump-scare animations
- [ ] Add sound effects
- [ ] Improve particles, camera feedback, and transitions

### Phase 3 — Release

Prepare the game for real players.

- Verify gameplay and performance on mobile devices
- Deploy the game to Vercel
- Share the game through a QR code

## 🛠️ Planned Tech Stack

| Technology | Purpose |
|---|---|
| React | Menus, start screen, and results UI |
| TypeScript | Type-safe application and game logic |
| Phaser 3 | Game rendering, movement, collisions, and animations |
| Vite | Development environment and production builds |
| CSS | UI styling and responsive layouts |
| localStorage | Personal-best score persistence |
| Vercel | Web deployment |

## 📌 Project Scope

The initial release is intentionally focused on a **single-player experience**.

Multiplayer functionality, accounts, online leaderboards, and backend services are not part of the MVP.

The priority is to create a polished game that anyone can understand and enjoy within a few minutes.

---

**Project Status:** Early development

*Collect the candy. Dodge the ghosts. Keep bouncing!* 🎃