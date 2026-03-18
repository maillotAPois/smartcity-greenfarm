# SmartCity GreenFarm -- Specification du Jeu

> Tycoon de gestion de ville intelligente -- Document de reference technique et gameplay

---

## Table des matieres

1. [Vision et Core Loop](#1-vision-et-core-loop)
2. [Les 5 systemes de jeu](#2-les-5-systemes-de-jeu)
3. [Systeme economique](#3-systeme-economique)
4. [Progression](#4-progression)
5. [Evenements et missions](#5-evenements-et-missions)
6. [Interface hybride (UI)](#6-interface-hybride-ui)
7. [Architecture technique](#7-architecture-technique)
8. [Schema de base de donnees](#8-schema-de-base-de-donnees)
9. [API Endpoints](#9-api-endpoints)
10. [Matrice d'interactions cross-module](#10-matrice-dinteractions-cross-module)
11. [Plan de sprints](#11-plan-de-sprints)

---

## 1. Vision et Core Loop

Le joueur incarne le gestionnaire d'une ville intelligente en pleine expansion. Il doit equilibrer cinq systemes interconnectes pour faire prosperer sa cite tout en repondant aux crises et aux opportunites.

### Boucle principale

```
OBSERVER -> DECIDER -> AGIR -> SIMULER -> EVALUER
    |                                         |
    +<----------------------------------------+
```

| Etape      | Description                                                        |
|------------|--------------------------------------------------------------------|
| Observer   | Le joueur consulte les metriques, la carte et les alertes          |
| Decider    | Il choisit ses investissements et priorites                        |
| Agir       | Il construit, ameliore ou repond a un evenement                    |
| Simuler    | La simulation avance d'un tick, les systemes se mettent a jour     |
| Evaluer    | Les resultats sont calcules : revenus, metriques, consequences     |

Le jeu est un **tycoon de gestion de ville intelligente** ou le joueur gere **5 systemes interconnectes** : Traffic, Energy, Security, Waste et GreenFarm. Chaque decision dans un systeme a des repercussions sur les autres, forcant le joueur a penser globalement.

---

## 2. Les 5 systemes de jeu

Chaque systeme correspond a un module du dashboard original et possede ses propres batiments, metriques, upgrades, sources de revenus et conditions d'echec.

---

### 2.1 Traffic

Gestion des routes, intersections, feux de signalisation et transports en commun.

#### Buildings

| Nom                    | Cout   | Niveau requis | Description                          |
|------------------------|--------|---------------|--------------------------------------|
| Basic Road             | 100    | 1             | Segment routier standard             |
| Smart Traffic Light    | 500    | 3             | Feu intelligent avec capteurs        |
| Bus Station            | 2 000  | 5             | Arret de bus avec abri connecte      |
| Metro Line             | 10 000 | 15            | Ligne de metro souterraine           |
| Highway Interchange    | 25 000 | 25            | Echangeur autoroutier multi-niveaux  |

#### Metrics

| Metrique              | Unite        | Objectif optimal |
|-----------------------|--------------|------------------|
| Average Commute Time  | minutes      | < 20 min         |
| Congestion Index      | % (0-100)    | < 40%            |
| Accidents / Month     | nombre       | < 5              |

#### Upgrades

| Upgrade                  | Cout de base | Effet                                       |
|--------------------------|--------------|----------------------------------------------|
| AI Traffic Optimization  | 8 000        | Congestion -25%, commute time -15%           |
| Smart Parking            | 5 000        | Revenus parking +40%, congestion -10%        |
| Electric Bus Fleet       | 12 000       | Emissions -50%, cout maintenance -20%        |

#### Revenue

- Tolls (peages) : proportionnels au trafic
- Parking fees : basees sur la capacite de stationnement intelligent
- Public transport tickets : basees sur le nombre de passagers

#### Condition d'echec

```
SI congestion_index > 90% ALORS gridlock
  -> Tous les revenus Traffic divises par 2
  -> Emergency response time (Security) multiplie par 3
  -> Duree : 5 ticks ou jusqu'a resolution
```

---

### 2.2 Energy

Gestion de la production, du stockage et de la distribution d'energie.

#### Buildings

| Nom                  | Cout   | Niveau requis | Description                          |
|----------------------|--------|---------------|--------------------------------------|
| Solar Panel Array    | 800    | 1             | Panneaux solaires (5 MW)             |
| Wind Turbine         | 1 200  | 4             | Eolienne (8 MW)                      |
| Battery Storage      | 3 000  | 8             | Stockage batterie (20 MWh)           |
| Smart Grid Hub       | 8 000  | 18            | Hub de distribution intelligente     |
| Nuclear Plant        | 50 000 | 35            | Centrale nucleaire (500 MW)          |

#### Metrics

| Metrique         | Unite | Objectif optimal |
|------------------|-------|------------------|
| Total Capacity   | MW    | > demande * 1.3  |
| Green Ratio      | %     | > 70%            |
| Grid Stability   | %     | > 90%            |
| Blackout Risk    | %     | < 10%            |

#### Upgrades

| Upgrade                | Cout de base | Effet                                    |
|------------------------|--------------|------------------------------------------|
| Efficiency Boosters    | 6 000        | Production +20% par source               |
| Smart Meters           | 4 000        | Gaspillage -30%, revenus +15%            |
| Superconductor Grid    | 20 000       | Pertes de transmission -80%, stabilite +25% |

#### Revenue

- Vente d'electricite aux citoyens : `prix_kwh * consommation_population`

#### Condition d'echec

```
SI demand > supply * 1.1 ALORS blackout
  -> Security cameras/drones desactivees
  -> Vertical farms et recycling hors service
  -> Revenus Energy a 0 pendant la duree
  -> Duree : 3 ticks ou jusqu'a retablissement de l'equilibre
```

---

### 2.3 Security

Gestion de la surveillance, des patrouilles et des interventions d'urgence.

#### Buildings

| Nom                       | Cout   | Niveau requis | Description                          |
|---------------------------|--------|---------------|--------------------------------------|
| CCTV Camera               | 300    | 1             | Camera de surveillance standard      |
| Police Station            | 3 000  | 5             | Poste de police de quartier          |
| Fire Station              | 3 500  | 7             | Caserne de pompiers                  |
| Emergency Dispatch Center | 8 000  | 16            | Centre de coordination d'urgence     |
| Drone Surveillance Hub    | 15 000 | 28            | Hub de surveillance par drones       |

#### Metrics

| Metrique              | Unite       | Objectif optimal |
|-----------------------|-------------|------------------|
| Crime Rate            | incidents/tick | < 2           |
| Response Time         | minutes     | < 5 min          |
| Citizen Safety Score  | 0-100       | > 80             |

#### Upgrades

| Upgrade                | Cout de base | Effet                                    |
|------------------------|--------------|------------------------------------------|
| AI Facial Recognition  | 10 000       | Crime rate -30%, detection +50%          |
| Predictive Policing    | 12 000       | Prevention +40%, response time -20%      |
| Autonomous Drones      | 18 000       | Couverture surveillance +60%             |

#### Revenue

- Safety tax : taxe de securite prelevee sur les citoyens, proportionnelle a la population

#### Condition d'echec

```
SI citizen_safety_score < 30 ALORS crime_wave
  -> Population growth stoppe
  -> Crime rate triple
  -> Revenus de tous les modules -20% (fuite des citoyens)
  -> Duree : 8 ticks ou jusqu'a safety score > 50
```

---

### 2.4 Waste

Gestion de la collecte, du recyclage et du traitement des dechets.

#### Buildings

| Nom                    | Cout   | Niveau requis | Description                          |
|------------------------|--------|---------------|--------------------------------------|
| Trash Bin Network      | 200    | 1             | Reseau de poubelles de quartier      |
| Recycling Center       | 2 500  | 6             | Centre de tri et recyclage           |
| Composting Facility    | 1 800  | 9             | Installation de compostage           |
| Waste-to-Energy Plant  | 12 000 | 22            | Usine de valorisation energetique    |
| Smart Bin System       | 6 000  | 14            | Poubelles connectees avec capteurs   |

#### Metrics

| Metrique           | Unite | Objectif optimal |
|--------------------|-------|------------------|
| Collection Rate    | %     | > 95%            |
| Recycling Ratio    | %     | > 60%            |
| Landfill Capacity  | %     | > 30% restant    |
| Pollution Index    | 0-100 | < 20             |

#### Upgrades

| Upgrade                | Cout de base | Effet                                    |
|------------------------|--------------|------------------------------------------|
| AI Sorting             | 7 000        | Recycling ratio +35%                     |
| Pneumatic Collection   | 15 000       | Collection rate +25%, cout main-d'oeuvre -40% |
| Zero-Waste Tech        | 25 000       | Landfill usage -80%, pollution -50%      |

#### Revenue

- Recycling sales : vente de materiaux recycles
- Waste-to-energy : production d'electricite a partir des dechets (synergie avec Energy)

#### Condition d'echec

```
SI pollution_index > 80 ALORS health_crisis
  -> Population health diminue drastiquement
  -> Citizen safety score -20
  -> Cout de sante publique : 500 credits/tick
  -> Duree : 10 ticks ou jusqu'a pollution < 50
```

---

### 2.5 GreenFarm

Agriculture urbaine, fermes verticales et systemes hydroponiques.

#### Buildings

| Nom                  | Cout   | Niveau requis | Description                          |
|----------------------|--------|---------------|--------------------------------------|
| Community Garden     | 400    | 1             | Jardin communautaire de quartier     |
| Greenhouse           | 1 500  | 5             | Serre connectee                      |
| Vertical Farm        | 8 000  | 15            | Ferme verticale multi-etages         |
| Hydroponics Lab      | 6 000  | 20            | Laboratoire hydroponique             |
| Aquaponics Center    | 12 000 | 30            | Centre aquaponique integre           |

#### Metrics

| Metrique            | Unite        | Objectif optimal |
|---------------------|--------------|------------------|
| Food Production     | tons/month   | > population needs * 1.2 |
| Crop Diversity      | nombre types | > 15             |
| Organic Ratio       | %            | > 80%            |
| Water Efficiency    | %            | > 85%            |

#### Upgrades

| Upgrade                | Cout de base | Effet                                    |
|------------------------|--------------|------------------------------------------|
| AI Crop Optimization   | 9 000        | Production +30%, water efficiency +20%   |
| Gene Editing           | 20 000       | Crop diversity +50%, rendement +25%      |
| Automated Harvest      | 14 000       | Cout main-d'oeuvre -60%, production +15% |

#### Revenue

- Food sales : vente de production alimentaire aux citoyens
- Farm tourism : revenus touristiques (proportionnels a la diversite et au ratio organique)

#### Condition d'echec

```
SI food_production < population_needs * 0.6 ALORS famine
  -> Population decline de 5%/tick
  -> Crime rate augmente de 50%
  -> Citizen satisfaction effondree
  -> Duree : jusqu'a retablissement de la production
```

#### Sensors (issus de la configuration existante)

Ces capteurs alimentent les metriques en temps reel des installations GreenFarm :

| Sensor       | Base Value | Variance | Unit |
|--------------|------------|----------|------|
| humidity     | 55         | 8        | %    |
| temperature  | 22         | 3        | C    |
| light        | 800        | 200      | lux  |
| pH           | 6.5        | 0.3      | -    |
| water_level  | 70         | 5        | %    |

La simulation genere les valeurs de capteurs avec la formule :

```
sensor_value = base + (Math.random() * 2 - 1) * variance
```

Des valeurs hors plage optimale degradent la production agricole proportionnellement a l'ecart.

---

## 3. Systeme economique

### Capital de depart

```
starting_credits = 10 000
```

### Sources de revenus par systeme

| Systeme  | Source principale              | Source secondaire         |
|----------|-------------------------------|--------------------------|
| Traffic  | Tolls, transport tickets      | Parking fees             |
| Energy   | Vente d'electricite           | -                        |
| Security | Safety tax                    | -                        |
| Waste    | Recycling sales               | Waste-to-energy          |
| Farm     | Food sales                    | Farm tourism             |

### Depenses

| Type              | Calcul                                          |
|-------------------|-------------------------------------------------|
| Maintenance       | 2% du cout de construction par tick par batiment |
| Salaires          | Proportionnels au nombre de batiments actifs     |
| Reparations       | Declenchees par evenements, cout variable        |

```
maintenance_cost_per_tick = building_cost * 0.02
total_expenses = sum(maintenance) + salaries + emergency_repairs
```

### Systeme de prets

| Parametre        | Valeur                     |
|------------------|----------------------------|
| Montant maximum  | 50 000 credits             |
| Taux d'interet   | 5% par tranche de 10 ticks |
| Remboursement    | Automatique ou manuel      |

```
loan_repayment_per_tick = loan_amount * 1.05 / repayment_ticks
```

### Formule de cout des upgrades

```
upgrade_cost = baseCost * (1.15 ^ level)
```

| Niveau | Multiplicateur |
|--------|----------------|
| 1      | 1.15x          |
| 5      | 2.01x          |
| 10     | 4.05x          |
| 15     | 8.14x          |
| 20     | 16.37x         |

### Condition de faillite

```
SI balance < 0 PENDANT 10 ticks consecutifs ALORS bankruptcy
  -> Game over
  -> Score final calcule
  -> Option de recommencer ou charger une sauvegarde
```

---

## 4. Progression

### Niveaux

Le jeu comporte **50 niveaux**. La quantite d'XP requise pour chaque niveau suit une courbe exponentielle.

#### Formule d'XP

```
requiredXP = 100 * (1.2 ^ level)
```

| Niveau | XP requis | XP cumule (approx.) |
|--------|-----------|----------------------|
| 1      | 120       | 120                  |
| 5      | 249       | 893                  |
| 10     | 619       | 3 596                |
| 20     | 3 834     | 39 581               |
| 30     | 23 738    | 283 682              |
| 40     | 146 977   | 1 810 550            |
| 50     | 910 044   | 11 573 392           |

### Sources d'XP

| Source                  | XP accorde                       |
|-------------------------|----------------------------------|
| Building construction   | 10% du cout en credits           |
| Upgrade completion      | 20% du cout en credits           |
| Event resolution        | 50 - 500 selon la difficulte     |
| Mission completion      | 100 - 2 000 selon le type        |

### Deblocages par tier

| Tier  | Niveaux | Contenu debloque                              |
|-------|---------|------------------------------------------------|
| I     | 1-10    | Basic buildings de tous les modules            |
| II    | 11-20   | Advanced buildings, premiers upgrades          |
| III   | 21-30   | Cross-module synergies, batiments speciaux     |
| IV    | 31-40   | Prestige buildings, upgrades avances           |
| V     | 41-50   | Endgame tech, batiments legendaires            |

### Milestones

Tous les **5 niveaux**, le joueur recoit une recompense speciale :

| Niveau | Recompense                                          |
|--------|-----------------------------------------------------|
| 5      | Bonus 2 000 credits + unlock Smart Traffic Light    |
| 10     | Choix d'un upgrade gratuit (tier I)                 |
| 15     | Unlock Metro Line + bonus XP x1.5 pendant 20 ticks |
| 20     | Unlock cross-module interaction de son choix        |
| 25     | Bonus 15 000 credits + unlock Highway Interchange   |
| 30     | Unlock Aquaponics Center + upgrade gratuit (tier II) |
| 35     | Unlock Nuclear Plant + reduction maintenance 10%    |
| 40     | Unlock tous les prestige buildings                  |
| 45     | Bonus XP x2 permanent + 50 000 credits             |
| 50     | Acces au systeme de Prestige                        |

### Systeme de Prestige

Au niveau 50, le joueur peut effectuer un **Prestige Reset** :

- Retour au niveau 1
- Perte de tous les batiments et credits
- Conservation des achievements
- Gain de **multiplicateurs permanents** :

| Prestige | Bonus revenus | Bonus XP | Bonus special                    |
|----------|---------------|----------|----------------------------------|
| 1        | +10%          | +15%     | 1 building gratuit au demarrage  |
| 2        | +20%          | +30%     | Unlock early d'un module au choix|
| 3        | +35%          | +50%     | Reduction maintenance globale 5% |
| 5        | +60%          | +80%     | Acces aux blueprints legendaires |
| 10       | +100%         | +120%    | Mode sandbox debloque            |

---

## 5. Evenements et missions

### Evenements

Les evenements sont declenches aleatoirement ou par des conditions specifiques. Ils exigent une reponse du joueur dans un delai imparti.

#### Weather Events

| Evenement | Condition de declenchement | Effet                                     | Duree   |
|-----------|----------------------------|-------------------------------------------|---------|
| Heatwave  | Aleatoire (ete)            | Energy demand +40%, farm water -30%        | 5 ticks |
| Storm     | Aleatoire                  | Wind turbines +50% mais solar -80%, risque de degats | 3 ticks |
| Flood     | Apres storm prolonge       | Traffic gridlock, waste collection -50%, farm damage | 8 ticks |

#### Social Events

| Evenement       | Condition                    | Effet                                     | Duree   |
|-----------------|------------------------------|-------------------------------------------|---------|
| Protest         | Safety score < 50 ou pollution > 60 | Revenus -15%, crime +20%            | 4 ticks |
| Festival        | Safety score > 70 et food > needs  | Revenus +25%, tourism +50%          | 3 ticks |
| Population Boom | Score global > 75            | Population +20%, demande +20% sur tout    | Permanent |

#### Infrastructure Events

| Evenement     | Condition                     | Effet                                     | Cout reparation |
|---------------|-------------------------------|-------------------------------------------|-----------------|
| Pipe Burst    | Infrastructure vieillissante  | Water efficiency -40%, farm production -20%| 2 000           |
| Power Surge   | Grid stability < 60%         | Blackout risk +30%, equipements endommages | 3 500           |
| Road Collapse | Maintenance negligee          | Congestion +50%, accidents +100%          | 5 000           |

#### Economic Events

| Evenement      | Condition           | Effet                                     | Duree   |
|----------------|---------------------|-------------------------------------------|---------|
| Recession      | Aleatoire           | Revenus -30%, population growth stoppe     | 10 ticks|
| Boom           | Aleatoire           | Revenus +40%, cout construction -20%       | 8 ticks |
| Investor Visit | Level > 15          | Bonus credits si metriques satisfaisantes  | 2 ticks |

#### Cross-Module Events

| Evenement  | Systemes affectes | Effet                                                   |
|------------|-------------------|---------------------------------------------------------|
| Pandemic   | Tous              | Population -5%, revenus -25%, security demand +50%, farm demand +30% |

### Story Missions

#### Tutoriel

Chaine de missions guidees pour les nouveaux joueurs (niveaux 1-5) couvrant la construction de base, la lecture des metriques et la gestion budgetaire.

#### Missions par module

Chaque module possede **10 missions narratives** qui se debloquent avec la progression :

| Module   | Exemple mission 1                  | Exemple mission 10                          |
|----------|-------------------------------------|---------------------------------------------|
| Traffic  | "Construire 5 routes basiques"     | "Zero accident pendant 50 ticks"            |
| Energy   | "Atteindre 50 MW de capacite"      | "100% green ratio pendant 30 ticks"         |
| Security | "Safety score > 60"                | "Crime rate = 0 pendant 20 ticks"           |
| Waste    | "Recycling ratio > 40%"           | "Zero landfill : tout est recycle/composte" |
| Farm     | "Produire 10 tons/month"          | "Nourrir 200% de la population"             |

#### Daily Challenges

Chaque jour (en temps reel), un defi bonus est propose :

- Recompense : 200-1 000 XP + 500-3 000 credits
- Exemples : "Construire 3 batiments en 1 tick", "Resoudre un evenement sans depenser de credits"
- Streak bonus : recompenses augmentent de 10% par jour consecutif (max 7 jours)

---

## 6. Interface hybride (UI)

L'interface combine un rendu isometrique via PixiJS pour la carte du jeu et des panneaux React pour les controles et informations.

### Layout general

```
+----------------------------------------------------------------+
|  [Credits] [Population] [Level/XP Bar] [Pause|1x|2x|5x] [Date]|  <- Top Bar
+----------+---------------------------------------------+-------+
|          |                                             |       |
| Module   |                                             | Notif |
| Selector |          PixiJS Isometric Grid              | Bar   |
|          |          (carte de la ville)                 |       |
| Building |          avec overlays par module            | Events|
| Menu     |                                             | Alerts|
|          |                                             | Missions|
| Upgrade  |                                             |       |
| Tree     |                                             |       |
|          |                                             |       |
+----------+---------------------------------------------+-------+
```

### Top Bar

| Element            | Description                                        |
|--------------------|----------------------------------------------------|
| Credits            | Solde actuel avec indicateur de tendance (+/-)      |
| Population         | Nombre de citoyens avec taux de croissance          |
| Level / XP Bar     | Niveau actuel et barre de progression vers le suivant |
| Game Speed Controls| Boutons : Pause, 1x, 2x, 5x                       |
| Date               | Date in-game (jour/mois/annee de simulation)       |

### Sidebar (gauche)

| Element         | Description                                           |
|-----------------|-------------------------------------------------------|
| Module Selector | 5 onglets (Traffic, Energy, Security, Waste, Farm)    |
| Building Menu   | Liste des batiments disponibles selon le module et le niveau |
| Upgrade Tree    | Arbre de competences avec prerequis et couts          |

### Notification Bar (droite)

| Element   | Description                                              |
|-----------|----------------------------------------------------------|
| Events    | Evenements en cours avec timer et options de reponse     |
| Alerts    | Alertes critiques (echecs, seuils depasses)              |
| Missions  | Progression des missions actives avec objectifs          |

### Modals

| Modal                  | Declencheur                       | Contenu                              |
|------------------------|-----------------------------------|--------------------------------------|
| Building Details       | Clic sur un batiment              | Stats, cout maintenance, options     |
| Upgrade Confirmation   | Clic sur un upgrade               | Cout, effet, confirmation            |
| Event Response         | Evenement declenche               | Description, choix de reponse, timer |
| Save/Load              | Menu                              | Liste des sauvegardes                |
| Prestige               | Niveau 50                         | Bonus, confirmation de reset         |

### Overlays par module

Quand un module est selectionne, la carte affiche un overlay colore :

| Module   | Couleur overlay | Informations affichees                     |
|----------|----------------|--------------------------------------------|
| Traffic  | Bleu           | Flux routiers, zones de congestion         |
| Energy   | Jaune          | Zones alimentees, sources de production    |
| Security | Rouge          | Zones couvertes, incidents en cours        |
| Waste    | Vert fonce     | Zones collectees, niveau des poubelles     |
| Farm     | Vert clair     | Zones cultivees, rendement par parcelle    |

---

## 7. Architecture technique

### Choix technologiques

| Couche     | Technologie                | Justification                              |
|------------|----------------------------|--------------------------------------------|
| Rendering  | PixiJS v8 + @pixi/react   | Leger, s'integre nativement avec React. Phaser est trop lourd et entre en conflit avec le lifecycle React. |
| State      | Zustand                    | Accessible depuis le game loop ET les composants React sans re-renders inutiles |
| Game Loop  | Custom tick-based          | Independant du framerate, deterministe, reproductible |
| Backend    | Express.js                 | Simple, performant, ecosysteme mature      |
| Auth       | JWT (JSON Web Tokens)      | Stateless, scalable                        |
| Persistence| PostgreSQL (JSONB)         | Flexibilite du JSONB pour les saves, robustesse SQL pour le reste |
| Real-time  | Socket.io                  | Leaderboard en temps reel                  |
| Frontend   | React 18+ avec TypeScript  | Base existante du projet                   |

### Game Loop (tick-based)

Le game loop est **tick-based** et non frame-based. Il est decouple du rendering.

```typescript
// Pseudo-code du game loop
const TICK_RATES = { pause: 0, '1x': 1000, '2x': 500, '5x': 200 }; // ms par tick

interface GameLoop {
  currentTick: number;
  speed: 'pause' | '1x' | '2x' | '5x';
  lastTickTime: number;
}

function gameTick(state: GameState): GameState {
  // 1. Calculer les revenus de chaque module
  // 2. Deduire les depenses (maintenance, salaires, prets)
  // 3. Mettre a jour les metriques de chaque systeme
  // 4. Evaluer les interactions cross-module
  // 5. Verifier les conditions d'echec
  // 6. Verifier les evenements aleatoires
  // 7. Mettre a jour la progression (XP, missions)
  // 8. Incrementer le tick counter
  return newState;
}
```

Configuration par defaut : **1 tick par seconde** (1x speed).

| Vitesse | Intervalle entre ticks |
|---------|------------------------|
| Pause   | Arrete                 |
| 1x      | 1 000 ms               |
| 2x      | 500 ms                 |
| 5x      | 200 ms                 |

### Structure Zustand Store

```typescript
interface GameStore {
  // Core
  tick: number;
  speed: GameSpeed;
  credits: number;
  population: number;
  level: number;
  xp: number;

  // Modules
  traffic: TrafficState;
  energy: EnergyState;
  security: SecurityState;
  waste: WasteState;
  farm: FarmState;

  // Systems
  buildings: Building[];
  upgrades: Record<string, UpgradeState>;
  events: ActiveEvent[];
  missions: Mission[];
  loans: Loan[];

  // Actions
  placeBuild: (type: BuildingType, position: GridPosition) => void;
  purchaseUpgrade: (upgradeId: string) => void;
  respondToEvent: (eventId: string, choice: string) => void;
  setSpeed: (speed: GameSpeed) => void;
  processTick: () => void;
  saveGame: () => GameSave;
  loadGame: (save: GameSave) => void;
}
```

### Architecture des fichiers (frontend)

```
src/
  game/
    loop.ts              # Game loop principal (tick-based)
    systems/
      traffic.ts         # Logique Traffic
      energy.ts          # Logique Energy
      security.ts        # Logique Security
      waste.ts           # Logique Waste
      farm.ts            # Logique Farm
    interactions.ts      # Matrice d'interactions cross-module
    events.ts            # Moteur d'evenements
    economy.ts           # Systeme economique
    progression.ts       # XP, niveaux, prestige
  store/
    gameStore.ts         # Zustand store principal
    selectors.ts         # Selectors optimises
  renderer/
    PixiCanvas.tsx       # Composant @pixi/react principal
    IsometricGrid.tsx    # Grille isometrique
    BuildingSprite.tsx   # Sprites des batiments
    Overlays.tsx         # Overlays par module
  ui/
    TopBar.tsx
    Sidebar.tsx
    NotificationBar.tsx
    Modals/
  api/
    auth.ts
    games.ts
    leaderboard.ts
```

---

## 8. Schema de base de donnees

### Table `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table `game_saves`

```sql
CREATE TABLE game_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  state JSONB NOT NULL,
  tick_count INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_game_saves_user_id ON game_saves(user_id);
```

### Table `leaderboard`

```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score BIGINT NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  city_name VARCHAR(100) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE UNIQUE INDEX idx_leaderboard_user ON leaderboard(user_id);
```

### Table `achievements`

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(100)
);
```

### Table `user_achievements`

```sql
CREATE TABLE user_achievements (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);
```

### Diagramme des relations

```
users 1---* game_saves
users 1---1 leaderboard
users *---* achievements (via user_achievements)
```

---

## 9. API Endpoints

### Authentication

| Methode | Route              | Description                | Body                          | Reponse                  |
|---------|--------------------|----------------------------|-------------------------------|--------------------------|
| POST    | /api/auth/register | Inscription                | `{ username, email, password }` | `{ token, user }`      |
| POST    | /api/auth/login    | Connexion                  | `{ email, password }`         | `{ token, user }`       |
| GET     | /api/auth/me       | Profil utilisateur courant | -                             | `{ user }`              |

### Game Saves

| Methode | Route             | Description                  | Body / Params           | Reponse               |
|---------|-------------------|------------------------------|-------------------------|------------------------|
| GET     | /api/games        | Liste des sauvegardes        | -                       | `{ saves: [...] }`    |
| POST    | /api/games        | Creer une sauvegarde         | `{ name, state, tick_count, level }` | `{ save }`  |
| GET     | /api/games/:id    | Charger une sauvegarde       | -                       | `{ save }`            |
| PUT     | /api/games/:id    | Mettre a jour une sauvegarde | `{ name?, state?, tick_count?, level? }` | `{ save }` |
| DELETE  | /api/games/:id    | Supprimer une sauvegarde     | -                       | `{ success: true }`   |

Toutes les routes `/api/games` necessitent un header `Authorization: Bearer <token>`.

### Leaderboard

| Methode | Route             | Description                  | Body / Params                  | Reponse                |
|---------|-------------------|------------------------------|--------------------------------|------------------------|
| GET     | /api/leaderboard  | Top 100 du classement        | Query: `?limit=100&offset=0`  | `{ entries: [...] }`  |
| POST    | /api/leaderboard  | Soumettre / mettre a jour    | `{ score, level, city_name }` | `{ entry }`           |

### Achievements

| Methode | Route                | Description                    | Reponse                    |
|---------|----------------------|--------------------------------|----------------------------|
| GET     | /api/achievements    | Liste de tous les achievements | `{ achievements: [...] }`  |
| GET     | /api/achievements/me | Achievements du joueur         | `{ unlocked: [...] }`     |

### Socket.io

| Namespace      | Event              | Direction       | Payload                          |
|----------------|--------------------|-----------------|----------------------------------|
| /leaderboard   | `score:updated`    | Server -> Client| `{ user_id, score, level, city_name, rank }` |
| /leaderboard   | `top10:changed`    | Server -> Client| `{ entries: [...] }`            |
| /leaderboard   | `subscribe`        | Client -> Server| -                                |

---

## 10. Matrice d'interactions cross-module

Chaque systeme influence les autres. Voici la matrice complete des interactions :

### Tableau synthetique

| Source    | Cible    | Interaction positive                    | Interaction negative                    |
|-----------|----------|-----------------------------------------|-----------------------------------------|
| Energy    | Traffic  | Vehicules electriques : emissions -30%  | Blackout : chaos routier, feux HS       |
| Energy    | Security | Alimente cameras et drones              | Blackout : securite desactivee          |
| Energy    | Waste    | Alimente recyclage et waste-to-energy   | Blackout : usines a l'arret             |
| Energy    | Farm     | Alimente vertical farms et serres       | Blackout : production agricole -80%     |
| Traffic   | Security | -                                       | Congestion : response time augmente     |
| Traffic   | Waste    | -                                       | Routes degradees : collecte moins efficace |
| Traffic   | Farm     | Infrastructure de transport pour distribution | Congestion : distribution alimentaire ralentie |
| Security  | Tous     | Haute securite encourage la croissance  | Faible securite decourage la population |
| Waste     | Farm     | Compost augmente le rendement agricole (+20%) | -                                 |
| Waste     | Energy   | Waste-to-energy fournit de l'electricite | -                                     |
| Farm      | Waste    | Dechets organiques pour le compostage   | -                                       |
| Farm      | Security | Securite alimentaire reduit la criminalite (-15%) | -                            |

### Matrice numerique (coefficients d'influence)

```
              Traffic  Energy  Security  Waste  Farm
Traffic         -       0.0     -0.2     -0.1   -0.1
Energy        +0.3       -      +0.3     +0.2   +0.3
Security      0.0       0.0       -       0.0    0.0
Waste         0.0      +0.1      0.0       -    +0.2
Farm          0.0       0.0     +0.15    +0.1     -

Legende : valeur positive = bonus, negative = malus
Coefficient applique sur l'efficacite globale du module cible
```

### Regles de cascade

Les echecs se propagent selon ces regles :

```
blackout (Energy) -> desactive Security cameras/drones
                  -> Traffic lights HS (congestion +40%)
                  -> Farm vertical farms en arriere (+production -80%)
                  -> Waste recycling/waste-to-energy stoppe

gridlock (Traffic) -> Security response time x3
                   -> Waste collection rate -40%
                   -> Farm distribution bloquee

crime_wave (Security) -> Population growth = 0
                      -> Tous revenus -20%

health_crisis (Waste) -> Safety score -20
                      -> Population health decline

famine (Farm) -> Crime rate +50%
              -> Population -5%/tick
```

---

## 11. Plan de sprints

Planification sur **8 sprints** repartis sur environ **14 semaines**.

### Vue d'ensemble

```
S1 [====] S2 [====] S3 [====] S4 [====] S5 [====] S6 [====] S7 [==] S8 [==]
W1   W2   W3   W4   W5   W6   W7   W8   W9  W10  W11  W12   W13    W14
```

---

### Sprint 1 -- Fondations (Semaines 1-2)

**Objectif** : Infrastructure de base jouable avec un canvas vide et un game loop fonctionnel.

| Tache                                      | Priorite | Estimation |
|--------------------------------------------|----------|------------|
| Setup projet (Vite + React + TypeScript)   | P0       | 2j         |
| Integration PixiJS v8 + @pixi/react        | P0       | 2j         |
| Grille isometrique de base                 | P0       | 2j         |
| Game loop tick-based avec controle de vitesse | P0    | 1j         |
| Zustand store (structure initiale)         | P0       | 1j         |
| Top bar (credits, population, speed)       | P1       | 1j         |
| Tests unitaires du game loop               | P1       | 1j         |

**Livrable** : Canvas isometrique avec game loop fonctionnel, affichage des credits et controle de vitesse.

---

### Sprint 2 -- Economie et premiers modules (Semaines 3-4)

**Objectif** : Systeme economique et deux premiers modules jouables.

| Tache                                      | Priorite | Estimation |
|--------------------------------------------|----------|------------|
| Systeme economique complet                 | P0       | 2j         |
| Placement de batiments (drag & drop)       | P0       | 2j         |
| Module Traffic (buildings, metriques)      | P0       | 2j         |
| Module Energy (buildings, metriques)       | P0       | 2j         |
| Sidebar (module selector, building menu)   | P1       | 1j         |
| Tests des systemes Traffic et Energy       | P1       | 1j         |

**Livrable** : Joueur peut construire des batiments Traffic et Energy, voir ses revenus/depenses evoluer.

---

### Sprint 3 -- Modules restants et interactions (Semaines 5-6)

**Objectif** : Les 5 modules sont jouables avec des interactions entre eux.

| Tache                                      | Priorite | Estimation |
|--------------------------------------------|----------|------------|
| Module Security (buildings, metriques)     | P0       | 2j         |
| Module Waste (buildings, metriques)        | P0       | 2j         |
| Module Farm (buildings, metriques, sensors)| P0       | 2j         |
| Matrice d'interactions cross-module        | P0       | 2j         |
| Overlays par module sur la carte           | P1       | 1j         |
| Tests d'integration des interactions       | P1       | 1j         |

**Livrable** : Les 5 systemes fonctionnent et s'influencent mutuellement.

---

### Sprint 4 -- Progression et upgrades (Semaines 7-8)

**Objectif** : Systeme de niveaux, arbre d'upgrades et deblocages progressifs.

| Tache                                      | Priorite | Estimation |
|--------------------------------------------|----------|------------|
| Systeme de niveaux et XP                   | P0       | 2j         |
| Upgrade tree par module                    | P0       | 2j         |
| Deblocages par tier (buildings, upgrades)  | P0       | 1j         |
| Milestones et recompenses                  | P1       | 1j         |
| Systeme de prestige                        | P1       | 2j         |
| UI upgrade tree (arbre visuel)             | P1       | 1j         |
| Systeme de prets                           | P1       | 1j         |

**Livrable** : Progression complete du niveau 1 au 50 avec prestige.

---

### Sprint 5 -- Evenements et missions (Semaines 9-10)

**Objectif** : Le monde est vivant avec des evenements aleatoires et des missions narratives.

| Tache                                      | Priorite | Estimation |
|--------------------------------------------|----------|------------|
| Moteur d'evenements                        | P0       | 2j         |
| Weather, social, infrastructure events     | P0       | 2j         |
| Economic events et cross-module events     | P0       | 1j         |
| Story missions (tutoriel + 10 par module)  | P0       | 3j         |
| Daily challenges                           | P1       | 1j         |
| Notification bar (events, alerts, missions)| P1       | 1j         |

**Livrable** : Jeu dynamique avec evenements, missions et defis quotidiens.

---

### Sprint 6 -- Backend (Semaines 11-12)

**Objectif** : Persistance, authentification et classement en ligne.

| Tache                                      | Priorite | Estimation |
|--------------------------------------------|----------|------------|
| Setup Express + PostgreSQL + migrations    | P0       | 2j         |
| Auth (register, login, JWT)                | P0       | 2j         |
| CRUD game saves (JSONB)                    | P0       | 2j         |
| Leaderboard (API + Socket.io)              | P0       | 2j         |
| Achievements (definition + tracking)       | P1       | 1j         |
| Integration frontend <-> backend           | P0       | 1j         |

**Livrable** : Joueurs peuvent s'inscrire, sauvegarder et se comparer sur le leaderboard.

---

### Sprint 7 -- Polish (Semaine 13)

**Objectif** : Equilibrage, ameliorations visuelles et experience utilisateur.

| Tache                                      | Priorite | Estimation |
|--------------------------------------------|----------|------------|
| Balancing des couts, revenus, metriques    | P0       | 2j         |
| Animations et feedback visuel              | P1       | 1j         |
| Sons et musique d'ambiance                 | P2       | 1j         |
| Responsive design                          | P1       | 1j         |
| Modals (building details, upgrades, events)| P1       | 1j         |
| Performance profiling et optimisation      | P1       | 1j         |

**Livrable** : Jeu fluide, equilibre et agreable a utiliser.

---

### Sprint 8 -- Testing et deploiement (Semaine 14)

**Objectif** : Qualite, stabilite et mise en production.

| Tache                                      | Priorite | Estimation |
|--------------------------------------------|----------|------------|
| Tests end-to-end (gameplay complet)        | P0       | 2j         |
| Tests de charge backend                    | P1       | 1j         |
| Bug fixes prioritaires                     | P0       | 2j         |
| Documentation API                          | P1       | 1j         |
| Setup CI/CD                                | P1       | 1j         |
| Deploiement staging puis production        | P0       | 1j         |

**Livrable** : Jeu deploye, stable et pret pour les premiers joueurs.

---

## Annexes

### Formules de reference

```
# XP requis par niveau
requiredXP(level) = 100 * (1.2 ^ level)

# Cout d'upgrade
upgradeCost(baseCost, level) = baseCost * (1.15 ^ level)

# Maintenance par tick
maintenance(buildingCost) = buildingCost * 0.02

# Valeur capteur GreenFarm
sensorValue(base, variance) = base + (Math.random() * 2 - 1) * variance

# Condition blackout
isBlackout = energyDemand > energySupply * 1.1

# Condition famine
isFamine = foodProduction < populationNeeds * 0.6

# Condition gridlock
isGridlock = congestionIndex > 90

# Condition crime wave
isCrimeWave = citizenSafetyScore < 30

# Condition health crisis
isHealthCrisis = pollutionIndex > 80

# Condition bankruptcy
isBankrupt = balance < 0 for 10 consecutive ticks
```
