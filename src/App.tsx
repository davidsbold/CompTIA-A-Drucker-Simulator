import { useCallback, useMemo, useState } from 'react';
import { DiscoverMode } from './components/DiscoverMode';
import { ExamQuizMode } from './components/ExamQuizMode';
import { GlossaryPanel } from './components/GlossaryPanel';
import { HelpdeskMode } from './components/HelpdeskMode';
import { OtherPrintersModal } from './components/OtherPrintersModal';
import { PrinterViewport } from './components/PrinterViewport';
import { ProgressDashboardBar } from './components/ProgressDashboardBar';
import { StepsGameMode } from './components/StepsGameMode';
import { AppMode, TopBar } from './components/TopBar';
import { EXAM_QUESTIONS } from './data/examAndGlossaryData';
import {
  HELPDESK_TICKETS,
  PRINTER_COMPONENTS,
  PrinterComponentId,
} from './data/printerData';

export default function App() {
  const [activeMode, setActiveMode] = useState<AppMode>('discover');
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<PrinterComponentId | null>(null);
  const [discoveredComponents, setDiscoveredComponents] = useState<
    PrinterComponentId[]
  >([]);
  const [highlightedStepComponent, setHighlightedStepComponent] =
    useState<PrinterComponentId | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [otherPrintersOpen, setOtherPrintersOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [progressCollapsed, setProgressCollapsed] = useState(false);

  // 7-Step Paper Animation & Learning Progress state
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [stepsCorrectCount, setStepsCorrectCount] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState(false);
  const [animationCommand, setAnimationCommand] = useState<{
    type: 'play' | 'pause' | 'resume' | 'stop' | 'scrub';
    progress?: number;
    seq: number;
  }>({ type: 'stop', seq: 0 });

  // Helpdesk Quiz state
  const [ticketIndex, setTicketIndex] = useState(0);
  const [selectedTicketOption, setSelectedTicketOption] = useState<
    string | null
  >(null);
  const [solvedTicketIds, setSolvedTicketIds] = useState<string[]>([]);

  // 36-Question Exam Quiz state
  const [examIndex, setExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, string[]>>({});
  const [examChecked, setExamChecked] = useState<Record<number, boolean>>({});

  const markDiscovered = useCallback((id: PrinterComponentId | null) => {
    if (!id) return;
    setDiscoveredComponents((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const issueAnimationCommand = useCallback(
    (type: 'play' | 'pause' | 'resume' | 'stop' | 'scrub', progress?: number) => {
      setAnimationCommand((prev) => ({ type, progress, seq: prev.seq + 1 }));
    },
    []
  );

  const handleToggleDoor = useCallback(() => {
    setIsDoorOpen((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedComponent((current) => {
          if (!current) return null;
          const comp = PRINTER_COMPONENTS.find((c) => c.id === current);
          return comp?.requiresDoorOpen ? null : current;
        });
      }
      return next;
    });
  }, []);

  const handleResetCamera = useCallback(() => {
    setSelectedComponent(null);
    setResetTrigger((n) => n + 1);
  }, []);

  const handleChangeMode = useCallback(
    (mode: AppMode) => {
      setActiveMode(mode);
      setHighlightedStepComponent(null);

      if (mode !== 'steps') {
        setIsAnimationPlaying(false);
        setAnimationFinished(false);
        setAnimationProgress(0);
        issueAnimationCommand('stop');
      }

      if (mode === 'helpdesk') {
        setSelectedComponent(null);
        const currentTicket = HELPDESK_TICKETS[ticketIndex];
        if (currentTicket?.requires3DClickHint) {
          setIsDoorOpen(true);
        }
      } else if (mode === 'exam') {
        setSelectedComponent(null);
      }
    },
    [issueAnimationCommand, ticketIndex]
  );

  const handleDiscoverSelect = useCallback(
    (id: PrinterComponentId | null) => {
      setSelectedComponent(id);
      markDiscovered(id);
    },
    [markDiscovered]
  );

  const handleFocus3DComponent = useCallback(
    (id: PrinterComponentId, switchToDiscover: boolean) => {
      const comp = PRINTER_COMPONENTS.find((c) => c.id === id);
      if (comp?.requiresDoorOpen) {
        setIsDoorOpen(true);
      }
      if (switchToDiscover) {
        setActiveMode('discover');
        setHighlightedStepComponent(null);
        setIsAnimationPlaying(false);
        issueAnimationCommand('stop');
      }
      setSelectedComponent(id);
      markDiscovered(id);
    },
    [issueAnimationCommand, markDiscovered]
  );

  const handleHelpdeskAnswer = useCallback(
    (optionId: string, linkedComponent?: PrinterComponentId) => {
      const ticket = HELPDESK_TICKETS[ticketIndex];
      setSelectedTicketOption(optionId);
      if (linkedComponent) {
        const comp = PRINTER_COMPONENTS.find((c) => c.id === linkedComponent);
        if (comp?.requiresDoorOpen) {
          setIsDoorOpen(true);
        }
        setSelectedComponent(linkedComponent);
        markDiscovered(linkedComponent);
      } else {
        setSelectedComponent(null);
      }

      if (optionId === ticket.correctOptionId) {
        setSolvedTicketIds((prev) =>
          prev.includes(ticket.id) ? prev : [...prev, ticket.id]
        );
      }
    },
    [markDiscovered, ticketIndex]
  );

  const handleViewportSelectComponent = useCallback(
    (id: PrinterComponentId) => {
      markDiscovered(id);
      if (activeMode === 'discover') {
        setSelectedComponent((prev) => (prev === id ? null : id));
      } else if (activeMode === 'helpdesk') {
        handleHelpdeskAnswer(id, id);
      } else {
        setSelectedComponent(id);
      }
    },
    [activeMode, handleHelpdeskAnswer, markDiscovered]
  );

  const handleAnimationProgress = useCallback(
    (progress: number, finished: boolean) => {
      setAnimationProgress(progress);
      if (finished) {
        setIsAnimationPlaying(false);
        setAnimationFinished(true);
      }
    },
    []
  );

  const handleStepsProgressChange = useCallback(
    (correctCount: number, completed: boolean) => {
      setStepsCorrectCount(correctCount);
      setStepsCompleted(completed);
    },
    []
  );

  const handleNextTicket = useCallback(() => {
    const nextIdx = Math.min(ticketIndex + 1, HELPDESK_TICKETS.length - 1);
    setTicketIndex(nextIdx);
    setSelectedTicketOption(null);
    setSelectedComponent(null);
    const nextTicket = HELPDESK_TICKETS[nextIdx];
    if (nextTicket?.requires3DClickHint) {
      setIsDoorOpen(true);
    }
    setResetTrigger((n) => n + 1);
  }, [ticketIndex]);

  const handleRestartTickets = useCallback(() => {
    setTicketIndex(0);
    setSelectedTicketOption(null);
    setSelectedComponent(null);
    setSolvedTicketIds([]);
    if (HELPDESK_TICKETS[0]?.requires3DClickHint) {
      setIsDoorOpen(true);
    }
    setResetTrigger((n) => n + 1);
  }, []);

  const handleSelectExamOption = useCallback(
    (questionIdx: number, optionId: string, multi: boolean) => {
      setExamAnswers((prev) => {
        const current = prev[questionIdx] ?? [];
        if (!multi) {
          return { ...prev, [questionIdx]: [optionId] };
        }
        if (current.includes(optionId)) {
          return {
            ...prev,
            [questionIdx]: current.filter((id) => id !== optionId),
          };
        }
        return { ...prev, [questionIdx]: [...current, optionId] };
      });
    },
    []
  );

  const handleCheckExamQuestion = useCallback((questionIdx: number) => {
    setExamChecked((prev) => ({ ...prev, [questionIdx]: true }));
  }, []);

  const handleChangeExamQuestion = useCallback((index: number) => {
    setExamIndex(index);
    setSelectedComponent(null);
  }, []);

  const handleResetExam = useCallback(() => {
    setExamIndex(0);
    setExamAnswers({});
    setExamChecked({});
    setSelectedComponent(null);
  }, []);

  const examStats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    EXAM_QUESTIONS.forEach((item, idx) => {
      if (examChecked[idx]) {
        answered++;
        const sel = examAnswers[idx] ?? [];
        const corr = item.options.filter((o) => o.correct).map((o) => o.id);
        if (
          sel.length === corr.length &&
          sel.every((id) => corr.includes(id))
        ) {
          correct++;
        }
      }
    });
    return { answered, correct };
  }, [examAnswers, examChecked]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100 text-slate-900">
      <TopBar
        activeMode={activeMode}
        onChangeMode={handleChangeMode}
        isDoorOpen={isDoorOpen}
        onToggleDoor={handleToggleDoor}
        onResetCamera={handleResetCamera}
        onOpenOtherPrinters={() => setOtherPrintersOpen(true)}
        onOpenGlossary={() => setGlossaryOpen(true)}
      />

      <ProgressDashboardBar
        activeMode={activeMode}
        onChangeMode={handleChangeMode}
        discoveredCount={discoveredComponents.length}
        totalComponents={PRINTER_COMPONENTS.length}
        stepsCompleted={stepsCompleted}
        stepsCorrectCount={stepsCorrectCount}
        helpdeskSolvedCount={solvedTicketIds.length}
        helpdeskTotalCount={HELPDESK_TICKETS.length}
        examCorrectCount={examStats.correct}
        examAnsweredCount={examStats.answered}
        examTotalCount={EXAM_QUESTIONS.length}
        collapsed={progressCollapsed}
        onToggleCollapse={() => setProgressCollapsed((v) => !v)}
      />

      <main className="w-full h-full pt-16">
        <PrinterViewport
          isDoorOpen={isDoorOpen}
          selectedComponent={selectedComponent}
          highlightedStepComponent={highlightedStepComponent}
          resetTrigger={resetTrigger}
          animationCommand={animationCommand}
          onSelectComponent={handleViewportSelectComponent}
          onToggleDoor={handleToggleDoor}
          onAnimationProgress={handleAnimationProgress}
        />
      </main>

      {activeMode === 'discover' && (
        <DiscoverMode
          isDoorOpen={isDoorOpen}
          selectedComponent={selectedComponent}
          discoveredComponents={discoveredComponents}
          onSelectComponent={handleDiscoverSelect}
          onOpenDoor={() => setIsDoorOpen(true)}
          onOpenOtherPrinters={() => setOtherPrintersOpen(true)}
        />
      )}

      {activeMode === 'steps' && (
        <StepsGameMode
          animationProgress={animationProgress}
          isAnimationPlaying={isAnimationPlaying}
          animationFinished={animationFinished}
          initialSolved={stepsCompleted}
          onStartAnimation={() => {
            setIsDoorOpen(true);
            setSelectedComponent(null);
            setAnimationProgress(0);
            setAnimationFinished(false);
            setIsAnimationPlaying(true);
            issueAnimationCommand('play');
          }}
          onPauseAnimation={() => {
            setIsAnimationPlaying(false);
            issueAnimationCommand('pause');
          }}
          onResumeAnimation={() => {
            setIsAnimationPlaying(true);
            issueAnimationCommand('resume');
          }}
          onScrubAnimation={(progress, stepComp) => {
            setIsDoorOpen(true);
            setIsAnimationPlaying(false);
            setAnimationFinished(progress >= 0.99);
            setAnimationProgress(progress);
            setHighlightedStepComponent(stepComp);
            issueAnimationCommand('scrub', progress);
          }}
          onStopAnimation={() => {
            setIsAnimationPlaying(false);
            setAnimationFinished(false);
            setAnimationProgress(0);
            setHighlightedStepComponent(null);
            issueAnimationCommand('stop');
          }}
          onProgressChange={handleStepsProgressChange}
        />
      )}

      {activeMode === 'helpdesk' && (
        <HelpdeskMode
          selectedAnswerOptionId={selectedTicketOption}
          onChooseOption={handleHelpdeskAnswer}
          ticketIndex={ticketIndex}
          solvedIds={solvedTicketIds}
          onNextTicket={handleNextTicket}
          onRestartTickets={handleRestartTickets}
        />
      )}

      {activeMode === 'exam' && (
        <ExamQuizMode
          currentIndex={examIndex}
          userAnswers={examAnswers}
          checkedMap={examChecked}
          onSelectOption={handleSelectExamOption}
          onCheckQuestion={handleCheckExamQuestion}
          onChangeQuestion={handleChangeExamQuestion}
          onResetExam={handleResetExam}
          onFocus3DComponent={(id) => handleFocus3DComponent(id, false)}
        />
      )}

      <OtherPrintersModal
        open={otherPrintersOpen}
        onClose={() => setOtherPrintersOpen(false)}
      />

      <GlossaryPanel
        open={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        onFocus3DComponent={(id) => handleFocus3DComponent(id, true)}
      />
    </div>
  );
}
