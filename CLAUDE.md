# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AdamantiaMUD is a modern MUD (Multi-User Dungeon) game engine built with TypeScript and Bun. It follows a monorepo structure and uses a bundle-based architecture for modular game features.

## Development Commands

**Root Level (workspace-wide):**
- `bun run lint` / `bun run lint:fix` - Lint all packages
- `bun run test` - Run tests for all packages
- `bun run type-check` - Type check all packages
- `bun run start` - Start the demo server

**Package Level (run from individual package directories):**
- `bunx jest --config ./jest.config.cjs --coverage` - Run tests with coverage
- `bunx jest --config ./jest.config.cjs --testPathPattern=<pattern>` - Run a single test file
- `bunx tsc --noEmit` - Type check
- `bunx eslint src/**/* --fix` - Auto-fix linting

**Testing notes:** Tests live in `packages/core/test/` (not colocated with source). Jest uses `ts-jest` with module name mapping for path aliases. Coverage excludes `index.ts` files.

## Architecture

### Monorepo Structure
- **packages/core** - Main game engine library (`@adamantiamud/core`)
- **packages/demo** - Example MUD implementation — primary reference for usage
- **packages/adamantiamud.com** - Website/documentation
- **packages/area-maker** - Area creation tools

### Startup Flow

```
AdamantiaServer (server.ts)
  → creates GameState
  → creates BundleManager
  → BundleManager.loadBundles()
      1. core-bundles/ (prefix "core.")    — always loaded
      2. optional-bundles/ (prefix "adamantia.") — conditional
      3. custom game bundles (from adamantia.json config)
  → GameServer fires startup event
  → game loop tickers start (100ms interval)
```

The demo server reads `packages/demo/src/adamantia.json` for its config and loads bundles from `packages/demo/src/bundles/`.

### GameState — Central Hub

`GameState` (`lib/game-state.ts`) holds all runtime managers and factories. Every bundle module receives `state: GameState` to access dependencies. Key members:
- **Managers:** `accountManager`, `playerManager`, `areaManager`, `roomManager`, `mobManager`, `itemManager`, `commandManager`, `channelManager`, `helpManager`, `partyManager`, `skillManager`, `spellManager`, `questManager`, `effectFactory`
- **Behavior managers** (by entity type): `areaBehaviorManager`, `mobBehaviorManager`, `itemBehaviorManager`, `roomBehaviorManager`
- **Factories:** `attributeFactory`, `itemFactory`, `mobFactory`, `roomFactory`, `areaFactory`
- **Event managers:** `serverEventManager` (game startup/shutdown), `streamEventManager` (network/input)

### Core Engine Domains (`packages/core/src/lib/`)

- `abilities/` - Player/NPC skills and spells system
- `attributes/` - Character stats and attribute formulas
- `behaviors/` - Entity behavior scripts and AI
- `characters/` - Base character functionality shared by players/NPCs
- `classes/` - Character class definitions
- `combat/` - Combat engine, damage calculations, loot tables
- `commands/` - Command system and parser
- `communication/` - Channels, messaging, broadcasts
- `effects/` - Temporary buffs/debuffs
- `equipment/` - Items, inventory, equipment slots
- `events/` - MudEvent and StreamEvent base types
- `groups/` - Party system
- `help/` - Help file management
- `locations/` - Areas, rooms, world geography
- `mobs/` - NPC management and spawning
- `players/` - Player accounts and character management
- `quests/` - Quest system and goal tracking
- `module-helpers/` - TypeScript interfaces for bundle module exports

### Bundle System

A bundle is a directory with subdirectories whose names determine what gets loaded. BundleManager loads each supported folder:

| Folder | Exports | Notes |
|---|---|---|
| `commands/` | `CommandModule` | One file per command |
| `behaviors/area/`, `behaviors/npc/`, etc. | `BehaviorModule` | Subdirs by entity type |
| `effects/` | `EffectModule` | |
| `attributes.js` | Array of `AttributeDefinition` | Single file export |
| `areas/` | Area JSON + manifest | `manifest.json` required |
| `input-events/` | `InputEventModule` | Login/connection flow |
| `player-events/` | `PlayerEventModule` | |
| `server-events/` | `ServerEventModule` | |
| `quest-goals/`, `quest-rewards/`, `quests/` | Quest modules | |

All module factory functions receive `state: GameState` as their argument.

### Command Structure

Each command file exports a `CommandModule`:
```typescript
export const name = 'look'
export const aliases = ['l', 'examine']
export const usage = 'look [target]'
export const listener = (state: GameState): CommandExecutable => (args, player) => { ... }
// optional:
export const requiredRole = PlayerRole.Admin
```

Help files for commands are YAML files alongside the command implementation.

### Configuration (`adamantia.json`)

```json
{
  "bundles": ["adamantia.simple-combat", "my-bundle"],
  "combatEngine": "adamantia.simple-combat",
  "logfile": "server.log",
  "players": { "startingRoom": "area-name:roomId" },
  "ports": { "telnet": 4000, "http": 4001 },
  "paths": {
    "data": "[ROOT]/../data",
    "bundles": "[ROOT]/bundles"
  }
}
```

`[ROOT]` is a path placeholder resolved relative to the config file location.

### Networking

- **Telnet** (`core-bundles/telnet-networking/`) — primary game transport; default port 4000
- **HTTP/REST** (`core-bundles/http-server/`) — Fastify API, exported as `@adamantiamud/core/http`; default port 4001
- **WebSocket** (`optional-bundles/websocket-networking/`) — alternative transport, not enabled in demo by default

### Area Data Format

Areas live in `areas/` inside a bundle. Each area needs:
- `manifest.json` — `{ "name": "Area Name" }`
- `rooms/` — room definition JSON files

Items, NPCs, and quests are also defined as JSON within the area directory. After all bundles load, BundleManager calls a hydration pass to resolve cross-references.

### TypeScript Conventions

- Strict mode, ESNext modules, bundler module resolution
- All bundle module types are defined in `lib/module-helpers/`
- Path aliases configured in `tsconfig.json` and mirrored in `jest.config.cjs`
- 4-space indentation, single quotes, trailing commas (es5), LF line endings
