import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Headphones,
  MousePointerClick,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  HELPDESK_TICKETS,
  PRINTER_COMPONENTS,
  PrinterComponentId,
} from '../data/printerData';

interface HelpdeskModeProps {
  selectedAnswerOptionId: string | null;
  onChooseOption: (
    optionId: string,
    linkedComponent?: PrinterComponentId
  ) => void;
  ticketIndex: number;
  solvedIds: string[];
  onNextTicket: () => void;
  onRestartTickets: () => void;
}

export function HelpdeskMode({
  selectedAnswerOptionId,
  onChooseOption,
  ticketIndex,
  solvedIds,
  onNextTicket,
  onRestartTickets,
}: HelpdeskModeProps) {
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const ticket = HELPDESK_TICKETS[ticketIndex];
  const isSolvedCurrent = selectedAnswerOptionId === ticket.correctOptionId;
  const hasWrongAttempt =
    selectedAnswerOptionId !== null &&
    selectedAnswerOptionId !== ticket.correctOptionId;

  const clickedCompInfo = hasWrongAttempt
    ? PRINTER_COMPONENTS.find((c) => c.id === selectedAnswerOptionId)
    : undefined;

  const wrongReason =
    hasWrongAttempt && selectedAnswerOptionId
      ? ticket.wrongExplanation[selectedAnswerOptionId] ??
        (clickedCompInfo
          ? `Du hast im 3D-Drucker auf „${clickedCompInfo.englishTerm} (${clickedCompInfo.germanTerm})“ geklickt. Dieses Bauteil verursacht dieses Symptom hier jedoch nicht – probiere ein anderes Bauteil oder eine der Optionen.`
          : 'Dieses Bauteil oder diese Maßnahme löst das beschriebene Symptom leider nicht. Schau dir die Hinweise im Ticket noch einmal genau an.')
      : null;

  const isLastTicket = ticketIndex === HELPDESK_TICKETS.length - 1;
  const allSolved = solvedIds.length === HELPDESK_TICKETS.length;

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
              <span>Helpdesk-Ticket einblenden</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>3D-Modell frei betrachten</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="w-full rounded-xl bg-white/95 border border-slate-200 shadow-xl p-5">
            {/* Ticket Metadata & Progress */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <Headphones className="w-4 h-4 text-sky-600" />
                <span className="font-mono-tabular font-semibold text-slate-700">
                  {ticket.ticketNumber}
                </span>
                <span aria-hidden="true">·</span>
                <span>{ticket.callerName}</span>
                <span aria-hidden="true">·</span>
                <span>{ticket.printerModel}</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium text-slate-600 font-mono-tabular">
                <span>
                  Ticket {ticketIndex + 1} von {HELPDESK_TICKETS.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">
                  {solvedIds.length}/{HELPDESK_TICKETS.length} gelöst
                </span>
              </div>
            </div>

            {/* Visual Helpdesk Progress Bar */}
            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (solvedIds.length / HELPDESK_TICKETS.length) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-slate-600 shrink-0">
                {Math.round((solvedIds.length / HELPDESK_TICKETS.length) * 100)}%
              </span>
            </div>

            {/* Symptom Description */}
            <div className="mt-3">
              <h2 className="text-lg font-bold text-slate-900">
                {ticket.symptomTitle}
              </h2>
              <p className="mt-1.5 text-sm text-slate-800 bg-slate-50 border border-slate-200/80 rounded-lg px-3.5 py-2.5 leading-relaxed">
                {ticket.userMessage}
              </p>

              {ticket.requires3DClickHint && !isSolvedCurrent && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700">
                  <MousePointerClick className="w-4 h-4 shrink-0" />
                  <span>
                    Klicke das defekte Bauteil direkt im geöffneten 3D-Drucker
                    an oder wähle unten die passende Ursache.
                  </span>
                </p>
              )}
            </div>

            {/* Answer Choices */}
            <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ticket.options.map((opt) => {
                const isSelected = selectedAnswerOptionId === opt.id;
                const isCorrect =
                  isSelected && opt.id === ticket.correctOptionId;
                const isWrong =
                  isSelected && opt.id !== ticket.correctOptionId;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onChooseOption(opt.id, opt.linkedComponent)
                    }
                    className={`flex items-center justify-between gap-2 px-4 py-3 rounded-lg border text-left text-sm font-semibold transition-colors cursor-pointer ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : isWrong
                          ? 'bg-amber-50 border-amber-400 text-amber-900'
                          : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-sky-400'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isWrong && (
                      <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Constructive Feedback */}
            {(isSolvedCurrent || wrongReason) && (
              <div
                className={`mt-3.5 rounded-lg border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSolvedCurrent
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-2.5 text-sm">
                  {isSolvedCurrent ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed">
                    {isSolvedCurrent ? ticket.successExplanation : wrongReason}
                  </p>
                </div>

                {isSolvedCurrent && (
                  <div className="shrink-0">
                    {!isLastTicket ? (
                      <button
                        type="button"
                        onClick={onNextTicket}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Nächstes Ticket</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onRestartTickets}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>
                          {allSolved
                            ? 'Alle Tickets erneut üben'
                            : 'Von vorn starten'}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
