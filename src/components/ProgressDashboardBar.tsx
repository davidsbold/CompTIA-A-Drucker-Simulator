import { CheckCircle2, ChevronUp, Trophy } from 'lucide-react';
import { AppMode } from './TopBar';

interface ProgressDashboardBarProps {
  activeMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  discoveredCount: number;
  totalComponents: number;
  stepsCompleted: boolean;
  stepsCorrectCount: number;
  helpdeskSolvedCount: number;
  helpdeskTotalCount: number;
  examCorrectCount: number;
  examAnsweredCount: number;
  examTotalCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function ProgressDashboardBar({
  activeMode,
  onChangeMode,
  discoveredCount,
  totalComponents,
  stepsCompleted,
  stepsCorrectCount,
  helpdeskSolvedCount,
  helpdeskTotalCount,
  examCorrectCount,
  examAnsweredCount,
  examTotalCount,
  collapsed,
  onToggleCollapse,
}: ProgressDashboardBarProps) {
  const discoverPct = Math.round((discoveredCount / totalComponents) * 100);
  const stepsPct = stepsCompleted
    ? 100
    : Math.round((stepsCorrectCount / 7) * 100);
  const helpdeskPct = Math.round(
    (helpdeskSolvedCount / helpdeskTotalCount) * 100
  );
  const examPct = Math.round((examAnsweredCount / examTotalCount) * 100);

  if (collapsed) {
    return (
      <div className="fixed top-18 right-5 z-20">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-mono-tabular">
            Fortschritt: {discoveredCount}/{totalComponents} Bauteile ·{' '}
            {stepsCompleted ? '7 Schritte OK' : `${stepsCorrectCount}/7 Schritte`} ·{' '}
            {helpdeskSolvedCount}/{helpdeskTotalCount} Tickets
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-16 inset-x-0 z-20 bg-white/95 border-b border-slate-200 px-4 lg:px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 min-w-0">
          {/* 1. 3D Bauteile */}
          <button
            type="button"
            onClick={() => onChangeMode('discover')}
            className={`text-left rounded-lg border px-3 py-1.5 transition-colors cursor-pointer ${
              activeMode === 'discover'
                ? 'border-sky-300 bg-sky-50/70'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700 truncate">
                3D-Bauteile
              </span>
              <span className="font-mono-tabular font-semibold text-slate-900 inline-flex items-center gap-1 shrink-0">
                {discoveredCount === totalComponents && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {discoveredCount}/{totalComponents}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  discoveredCount === totalComponents
                    ? 'bg-emerald-600'
                    : 'bg-sky-600'
                }`}
                style={{ width: `${discoverPct}%` }}
              />
            </div>
          </button>

          {/* 2. 7-Schritte-Lernphase */}
          <button
            type="button"
            onClick={() => onChangeMode('steps')}
            className={`text-left rounded-lg border px-3 py-1.5 transition-colors cursor-pointer ${
              activeMode === 'steps'
                ? 'border-sky-300 bg-sky-50/70'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700 truncate">
                7-Schritte-Phase
              </span>
              <span className="font-mono-tabular font-semibold text-slate-900 inline-flex items-center gap-1 shrink-0">
                {stepsCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {stepsCompleted ? 'Abgeschlossen' : `${stepsCorrectCount}/7`}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  stepsCompleted ? 'bg-emerald-600' : 'bg-sky-600'
                }`}
                style={{ width: `${stepsPct}%` }}
              />
            </div>
          </button>

          {/* 3. Helpdesk-Tickets */}
          <button
            type="button"
            onClick={() => onChangeMode('helpdesk')}
            className={`text-left rounded-lg border px-3 py-1.5 transition-colors cursor-pointer ${
              activeMode === 'helpdesk'
                ? 'border-sky-300 bg-sky-50/70'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700 truncate">
                Helpdesk-Tickets
              </span>
              <span className="font-mono-tabular font-semibold text-slate-900 inline-flex items-center gap-1 shrink-0">
                {helpdeskSolvedCount === helpdeskTotalCount && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {helpdeskSolvedCount}/{helpdeskTotalCount} gelöst
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  helpdeskSolvedCount === helpdeskTotalCount
                    ? 'bg-emerald-600'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${helpdeskPct}%` }}
              />
            </div>
          </button>

          {/* 4. Prüfungs-Quiz (36) */}
          <button
            type="button"
            onClick={() => onChangeMode('exam')}
            className={`text-left rounded-lg border px-3 py-1.5 transition-colors cursor-pointer ${
              activeMode === 'exam'
                ? 'border-sky-300 bg-sky-50/70'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700 truncate">
                Prüfungssimulator
              </span>
              <span className="font-mono-tabular font-semibold text-slate-900 inline-flex items-center gap-1 shrink-0">
                {examAnsweredCount}/{examTotalCount} ({examCorrectCount} richtig)
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${examPct}%` }}
              />
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          title="Fortschrittsleiste minimieren"
          aria-label="Fortschrittsleiste minimieren"
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
