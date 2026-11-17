import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Layers,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { PRINTER_COMPONENTS, PrinterComponentId } from '../data/printerData';

interface DiscoverModeProps {
  isDoorOpen: boolean;
  selectedComponent: PrinterComponentId | null;
  discoveredComponents: PrinterComponentId[];
  onSelectComponent: (id: PrinterComponentId | null) => void;
  onOpenDoor: () => void;
  onOpenOtherPrinters: () => void;
}

export function DiscoverMode({
  isDoorOpen,
  selectedComponent,
  discoveredComponents,
  onSelectComponent,
  onOpenDoor,
  onOpenOtherPrinters,
}: DiscoverModeProps) {
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const selectedInfo = selectedComponent
    ? PRINTER_COMPONENTS.find((c) => c.id === selectedComponent) ?? null
    : null;

  const currentIdx = selectedInfo
    ? PRINTER_COMPONENTS.findIndex((c) => c.id === selectedInfo.id)
    : -1;

  const handleCycle = (dir: -1 | 1) => {
    const nextIdx =
      currentIdx === -1
        ? 0
        : (currentIdx + dir + PRINTER_COMPONENTS.length) %
          PRINTER_COMPONENTS.length;
    const nextComp = PRINTER_COMPONENTS[nextIdx];
    if (nextComp.requiresDoorOpen && !isDoorOpen) onOpenDoor();
    onSelectComponent(nextComp.id);
  };

  const handlePickPart = (id: PrinterComponentId) => {
    const comp = PRINTER_COMPONENTS.find((c) => c.id === id);
    if (comp?.requiresDoorOpen && !isDoorOpen) onOpenDoor();
    onSelectComponent(id === selectedComponent ? null : id);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex flex-col items-center px-4">
      <div className="pointer-events-auto w-full max-w-4xl flex flex-col items-center">
        {/* Selected Component Info Card */}
        {selectedInfo && !dockCollapsed && (
          <article className="w-full mb-3 rounded-xl bg-white/95 border border-slate-200 shadow-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: selectedInfo.colorHex }}
                    aria-hidden="true"
                  />
                  <span>CompTIA A+ Bauteil</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">
                    {currentIdx + 1} / {PRINTER_COMPONENTS.length}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedInfo.englishTerm}
                </h2>
                <p className="text-sm font-semibold text-sky-700">
                  Deutsch: {selectedInfo.germanTerm}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCycle(-1)}
                  aria-label="Vorheriges Bauteil"
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCycle(1)}
                  aria-label="Nächstes Bauteil"
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectComponent(null)}
                  aria-label="Infokarte schließen"
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3.5">
                <p className="text-xs font-semibold text-slate-500">
                  Einfach erklärt (Alltagsvergleich)
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  „{selectedInfo.analogy}“
                </p>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {selectedInfo.simpleExplanation}
                </p>
              </div>

              <div className="rounded-lg bg-sky-50/70 border border-sky-200/80 p-3.5 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-sky-800">
                    Praxis- &amp; Prüfungstipp (CompTIA A+)
                  </p>
                  <p className="mt-1.5 text-sm text-slate-800 leading-relaxed">
                    {selectedInfo.examTip}
                  </p>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Collapse / Expand Handle */}
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 shadow-sm cursor-pointer"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Bauteile einblenden</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Steuerung ausblenden</span>
            </>
          )}
        </button>

        {/* Bottom Dock */}
        {!dockCollapsed && (
          <div className="w-full rounded-xl bg-white/95 border border-slate-200 shadow-lg p-3">
            {!isDoorOpen && !selectedInfo && (
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-slate-700">
                <span>
                  Öffne die vordere Klappe für die 6 Innenbauteile – oder klicke
                  oben direkt auf Scanner/ADF und Bedienfeld/NFC.
                </span>
                <button
                  type="button"
                  onClick={onOpenDoor}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors cursor-pointer"
                >
                  Jetzt Klappe öffnen
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              {PRINTER_COMPONENTS.map((comp) => {
                const isActive = comp.id === selectedComponent;
                const isDiscovered = discoveredComponents.includes(comp.id);
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => handlePickPart(comp.id)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: comp.colorHex }}
                      aria-hidden="true"
                    />
                    <span>{comp.englishTerm}</span>
                    {isDiscovered && (
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      />
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={onOpenOtherPrinters}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer xl:hidden"
              >
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Druckertypen</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
