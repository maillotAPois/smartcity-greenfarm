# SmartCity GreenFarm

Dashboard web unifie pour ville intelligente.

## Modules

- **Core** -- Dashboard principal, authentification, KPIs globaux
- **Trafic** -- Carte temps reel, congestion, incidents
- **Energie** -- Consommation par quartier, pilotage eclairage
- **Securite** -- Alertes, carte des incidents, surveillance
- **Dechets** -- Conteneurs, tournees de collecte, qualite de l'air
- **GreenFarm** -- Capteurs ferme urbaine, pilotage irrigation/ventilation

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
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
├── frontend/               # React SPA
│   └── src/
│       ├── components/     # Composants partages
│       ├── modules/        # traffic, energy, security, waste, greenfarm
│       ├── hooks/
│       ├── services/       # Appels API
│       └── types/
├── backend/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       ├── services/
│       └── simulators/     # Generateurs de donnees IoT
├── database/               # Migrations, seeds
├── config/                 # Configuration simulateur
├── docker-compose.yml
└── .github/workflows/      # CI/CD
```

## Branches

- `main` -- production (protegee)
- `develop` -- integration
- `feature/*` -- nouvelles fonctionnalites
- `fix/*` -- corrections
