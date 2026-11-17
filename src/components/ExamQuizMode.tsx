import {
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { EXAM_QUESTIONS } from '../data/examAndGlossaryData';
import { PrinterComponentId } from '../data/printerData';

interface ExamQuizModeProps {
  currentIndex: number;
  userAnswers: Record<number, string[]>;
  checkedMap: Record<number, boolean>;
  onSelectOption: (questionIdx: number, optionId: string, multi: boolean) => void;
  onCheckQuestion: (questionIdx: number) => void;
  onChangeQuestion: (index: number) => void;
  onResetExam: () => void;
  onFocus3DComponent: (id: PrinterComponentId) => void;
}

export function ExamQuizMode({
  currentIndex,
  userAnswers,
  checkedMap,
  onSelectOption,
  onCheckQuestion,
  onChangeQuestion,
  onResetExam,
  onFocus3DComponent,
}: ExamQuizModeProps) {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const q = EXAM_QUESTIONS[currentIndex];
  const selected = userAnswers[currentIndex] ?? [];
  const isChecked = Boolean(checkedMap[currentIndex]);

  const correctIds = useMemo(
    () => q.options.filter((o) => o.correct).map((o) => o.id),
    [q]
  );

  const isCurrentCorrect =
    isChecked &&
    selected.length === correctIds.length &&
    selected.every((id) => correctIds.includes(id));

  const stats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    EXAM_QUESTIONS.forEach((item, idx) => {
      if (checkedMap[idx]) {
        answered++;
        const sel = userAnswers[idx] ?? [];
        const corr = item.options.filter((o) => o.correct).map((o) => o.id);
        if (
          sel.length === corr.length &&
          sel.every((id) => corr.includes(id))
        ) {
          correct++;
        }
      }
    });
    return {
      answered,
      correct,
      percent: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    };
  }, [checkedMap, userAnswers]);

  if (showOverview) {
    const finalPct = Math.round((stats.correct / EXAM_QUESTIONS.length) * 100);
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex flex-col items-center px-4">
        <div className="pointer-events-auto w-full max-w-3xl rounded-xl bg-white/95 border border-slate-200 shadow-xl p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            CompTIA A+ Prüfungssimulation – Auswertung
          </h2>
          <p className="mt-2 text-3xl font-bold font-mono-tabular text-sky-700">
            {finalPct}% ({stats.correct} von {EXAM_QUESTIONS.length} richtig)
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {finalPct >= 80
              ? 'Starkes Ergebnis! Du beherrschst die prüfungsrelevanten Druckerkonzepte sehr sicher.'
              : 'Guter Fortschritt! Nutze das Glossar und die 3D-Bauteile, um offene Themen gezielt zu festigen.'}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowOverview(false)}
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Fragen weiter ansehen
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOverview(false);
                onResetExam();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Simulator neu starten</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <span>Prüfungsfrage einblenden</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>3D-Drucker frei betrachten</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="w-full rounded-xl bg-white/95 border border-slate-200 shadow-xl p-5 max-h-[68vh] flex flex-col">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                <span className="font-mono-tabular font-bold text-slate-900">
                  Frage {currentIndex + 1} von {EXAM_QUESTIONS.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">Original-Nr. #{q.id}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-sky-700">{q.topic}</span>
                {q.multi && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-amber-700">
                      Mehrfachauswahl (2 wählen)
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                {q.relatedComponent && (
                  <button
                    type="button"
                    onClick={() => onFocus3DComponent(q.relatedComponent!)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Im 3D-Drucker zeigen</span>
                  </button>
                )}

                <span className="font-mono-tabular text-xs font-semibold text-emerald-700">
                  Trefferquote: {stats.percent}%
                </span>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="my-3 overflow-y-auto custom-scroll pr-1 space-y-3">
              <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSel = selected.includes(opt.id);
                  const showRight = isChecked && opt.correct;
                  const showWrong = isChecked && isSel && !opt.correct;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isChecked}
                      onClick={() => onSelectOption(currentIndex, opt.id, q.multi)}
                      className={`w-full flex items-start gap-3 px-3.5 py-2.5 rounded-lg border text-left transition-colors ${
                        showRight
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                          : showWrong
                            ? 'bg-amber-50 border-amber-400 text-amber-950'
                            : isSel
                              ? 'bg-sky-50 border-sky-500 text-slate-900'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      } ${isChecked ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`font-mono-tabular w-6 h-6 rounded-md border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          showRight
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : showWrong
                              ? 'bg-amber-600 border-amber-600 text-white'
                              : isSel
                                ? 'bg-sky-600 border-sky-600 text-white'
                                : 'bg-slate-50 border-slate-300 text-slate-700'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{opt.text}</div>
                        {isChecked && (
                          <p className="mt-1 text-xs leading-relaxed opacity-90">
                            {opt.exp}
                          </p>
                        )}
                      </div>
                      {showRight && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                      )}
                      {showWrong && (
                        <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isChecked && (
                <div
                  className={`rounded-lg border px-3.5 py-2.5 text-sm font-medium flex items-center gap-2 ${
                    isCurrentCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  {isCurrentCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>
                    {isCurrentCorrect
                      ? 'Richtig beantwortet! Alle Details siehst du direkt bei den Optionen.'
                      : 'Noch nicht ganz – lies dir die Erklärung bei jeder Option oben kurz durch.'}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => onChangeQuestion(currentIndex - 1)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Zurück</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverview(true)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium cursor-pointer"
                >
                  Auswertung
                </button>
              </div>

              {!isChecked ? (
                <button
                  type="button"
                  disabled={selected.length === 0}
                  onClick={() => onCheckQuestion(currentIndex)}
                  className="px-5 py-2 rounded-lg bg-sky-600 text-white text-xs sm:text-sm font-semibold hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Antwort prüfen
                </button>
              ) : currentIndex < EXAM_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => onChangeQuestion(currentIndex + 1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-700 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  <span>Nächste Frage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowOverview(true)}
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Endergebnis anzeigen
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
