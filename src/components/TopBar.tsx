import { BookOpen, DoorClosed, DoorOpen, Layers, RotateCcw } from 'lucide-react';

export type AppMode = 'discover' | 'steps' | 'helpdesk' | 'exam';

interface TopBarProps {
  activeMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  isDoorOpen: boolean;
  onToggleDoor: () => void;
  onResetCamera: () => void;
  onOpenOtherPrinters: () => void;
  onOpenGlossary: () => void;
}

export function TopBar({
  activeMode,
  onChangeMode,
  isDoorOpen,
  onToggleDoor,
  onResetCamera,
  onOpenOtherPrinters,
  onOpenGlossary,
}: TopBarProps) {
  const navItems: { id: AppMode; label: string }[] = [
    { id: 'discover', label: '3D-Bauteile' },
    { id: 'steps', label: '7 Schritte' },
    { id: 'helpdesk', label: 'Helpdesk-Tickets' },
    { id: 'exam', label: 'Prüfungs-Quiz (36)' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-16 bg-white/95 border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 lg:gap-6">
      {/* Zone 1: Single-line Brand Title */}
      <span className="font-display text-base lg:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
        CompTIA A+ Drucker-Werkstatt
      </span>

      {/* Zone 2: Clean Mode Navigation */}
      <nav
        className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto"
        aria-label="Lernmodi"
      >
        {navItems.map((item) => {
          const active = activeMode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMode(item.id)}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                active
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenGlossary}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-sky-600" />
          <span>Glossar</span>
        </button>

        <button
          type="button"
          onClick={onOpenOtherPrinters}
          className="hidden xl:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Layers className="w-4 h-4 text-slate-500" />
          <span>Druckertypen</span>
        </button>

        <button
          type="button"
          onClick={onResetCamera}
          title="Kamera zurücksetzen"
          aria-label="Kamera zurücksetzen"
          className="inline-flex items-center justify-center p-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleDoor}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            isDoorOpen
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-sky-600 text-white hover:bg-sky-700'
          }`}
        >
          {isDoorOpen ? (
            <DoorClosed className="w-4 h-4" />
          ) : (
            <DoorOpen className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isDoorOpen ? 'Klappe schließen' : 'Klappe öffnen'}
          </span>
        </button>
      </div>
    </header>
  );
}
