import { useGameStore } from "@/game/state/gameStore";
import { ModuleType, BuildingType } from "@/game/state/types";

interface TutorialStep {
  title: string;
  content: string;
  action?: "build";
  requiredBuilding?: BuildingType;
  requiredModule?: ModuleType;
  checkComplete?: () => boolean;
}

function useStepChecks() {
  const modules = useGameStore((s) => s.modules);
  return {
    hasTrafficBuilding: modules[ModuleType.TRAFFIC].buildings.length > 0,
    hasEnergyBuilding: modules[ModuleType.ENERGY].buildings.length > 0,
    hasSecurityBuilding: modules[ModuleType.SECURITY].buildings.length > 0,
    hasWasteBuilding: modules[ModuleType.WASTE].buildings.length > 0,
    hasFarmBuilding: modules[ModuleType.FARM].buildings.length > 0,
  };
}

const STEPS: TutorialStep[] = [
  {
    title: "Bienvenue, Maire !",
    content:
      "Vous venez d'etre nomme a la tete d'une ville intelligente.\n\n" +
      "Votre mission : construire et gerer 5 systemes vitaux pour faire prosperer votre cite. " +
      "Vous disposez de 10 000 credits pour demarrer.\n\n" +
      "Ce tutoriel va vous guider pour construire vos premiers batiments. " +
      "A la fin, votre ville sera operationnelle !",
  },
  {
    title: "1/5 -- Energie",
    content:
      "Commencons par l'essentiel : l'energie. Sans electricite, rien ne fonctionne.\n\n" +
      "Pour construire :\n" +
      "1. Cliquez sur le module 'E' (Energie) dans la barre laterale gauche\n" +
      "2. Ouvrez l'onglet 'Build' dans le panneau qui apparait\n" +
      "3. Selectionnez 'Solar Panel Array' (200c)\n" +
      "4. Cliquez sur une case de la carte pour le placer\n\n" +
      "L'energie alimente tous les autres modules -- c'est la priorite absolue.",
    action: "build",
    requiredBuilding: BuildingType.SOLAR_PANEL,
    requiredModule: ModuleType.ENERGY,
  },
  {
    title: "2/5 -- Trafic",
    content:
      "Votre ville a besoin d'infrastructures de transport.\n\n" +
      "Construisez une route :\n" +
      "1. Cliquez sur le module 'T' (Trafic) dans la barre laterale\n" +
      "2. Ouvrez l'onglet 'Build'\n" +
      "3. Selectionnez 'Road' (100c)\n" +
      "4. Placez-la sur la carte\n\n" +
      "Le trafic affecte les temps de reponse de la securite et la distribution des ressources.",
    action: "build",
    requiredBuilding: BuildingType.ROAD,
    requiredModule: ModuleType.TRAFFIC,
  },
  {
    title: "3/5 -- Securite",
    content:
      "Vos citoyens ont besoin de se sentir en securite.\n\n" +
      "Installez une camera de surveillance :\n" +
      "1. Cliquez sur le module 'S' (Securite)\n" +
      "2. Ouvrez l'onglet 'Build'\n" +
      "3. Selectionnez 'CCTV Camera' (150c)\n" +
      "4. Placez-la sur la carte\n\n" +
      "Une securite basse fait fuir la population et augmente la criminalite.",
    action: "build",
    requiredBuilding: BuildingType.CCTV_CAMERA,
    requiredModule: ModuleType.SECURITY,
  },
  {
    title: "4/5 -- Dechets",
    content:
      "Une ville propre est une ville saine.\n\n" +
      "Deployez un reseau de poubelles :\n" +
      "1. Cliquez sur le module 'W' (Waste)\n" +
      "2. Ouvrez l'onglet 'Build'\n" +
      "3. Selectionnez 'Trash Bin Network' (100c)\n" +
      "4. Placez-le sur la carte\n\n" +
      "Les dechets mal geres causent de la pollution et des crises sanitaires.",
    action: "build",
    requiredBuilding: BuildingType.TRASH_BIN_NETWORK,
    requiredModule: ModuleType.WASTE,
  },
  {
    title: "5/5 -- GreenFarm",
    content:
      "Nourrissez votre population avec de l'agriculture urbaine.\n\n" +
      "Creez un jardin communautaire :\n" +
      "1. Cliquez sur le module 'F' (Farm)\n" +
      "2. Ouvrez l'onglet 'Build'\n" +
      "3. Selectionnez 'Community Garden' (200c)\n" +
      "4. Placez-le sur la carte\n\n" +
      "La ferme fournit de la nourriture et reduit la criminalite via la securite alimentaire.",
    action: "build",
    requiredBuilding: BuildingType.COMMUNITY_GARDEN,
    requiredModule: ModuleType.FARM,
  },
  {
    title: "Votre ville est prete !",
    content:
      "Vous avez construit les bases de votre ville intelligente :\n\n" +
      "- Energie : panneaux solaires\n" +
      "- Trafic : route\n" +
      "- Securite : camera de surveillance\n" +
      "- Dechets : reseau de poubelles\n" +
      "- GreenFarm : jardin communautaire\n\n" +
      "A partir de maintenant, la simulation tourne. Gerez votre budget, " +
      "construisez de nouveaux batiments, ameliorez-les et repondez aux evenements.\n\n" +
      "Les modules sont interconnectes : l'energie alimente tout, les dechets " +
      "impactent la sante, le trafic affecte la securite. Pensez global !",
  },
];

export default function Tutorial() {
  const step = useGameStore((s) => s.tutorial.step);
  const nextStep = useGameStore((s) => s.nextTutorialStep);
  const complete = useGameStore((s) => s.completeTutorial);
  const checks = useStepChecks();

  const currentStep = STEPS[step];
  if (!currentStep) return null;

  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  // Check if the current build step is done
  let buildDone = false;
  if (currentStep.action === "build") {
    if (step === 1) buildDone = checks.hasEnergyBuilding;
    if (step === 2) buildDone = checks.hasTrafficBuilding;
    if (step === 3) buildDone = checks.hasSecurityBuilding;
    if (step === 4) buildDone = checks.hasWasteBuilding;
    if (step === 5) buildDone = checks.hasFarmBuilding;
  }

  const needsBuild = currentStep.action === "build" && !buildDone;

  return (
    <div className={`fixed z-50 ${needsBuild ? "bottom-4 right-4" : "inset-0 flex items-center justify-center bg-black/70"}`}>
      <div className={`bg-gray-800 border rounded-lg shadow-2xl ${needsBuild ? "border-blue-500 max-w-sm" : "border-gray-600 max-w-lg w-full mx-4"}`}>
        {/* Progress bar */}
        <div className="h-1 bg-gray-700 rounded-t-lg overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-1">
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-white ${needsBuild ? "text-base" : "text-xl"}`}>{currentStep.title}</h2>
            <span className="text-xs text-gray-400">
              {step + 1} / {STEPS.length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-2">
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {currentStep.content}
          </div>
        </div>

        {/* Build status */}
        {currentStep.action === "build" && (
          <div className={`mx-5 my-2 px-3 py-2 rounded text-sm ${buildDone ? "bg-green-900/50 text-green-300 border border-green-700" : "bg-yellow-900/30 text-yellow-300 border border-yellow-700"}`}>
            {buildDone
              ? "Batiment construit ! Cliquez 'Suivant' pour continuer."
              : "Construisez le batiment pour continuer..."}
          </div>
        )}

        {/* Actions */}
        <div className="px-5 py-3 flex items-center justify-between border-t border-gray-700">
          <button
            onClick={complete}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Passer le tutoriel
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={() => useGameStore.setState((s) => ({
                  tutorial: { ...s.tutorial, step: s.tutorial.step - 1 },
                }))}
                className="px-3 py-1.5 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                Precedent
              </button>
            )}
            {!needsBuild && (
              <button
                onClick={isLast ? complete : nextStep}
                className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors font-medium"
              >
                {isLast ? "Lancer la simulation !" : "Suivant"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
