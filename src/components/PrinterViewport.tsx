import { useEffect, useRef, useState } from 'react';
import { PRINTER_COMPONENTS, PrinterComponentId } from '../data/printerData';
import { PrinterSceneController } from '../three/PrinterSceneController';

interface PrinterViewportProps {
  isDoorOpen: boolean;
  selectedComponent: PrinterComponentId | null;
  highlightedStepComponent: PrinterComponentId | null;
  resetTrigger: number;
  animationCommand: {
    type: 'play' | 'pause' | 'resume' | 'stop' | 'scrub';
    progress?: number;
    seq: number;
  };
  onSelectComponent: (id: PrinterComponentId) => void;
  onToggleDoor: () => void;
  onAnimationProgress: (progress: number, finished: boolean) => void;
}

export function PrinterViewport({
  isDoorOpen,
  selectedComponent,
  highlightedStepComponent,
  resetTrigger,
  animationCommand,
  onSelectComponent,
  onToggleDoor,
  onAnimationProgress,
}: PrinterViewportProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<PrinterSceneController | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<
    PrinterComponentId | 'door' | null
  >(null);
  const [contextLost, setContextLost] = useState(false);

  // Store latest callbacks in refs so React state changes never rebuild the WebGL scene
  const callbacksRef = useRef({
    onSelectComponent,
    onToggleDoor,
    onAnimationProgress,
  });
  callbacksRef.current = {
    onSelectComponent,
    onToggleDoor,
    onAnimationProgress,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const controller = new PrinterSceneController(container, {
      onSelectComponent: (id) => callbacksRef.current.onSelectComponent(id),
      onToggleDoor: () => callbacksRef.current.onToggleDoor(),
      onHoverComponent: (target) => setHoveredTarget(target),
      onAnimationProgress: (progress, finished) =>
        callbacksRef.current.onAnimationProgress(progress, finished),
      onContextLost: () => setContextLost(true),
    });

    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setDoorOpen(isDoorOpen, true);
  }, [isDoorOpen]);

  useEffect(() => {
    controllerRef.current?.selectComponent(selectedComponent, true);
  }, [selectedComponent]);

  useEffect(() => {
    controllerRef.current?.setStepHighlightComponent(highlightedStepComponent);
  }, [highlightedStepComponent]);

  useEffect(() => {
    if (resetTrigger > 0) {
      controllerRef.current?.resetCamera();
    }
  }, [resetTrigger]);

  useEffect(() => {
    const ctrl = controllerRef.current;
    if (!ctrl || animationCommand.seq === 0) return;

    if (animationCommand.type === 'play') {
      ctrl.startPaperAnimation();
    } else if (animationCommand.type === 'pause') {
      ctrl.setPaperPaused(true);
    } else if (animationCommand.type === 'resume') {
      ctrl.setPaperPaused(false);
    } else if (animationCommand.type === 'stop') {
      ctrl.stopPaperAnimation();
    } else if (
      animationCommand.type === 'scrub' &&
      typeof animationCommand.progress === 'number'
    ) {
      ctrl.setPaperProgressManual(animationCommand.progress);
    }
  }, [animationCommand]);

  const hoveredLabel =
    hoveredTarget === 'door'
      ? isDoorOpen
        ? 'Vordere Klappe (Klicken zum Schließen)'
        : 'Vordere Klappe (Klicken zum Öffnen)'
      : hoveredTarget
        ? (() => {
            const comp = PRINTER_COMPONENTS.find((c) => c.id === hoveredTarget);
            return comp ? `${comp.englishTerm} · ${comp.germanTerm}` : null;
          })()
        : null;

  return (
    <div className="relative w-full h-full select-none">
      {/* Stable WebGL Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full"
        aria-label="Interaktiver 3D-Laserdrucker"
      />

      {/* Subtle Hover Hint just below progress dashboard */}
      {hoveredLabel && (
        <div className="pointer-events-none fixed top-36 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium shadow-lg whitespace-nowrap">
          {hoveredLabel}
        </div>
      )}

      {/* Subtle Orbit Hint at Top Left below progress dashboard */}
      {!hoveredLabel && (
        <div className="pointer-events-none fixed top-36 left-5 z-10 hidden sm:block text-xs text-slate-600 bg-white/90 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
          Ziehen zum Drehen · Scrollen zum Zoomen · Bauteile direkt anklicken
        </div>
      )}

      {contextLost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 p-6">
          <div className="max-w-md rounded-xl bg-white border border-slate-200 p-6 shadow-lg text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              3D-Ansicht unterbrochen
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Die Grafikverbindung wurde kurzzeitig getrennt. Bitte lade die Seite neu,
              um das 3D-Druckermodell wiederherzustellen.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors cursor-pointer"
            >
              Ansicht neu laden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
