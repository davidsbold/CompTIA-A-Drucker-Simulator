import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  LASER_STEPS,
  LaserStepInfo,
  PrinterComponentId,
} from '../data/printerData';

interface StepsGameModeProps {
  animationProgress: number;
  isAnimationPlaying: boolean;
  animationFinished: boolean;
  onStartAnimation: () => void;
  onPauseAnimation: () => void;
  onResumeAnimation: () => void;
  onScrubAnimation: (progress: number, stepComponent: PrinterComponentId | null) => void;
  onStopAnimation: () => void;
  onProgressChange?: (correctCount: number, completed: boolean) => void;
  initialSolved?: boolean;
}

function shuffleSteps(items: LaserStepInfo[]): LaserStepInfo[] {
  const arr = [...items];
  // Deterministic-feeling Fisher-Yates avoiding already-solved order
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const alreadySolved = arr.every((s, idx) => s.order === idx + 1);
  if (alreadySolved && arr.length > 1) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

export function StepsGameMode({
  animationProgress,
  isAnimationPlaying,
  animationFinished,
  onStartAnimation,
  onPauseAnimation,
  onResumeAnimation,
  onScrubAnimation,
  onStopAnimation,
  onProgressChange,
  initialSolved = false,
}: StepsGameModeProps) {
  const [orderedSteps, setOrderedSteps] = useState<LaserStepInfo[]>(() =>
    initialSolved ? [...LASER_STEPS] : shuffleSteps(LASER_STEPS)
  );
  const [checked, setChecked] = useState(initialSolved);
  const [solved, setSolved] = useState(initialSolved);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const correctCount = useMemo(
    () => orderedSteps.filter((s, idx) => s.order === idx + 1).length,
    [orderedSteps]
  );

  const activeStep = useMemo(() => {
    return (
      LASER_STEPS.find(
        (s) =>
          animationProgress >= s.progressStart &&
          animationProgress <= s.progressEnd
      ) ?? LASER_STEPS[LASER_STEPS.length - 1]
    );
  }, [animationProgress]);

  const moveStep = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= orderedSteps.length) return;
    const next = [...orderedSteps];
    [next[index], next[target]] = [next[target], next[index]];
    setOrderedSteps(next);
    setChecked(false);
  };

  const handleDropOn = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...orderedSteps];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setOrderedSteps(next);
    setDragIndex(null);
    setChecked(false);
  };

  const handleCheckOrder = () => {
    setChecked(true);
    const rightNow = orderedSteps.filter((s, idx) => s.order === idx + 1).length;
    const allCorrect = rightNow === orderedSteps.length;
    onProgressChange?.(rightNow, allCorrect);
    if (allCorrect) {
      setSolved(true);
      onStartAnimation();
    }
  };

  const handleResetGame = () => {
    onStopAnimation();
    setOrderedSteps(shuffleSteps(LASER_STEPS));
    setChecked(false);
    setSolved(false);
    onProgressChange?.(0, false);
  };

  const handleSolveDemo = () => {
    setOrderedSteps([...LASER_STEPS]);
    setChecked(true);
    setSolved(true);
    onProgressChange?.(7, true);
    onStartAnimation();
  };

  // Solved & Animating View: sleek bottom dock showing live step progress
  if (solved) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex flex-col items-center px-4">
        <div className="pointer-events-auto w-full max-w-4xl flex flex-col items-center">
          <button
            type="button"
            onClick={() => setDockCollapsed((v) => !v)}
            className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 shadow-sm cursor-pointer"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Animation einblenden</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Steuerung ausblenden</span>
              </>
            )}
          </button>

          {!dockCollapsed && (
            <div className="w-full rounded-xl bg-white/95 border border-slate-200 shadow-xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Alle 7 Schritte richtig sortiert!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {animationFinished
                        ? 'Druckvorgang abgeschlossen · Das Blatt liegt fixiert im Ausgabefach.'
                        : 'Beobachte im 3D-Drucker, wie das Blatt durch die einzelnen Stationen läuft.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAnimationPlaying && !animationFinished ? (
                    <button
                      type="button"
                      onClick={onPauseAnimation}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={
                        animationFinished ? onStartAnimation : onResumeAnimation
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 text-white text-xs sm:text-sm font-semibold hover:bg-sky-700 transition-colors cursor-pointer"
                    >
                      {animationFinished ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span>
                        {animationFinished ? 'Erneut abspielen' : 'Weiter'}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetGame}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Neu sortieren</span>
                  </button>
                </div>
              </div>

              {/* 7-Step Interactive Scrub Timeline */}
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {LASER_STEPS.map((step) => {
                  const isCurrent = activeStep.order === step.order;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() =>
                        onScrubAnimation(
                          (step.progressStart + step.progressEnd) / 2,
                          step.componentId
                        )
                      }
                      className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-sky-600 border-sky-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-mono-tabular text-xs font-semibold opacity-80">
                        0{step.order}
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5">
                        {step.englishName}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Current Active Step Callout */}
              <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono-tabular text-xs font-semibold text-sky-700">
                    Schritt {activeStep.order} von 7 · Eselsbrücke: „
                    {activeStep.mnemonicWord}“
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {activeStep.englishName} ({activeStep.germanName})
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                    {activeStep.simpleExplanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Sorting Game View
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex flex-col items-center px-4">
      <div className="pointer-events-auto w-full max-w-4xl flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 shadow-sm cursor-pointer"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Sortierspiel einblenden</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>3D-Drucker frei betrachten</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="w-full rounded-xl bg-white/95 border border-slate-200 shadow-xl p-4 sm:p-5 max-h-[68vh] flex flex-col">
            {/* Header & Mnemonic */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Die 7 Laserdruck-Schritte in die richtige Reihenfolge bringen
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Eselsbrücke:{' '}
                    <strong className="text-slate-900">
                      „People Can&apos;t Eat Donuts That Look Crazy“
                    </strong>{' '}
                    (Processing · Charging · Exposing · Developing · Transferring ·
                    Fusing · Cleaning)
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetGame}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Neu mischen</span>
                </button>
                <button
                  type="button"
                  onClick={handleSolveDemo}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                >
                  Animation direkt zeigen
                </button>
              </div>
            </div>

            {/* Sortable List */}
            <div className="my-3 overflow-y-auto custom-scroll space-y-1.5 pr-1">
              {orderedSteps.map((step, idx) => {
                const isRightSlot = checked && step.order === idx + 1;
                const isWrongSlot = checked && step.order !== idx + 1;

                return (
                  <div
                    key={step.id}
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOn(idx)}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 transition-colors ${
                      isRightSlot
                        ? 'bg-emerald-50 border-emerald-300'
                        : isWrongSlot
                          ? 'bg-amber-50 border-amber-300'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono-tabular w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-800 shrink-0">
                        {idx + 1}.
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {step.englishName}
                          </span>
                          <span className="text-xs font-medium text-slate-600">
                            ({step.germanName})
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate">
                          {step.simpleExplanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isRightSlot && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Richtig</span>
                        </span>
                      )}
                      {isWrongSlot && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Umsetzen</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveStep(idx, -1)}
                          aria-label={`${step.englishName} nach oben schieben`}
                          className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === orderedSteps.length - 1}
                          onClick={() => moveStep(idx, 1)}
                          aria-label={`${step.englishName} nach unten schieben`}
                          className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Action */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-slate-600">
                {checked
                  ? `${correctCount} von 7 Schritten stehen schon an der richtigen Stelle.`
                  : 'Nutze die Pfeile oder ziehe die Zeilen in die Reihenfolge 1 bis 7.'}
              </div>

              <button
                type="button"
                onClick={handleCheckOrder}
                className="px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors cursor-pointer"
              >
                Reihenfolge prüfen & 3D-Druck starten
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
