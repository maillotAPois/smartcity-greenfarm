import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { BuildingType, ModuleType, type Building, type CropPlot, type AnimalPen } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  gridToIso,
  isoToGrid,
  getColorForBuilding,
  getTileColor,
  getHighlightColor,
} from "./MapRenderer";
import { getCropProgress } from "@/game/systems/CropSystem";

interface CityMapProps {
  gridSize?: number;
}

const SPRITE_PATHS: Record<string, string> = {
  chicken: "/sprites/Chicken.png",
  cow: "/sprites/Cow.png",
  wheat_ready: "/sprites/Wheat.png",
  field_empty: "/sprites/Crop.png",
};

export default function CityMap({ gridSize = 20 }: CityMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spritesRef = useRef<Record<string, HTMLImageElement>>({});
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef(0);
  const modules = useGameStore((s) => s.modules);
  const farmState = useGameStore((s) => s.farmState);
  const tick = useGameStore((s) => s.tick);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const selectedModule = useGameStore((s) => s.selectedModule);

  // Load sprites
  useEffect(() => {
    let loaded = 0;
    const total = Object.keys(SPRITE_PATHS).length;
    for (const [key, path] of Object.entries(SPRITE_PATHS)) {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        spritesRef.current[key] = img;
        loaded++;
        if (loaded >= total) setSpritesLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded >= total) setSpritesLoaded(true);
      };
    }
  }, []);

  const allBuildings = useMemo(() => {
    const map = new Map<string, Building>();
    for (const moduleType of Object.values(ModuleType)) {
      for (const b of modules[moduleType].buildings) {
        map.set(`${b.position.x},${b.position.y}`, b);
      }
    }
    return map;
  }, [modules]);

  const plotMap = useMemo(() => {
    const map = new Map<string, CropPlot>();
    for (const p of farmState.plots) {
      const building = modules[ModuleType.FARM].buildings.find((b) => b.id === p.buildingId);
      if (building) map.set(`${building.position.x},${building.position.y}`, p);
    }
    return map;
  }, [farmState.plots, modules]);

  const penMap = useMemo(() => {
    const map = new Map<string, AnimalPen>();
    for (const p of farmState.animalPens) {
      const building = modules[ModuleType.FARM].buildings.find((b) => b.id === p.buildingId);
      if (building) map.set(`${building.position.x},${building.position.y}`, p);
    }
    return map;
  }, [farmState.animalPens, modules]);

  const offsetX = gridSize * (TILE_WIDTH / 2) + 40;
  const offsetY = 40;
  const canvasWidth = gridSize * TILE_WIDTH + 80;
  const canvasHeight = gridSize * TILE_HEIGHT + 80;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const time = Date.now() / 1000;

    for (let gx = 0; gx < gridSize; gx++) {
      for (let gy = 0; gy < gridSize; gy++) {
        const { screenX, screenY } = gridToIso(gx, gy);
        const px = screenX + offsetX;
        const py = screenY + offsetY;

        const isHovered = hovered?.x === gx && hovered?.y === gy;
        const building = allBuildings.get(`${gx},${gy}`);
        const key = `${gx},${gy}`;

        // Draw diamond tile
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + TILE_WIDTH / 2, py + TILE_HEIGHT / 2);
        ctx.lineTo(px, py + TILE_HEIGHT);
        ctx.lineTo(px - TILE_WIDTH / 2, py + TILE_HEIGHT / 2);
        ctx.closePath();

        if (building) {
          const color = getColorForBuilding(building.type);
          ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
        } else if (isHovered) {
          const hl = getHighlightColor();
          ctx.fillStyle = `#${hl.toString(16).padStart(6, "0")}`;
        } else {
          const tc = getTileColor();
          ctx.fillStyle = `#${tc.toString(16).padStart(6, "0")}`;
        }
        ctx.fill();
        ctx.strokeStyle = "#5d8a31";
        ctx.lineWidth = 1;
        ctx.stroke();

        if (building) {
          const plot = plotMap.get(key);
          const pen = penMap.get(key);
          const sprites = spritesRef.current;

          // FIELD with crop sprites
          if (building.type === BuildingType.FIELD && plot) {
            if (plot.stage === "empty" && sprites.field_empty) {
              ctx.drawImage(sprites.field_empty, px - 16, py + TILE_HEIGHT / 2 - 20, 32, 32);
            } else if (plot.stage === "growing") {
              if (sprites.field_empty) {
                ctx.drawImage(sprites.field_empty, px - 16, py + TILE_HEIGHT / 2 - 20, 32, 32);
              }
              // Progress bar
              const progress = getCropProgress(plot, tick);
              ctx.fillStyle = "#333";
              ctx.fillRect(px - 14, py + TILE_HEIGHT / 2 + 10, 28, 4);
              ctx.fillStyle = "#f59e0b";
              ctx.fillRect(px - 14, py + TILE_HEIGHT / 2 + 10, 28 * progress, 4);
            } else if (plot.stage === "ready") {
              if (plot.cropType === "wheat" && sprites.wheat_ready) {
                ctx.drawImage(sprites.wheat_ready, px - 18, py + TILE_HEIGHT / 2 - 26, 36, 36);
              } else if (sprites.field_empty) {
                ctx.drawImage(sprites.field_empty, px - 16, py + TILE_HEIGHT / 2 - 20, 32, 32);
                // Green overlay for ready non-wheat
                ctx.fillStyle = "rgba(34, 197, 94, 0.4)";
                ctx.fillRect(px - 14, py + TILE_HEIGHT / 2 - 18, 28, 28);
              }
              // Pulsating "!" indicator
              const pulse = 0.6 + 0.4 * Math.sin(time * 4);
              ctx.globalAlpha = pulse;
              ctx.fillStyle = "#22c55e";
              ctx.font = "bold 14px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("!", px, py + 4);
              ctx.globalAlpha = 1;
            }
          }

          // Animal sprites with wandering
          else if (pen) {
            const spriteKey = pen.animalType === "chicken" ? "chicken" : pen.animalType === "cow" ? "cow" : null;
            if (spriteKey && sprites[spriteKey]) {
              const wanderX = Math.sin(time * 0.5 + gx * 3) * 6;
              const wanderY = Math.cos(time * 0.7 + gy * 2) * 3;
              const flip = Math.sin(time * 0.3 + gx) > 0;
              const spriteSize = spriteKey === "cow" ? 34 : 28;

              ctx.save();
              if (flip) {
                ctx.translate(px + wanderX, py + TILE_HEIGHT / 2 - spriteSize / 2 + wanderY);
                ctx.scale(-1, 1);
                ctx.drawImage(sprites[spriteKey], -spriteSize / 2, 0, spriteSize, spriteSize);
              } else {
                ctx.drawImage(
                  sprites[spriteKey],
                  px - spriteSize / 2 + wanderX,
                  py + TILE_HEIGHT / 2 - spriteSize / 2 + wanderY,
                  spriteSize,
                  spriteSize,
                );
              }
              ctx.restore();

              // Ready to collect indicator
              if (pen.readyToCollect) {
                const pulse = 0.6 + 0.4 * Math.sin(time * 5);
                ctx.globalAlpha = pulse;
                ctx.fillStyle = "#fbbf24";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("!", px + wanderX, py + TILE_HEIGHT / 2 - spriteSize / 2 - 2 + wanderY);
                ctx.globalAlpha = 1;
              }
            } else {
              // Bee hive: simple hex icon
              ctx.fillStyle = "#daa520";
              ctx.font = "18px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("B", px, py + TILE_HEIGHT / 2 + 6);
              if (pen.readyToCollect) {
                const pulse = 0.6 + 0.4 * Math.sin(time * 5);
                ctx.globalAlpha = pulse;
                ctx.fillStyle = "#fbbf24";
                ctx.font = "bold 12px sans-serif";
                ctx.fillText("!", px, py + 2);
                ctx.globalAlpha = 1;
              }
            }
          }

          // Processing buildings: colored rect with progress
          else if (
            building.type === BuildingType.MILL ||
            building.type === BuildingType.BAKERY ||
            building.type === BuildingType.DAIRY
          ) {
            const label = building.type === BuildingType.MILL ? "M" : building.type === BuildingType.BAKERY ? "Bk" : "D";
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(label, px, py + TILE_HEIGHT / 2 + 4);
          }

          // Default: show level
          else {
            ctx.fillStyle = "#ffffff";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`L${building.level}`, px, py + TILE_HEIGHT / 2 + 4);
          }
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [gridSize, allBuildings, plotMap, penMap, hovered, canvasWidth, canvasHeight, offsetX, offsetY, tick, spritesLoaded]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - offsetX;
      const my = e.clientY - rect.top - offsetY;
      const { x, y } = isoToGrid(mx, my);
      if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        setHovered({ x, y });
      } else {
        setHovered(null);
      }
    },
    [gridSize, offsetX, offsetY],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - offsetX;
      const my = e.clientY - rect.top - offsetY;
      const { x, y } = isoToGrid(mx, my);
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;

      const existing = allBuildings.get(`${x},${y}`);
      if (existing) {
        // For farm buildings, dispatch a farm dialog event
        if (
          existing.type === BuildingType.FIELD ||
          existing.type === BuildingType.CHICKEN_COOP ||
          existing.type === BuildingType.COW_PASTURE ||
          existing.type === BuildingType.BEE_HIVE ||
          existing.type === BuildingType.MILL ||
          existing.type === BuildingType.BAKERY ||
          existing.type === BuildingType.DAIRY
        ) {
          const detail = { buildingId: existing.id, buildingType: existing.type };
          canvas.dispatchEvent(new CustomEvent("farmclick", { detail, bubbles: true }));
          return;
        }
        selectBuilding(existing.id);
        return;
      }

      const detail = { gridX: x, gridY: y, module: selectedModule };
      canvas.dispatchEvent(new CustomEvent("gridclick", { detail, bubbles: true }));
    },
    [gridSize, allBuildings, selectBuilding, selectedModule, offsetX, offsetY],
  );

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="block mx-auto cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(null)}
      onClick={handleClick}
    />
  );
}
