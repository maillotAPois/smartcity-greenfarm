import type { GameState, GameEvent } from "@/game/state/types";
import { EVENT_TEMPLATES } from "@/game/data/events";

let eventCounter = 0;

function generateEventId(): string {
  eventCounter += 1;
  return `evt_${Date.now()}_${eventCounter}`;
}

export function checkForEvents(state: GameState, tick: number): GameEvent[] {
  const newEvents: GameEvent[] = [];

  // Only check every 12 ticks (half a day in-game) to avoid event spam
  if (tick % 12 !== 0) return newEvents;

  for (const template of EVENT_TEMPLATES) {
    // Skip if an event of this type is already active
    const alreadyActive = state.activeEvents.some((e) => e.type === template.type);
    if (alreadyActive) continue;

    // Probability check
    if (Math.random() > template.probability) continue;

    // Create event from template
    const event: GameEvent = {
      id: generateEventId(),
      type: template.type,
      title: template.title,
      description: template.description,
      severity: template.severity,
      affectedModules: template.affectedModules,
      choices: template.choices,
      duration: template.duration,
      tick,
    };

    newEvents.push(event);

    // Limit to 1 new event per check cycle
    break;
  }

  return newEvents;
}

export function resolveEvent(
  state: GameState,
  eventId: string,
  choiceId: string,
): Partial<GameState> {
  const event = state.activeEvents.find((e) => e.id === eventId);
  if (!event) return {};

  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return {};

  const updates: Partial<GameState> = {};
  const effect = choice.effect;

  // Apply credit effects
  if (effect["credits"] !== undefined) {
    updates.economy = {
      ...state.economy,
      credits: state.economy.credits + effect["credits"],
    };
  }

  // Apply satisfaction effects
  if (effect["satisfaction"] !== undefined) {
    updates.satisfactionScore = Math.max(
      0,
      Math.min(100, state.satisfactionScore + effect["satisfaction"]),
    );
  }

  // Apply population effects
  if (effect["population"] !== undefined) {
    updates.population = Math.max(0, state.population + effect["population"]);
  }

  // Remove the resolved event
  updates.activeEvents = state.activeEvents.filter((e) => e.id !== eventId);

  // Add notification about the resolution
  updates.notifications = [
    ...state.notifications,
    {
      id: `resolve_${eventId}`,
      message: `Event "${event.title}" resolved: ${choice.label}`,
      type: "info",
      tick: state.tick,
      read: false,
    },
  ];

  return updates;
}
