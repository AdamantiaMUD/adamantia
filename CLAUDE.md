# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AdamantiaMUD is a modern MUD (Multi-User Dungeon) game engine built with TypeScript and Bun. It follows a monorepo structure with workspace packages and uses a bundle-based architecture for modular game features.

## Development Commands

**Root Level Commands:**
- `bun run lint` - Lint all packages in the workspace
- `bun run lint:fix` - Auto-fix linting issues across all packages  
- `bun run test` - Run tests for all packages
- `bun run type-check` - Type check all packages
- `bun run start` - Start the demo server (`@adamantiamud/demo`)

**Package-Level Commands (run from individual package directories):**
- `bunx eslint src/**/*` - Lint package source code
- `bunx eslint src/**/* --fix` - Auto-fix linting issues
- `bunx jest --config ./jest.config.cjs --coverage` - Run tests with coverage
- `bunx tsc --noEmit` - Type check without emitting files
- `bun ./src/server.ts` - Start demo server directly

## Architecture

### Monorepo Structure
- **packages/core** - Main game engine library with all core systems
- **packages/demo** - Example MUD implementation demonstrating the engine
- **packages/adamantiamud.com** - Website/documentation package
- **packages/area-maker** - Area creation tools

### Core Architecture (packages/core/src/)

The engine is organized into domain-specific modules:

**Core Systems:**
- `lib/game-server.js` - Main game server orchestration
- `lib/game-state.js` - Global game state management  
- `lib/bundle-manager.js` - Loads and manages modular game bundles

**Key Domains:**
- `abilities/` - Player/NPC abilities and skills system
- `attributes/` - Character stats and attribute formulas
- `behaviors/` - Entity behavior scripts and AI
- `characters/` - Base character functionality shared by players/NPCs
- `combat/` - Combat engine, damage calculations, loot tables
- `commands/` - Game command system and parser
- `communication/` - Player messaging, channels, broadcasts
- `data/` - Data loading and serialization utilities
- `effects/` - Temporary effects and buffs/debuffs
- `equipment/` - Items, inventory, and equipment systems
- `locations/` - Areas, rooms, and world geography
- `mobs/` - NPC management and spawning
- `players/` - Player accounts and character management
- `quests/` - Quest system and goal tracking

### Bundle System

Game features are organized as bundles in `core-bundles/`:
- `behaviors/` - Entity behavior definitions
- `combat/` - Combat-related commands and mechanics
- `commands/` - Core game commands with help files
- `default-areas/` - Starter game world areas
- `http-server/` - HTTP API endpoints (exported as `@adamantiamud/core/http`)

Each bundle contains commands, help files, areas, or other game content that gets loaded by the BundleManager.

## Technology Stack

- **Runtime:** Bun (requires Bun >= 1.0)
- **Language:** TypeScript with ESNext modules
- **Testing:** Jest with coverage reporting
- **Linting:** ESLint with custom configurations
- **Networking:** WebSocket (ws) and Fastify for HTTP
- **Data:** File-based JSON storage for areas/entities

## Key Entry Points

- `packages/core/src/index.ts` - Main library exports
- `packages/core/src/server.ts` - AdamantiaServer class
- `packages/demo/src/server.ts` - Demo MUD server
- `packages/core/src/core-bundles/http-server/index.ts` - HTTP API module

## Development Notes

- All packages use Bun as the package manager and runtime
- The project uses workspace dependencies (`workspace:*`)
- Core game logic is in TypeScript with strict type checking enabled
- Game data (areas, NPCs, items) is stored as JSON files
- Commands include both implementation and YAML help files