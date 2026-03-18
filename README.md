# SmartCity GreenFarm -- Tycoon

Jeu de gestion de ville intelligente (tycoon) ou le joueur gere 5 systemes interconnectes : Trafic, Energie, Securite, Dechets et GreenFarm.

## Gameplay

- Construisez et ameliorez des batiments dans 5 modules
- Gerez un budget avec revenus, depenses et prets
- Progressez sur 50 niveaux avec deblocages progressifs
- Reagissez a des evenements dynamiques (meteo, sociaux, infrastructure)
- Exploitez les synergies cross-modules pour maximiser la satisfaction

Voir [docs/GAME_SPEC.md](docs/GAME_SPEC.md) pour la specification complete.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Rendu jeu | PixiJS v8 + @pixi/react (grille isometrique) |
| State | Zustand (etat de jeu partage game loop / React) |
| Backend | Node.js + Express + TypeScript |
| Base de donnees | PostgreSQL + TimescaleDB |
| Temps reel | WebSocket (Socket.io) |
| CI/CD | GitHub Actions |
| Containerisation | Docker + Docker Compose |

## Demarrage rapide

```bash
# Cloner le repo
git clone https://github.com/maillotAPois/smartcity-greenfarm.git
cd smartcity-greenfarm

# Lancer avec Docker
docker compose up

# Ou en local
cd frontend && npm install && npm run dev
cd backend && cp .env.example .env && npm install && npm run dev
```

## Structure

```
smartcity-greenfarm/
├── frontend/
│   └── src/
│       ├── game/
│       │   ├── engine/         # GameLoop, GameClock, SimulationEngine, EventEngine
│       │   ├── systems/        # Traffic, Energy, Security, Waste, Farm, Economy, Progression
│       │   ├── state/          # Zustand store, types, selectors, actions
│       │   ├── renderer/       # CityMap (PixiJS), MapRenderer, layers
│       │   └── data/           # buildings, upgrades, events, crops, missions
│       ├── modules/            # Panels par module (traffic, energy, security, waste, greenfarm)
│       ├── components/
│       │   ├── layout/         # TopBar, Sidebar, NotificationBar
│       │   └── shared/         # KPICard, UpgradeTree, BudgetScreen, BuildMenu
│       ├── hooks/              # useGameLoop, useGameState, useSocket
│       └── services/           # API client, save/load
├── backend/
│   └── src/
│       ├── routes/             # auth, game, leaderboard
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── middleware/         # auth JWT, validation Zod
│       └── socket/            # Socket.io leaderboard temps reel
├── database/                  # Migrations SQL (001-004)
├── docker-compose.yml
└── .github/workflows/         # CI/CD
```

## Branches

- `main` -- production (protegee)
- `develop` -- integration
- `feature/*` -- nouvelles fonctionnalites
- `fix/*` -- corrections
