import { X } from 'lucide-react';
import { OTHER_PRINTER_TYPES } from '../data/printerData';

interface OtherPrintersModalProps {
  open: boolean;
  onClose: () => void;
}

export function OtherPrintersModal({ open, onClose }: OtherPrintersModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="other-printers-title"
    >
      <div className="w-full max-w-4xl max-h-[86vh] flex flex-col rounded-xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2
              id="other-printers-title"
              className="text-lg font-bold text-slate-900"
            >
              Weitere CompTIA A+ Druckertypen im Überblick
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Neben Laserdruckern fragt die Prüfung auch Tintenstrahl-, Thermo- und Nadeldrucker ab.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fenster schließen"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scroll grid grid-cols-1 md:grid-cols-3 gap-5">
          {OTHER_PRINTER_TYPES.map((printer) => (
            <section
              key={printer.id}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col gap-4"
            >
              <div>
                <p className="text-xs font-semibold text-sky-700">
                  {printer.englishName}
                </p>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {printer.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {printer.everydayContext}
                </p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-3">
                {printer.howItWorks}
              </p>

              <div className="space-y-3 border-t border-slate-200 pt-3">
                {printer.parts.map((part) => (
                  <div key={part.englishTerm} className="space-y-0.5">
                    <div className="text-sm font-semibold text-slate-900">
                      {part.englishTerm}{' '}
                      <span className="font-normal text-slate-600">
                        · {part.germanTerm}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {part.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Zurück zum 3D-Drucker
          </button>
        </div>
      </div>
    </div>
  );
}
