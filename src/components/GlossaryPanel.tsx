import { Box, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { GLOSSARY_TERMS, GlossaryEntry } from '../data/examAndGlossaryData';
import { PrinterComponentId } from '../data/printerData';

interface GlossaryPanelProps {
  open: boolean;
  onClose: () => void;
  onFocus3DComponent: (id: PrinterComponentId) => void;
}

const CATEGORIES: ('Alle' | GlossaryEntry['category'])[] = [
  'Alle',
  'Laserdrucker',
  'Andere Druckertypen',
  'Netzwerk & Protokolle',
  'Wartung & Sicherheit',
];

export function GlossaryPanel({
  open,
  onClose,
  onFocus3DComponent,
}: GlossaryPanelProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'Alle' | GlossaryEntry['category']>(
    'Alle'
  );

  const sortedFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...GLOSSARY_TERMS]
      .filter((entry) => {
        if (category !== 'Alle' && entry.category !== category) return false;
        if (!q) return true;
        return (
          entry.term.toLowerCase().includes(q) ||
          entry.german.toLowerCase().includes(q) ||
          entry.explanation.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.term.localeCompare(b.term, 'de'));
  }, [query, category]);

  const groupedByLetter = useMemo(() => {
    const groups: { letter: string; entries: GlossaryEntry[] }[] = [];
    for (const entry of sortedFiltered) {
      const letter = entry.term.charAt(0).toUpperCase();
      const last = groups[groups.length - 1];
      if (!last || last.letter !== letter) {
        groups.push({ letter, entries: [entry] });
      } else {
        last.entries.push(entry);
      }
    }
    return groups;
  }, [sortedFiltered]);

  const availableLetters = useMemo(
    () => groupedByLetter.map((g) => g.letter),
    [groupedByLetter]
  );

  if (!open) return null;

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`glossary-letter-${letter}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-title"
    >
      <div className="w-full max-w-2xl h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <h2 id="glossary-title" className="text-lg font-bold text-slate-900">
              CompTIA A+ Druckfachbegriffe-Glossar (A–Z)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-mono-tabular">
              {sortedFiltered.length} von {GLOSSARY_TERMS.length} Fachbegriffen
              (Englisch &amp; Deutsch)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Glossar schließen"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="px-6 py-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Begriff suchen (z. B. Fuser, SMB, Corona, Badging, PCL)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Alphabetical Quick Jump */}
          {availableLetters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1">
              {availableLetters.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => scrollToLetter(letter)}
                  className="w-7 h-7 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition-colors cursor-pointer font-mono-tabular"
                >
                  {letter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alphabetical List */}
        <div className="flex-1 overflow-y-auto custom-scroll px-6 py-5 space-y-6">
          {groupedByLetter.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Keine Fachbegriffe für „{query}“ gefunden.
            </div>
          ) : (
            groupedByLetter.map((group) => (
              <section
                key={group.letter}
                id={`glossary-letter-${group.letter}`}
                className="space-y-3"
              >
                <h3 className="font-mono-tabular text-sm font-bold text-sky-700 border-b border-slate-200 pb-1">
                  {group.letter}
                </h3>

                <div className="space-y-3">
                  {group.entries.map((entry) => (
                    <article
                      key={entry.term}
                      className="rounded-lg border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            {entry.term}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-0.5">
                            <span className="font-semibold text-sky-700">
                              {entry.german}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{entry.category}</span>
                          </div>
                        </div>

                        {entry.relatedComponent && (
                          <button
                            type="button"
                            onClick={() => {
                              onFocus3DComponent(entry.relatedComponent!);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                          >
                            <Box className="w-3.5 h-3.5" />
                            <span>Im 3D-Drucker zeigen</span>
                          </button>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                        {entry.explanation}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
