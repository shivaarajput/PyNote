import React, { useState, useEffect } from 'react';
import { Play, ArrowLeft, RotateCcw, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import EXPERIMENTS_DATA from "./data/experiments.json";

// --- Components ---

const A4Page = ({ children, className = "" }) => (
  <div className={`bg-white shadow-xl mx-auto border border-gray-300 relative overflow-hidden transition-all duration-300 ${className} w-full md:w-[210mm] min-h-screen md:min-h-[297mm] p-4 md:p-[20mm] print:w-full print:shadow-none print:border-none print:m-0 print:p-0`}>
    <div className="hidden md:flex absolute left-2 top-0 bottom-0 w-8 flex-col justify-center gap-32 pointer-events-none opacity-20 print:hidden">
      <div className="w-4 h-4 rounded-full bg-gray-400"></div>
      <div className="w-4 h-4 rounded-full bg-gray-400"></div>
      <div className="w-4 h-4 rounded-full bg-gray-400"></div>
    </div>
    {children}
  </div>
);

const SectionHeading = ({ title }) => (
  <div className="mt-6 mb-3">
    <h3 className="text-lg font-bold font-serif uppercase tracking-wider text-black border-b border-black inline-block pb-0.5">
      {title}
    </h3>
  </div>
);

// --- Smart Editor Component (Uses PrismJS) ---
const Editor = ({ code, onChange }) => {
  const [isPrismReady, setIsPrismReady] = useState(false);

  // Smart Approach: Load PrismJS library dynamically from CDN
  useEffect(() => {
    if (window.Prism && window.Prism.languages.python) {
      setIsPrismReady(true);
      return;
    }

    const loadLibrary = async () => {
      // 1. Load CSS
      if (!document.getElementById('prism-css')) {
        const link = document.createElement('link');
        link.id = 'prism-css';
        link.rel = 'stylesheet';
        // Using 'prism-coy' theme for a clean paper look
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-coy.min.css';
        document.head.appendChild(link);
      }

      // 2. Load Core JS
      if (!window.Prism) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      // 3. Load Python Syntax
      if (!window.Prism.languages.python) {
        await new Promise((resolve) => {
          const pyScript = document.createElement('script');
          pyScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js';
          pyScript.onload = resolve;
          document.head.appendChild(pyScript);
        });
      }

      setIsPrismReady(true);
    };

    loadLibrary();
  }, []);

  // Generate Highlighted HTML
  const getHighlightedHtml = () => {
    if (isPrismReady && window.Prism && window.Prism.languages.python) {
      return window.Prism.highlight(code, window.Prism.languages.python, 'python');
    }
    // Fallback: Escape HTML to safe text if library isn't ready
    return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  // Shared font styles for alignment
  const fontStyle = {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    padding: '12px',
    margin: 0,
    border: 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  return (
    <div className="relative border border-black bg-white rounded-sm group w-full min-h-[120px]">
      <style>{`
        .token { font-weight: normal !important; }
        pre[class*="language-"] { 
          background: transparent !important; 
          text-shadow: none !important; 
          margin: 0 !important; 
          padding: 12px !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* 1. Highlight Layer (Relative) */}
      <pre
        className="relative z-0 pointer-events-none w-full h-auto overflow-visible"
        aria-hidden="true"
        style={{ ...fontStyle, color: 'black' }}
        dangerouslySetInnerHTML={{ __html: getHighlightedHtml() + '<br />' }}
      />

      {/* 2. Input Layer (Absolute) */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        spellCheck="false"
        className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-black outline-none resize-none z-10 overflow-hidden"
        style={{ ...fontStyle }}
      />

      <div className="absolute top-0 right-0 bg-blue-50 text-blue-800 text-[10px] px-2 py-0.5 border-l border-b border-blue-100 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
        Editable
      </div>
    </div>
  );
};

// --- Pages ---

const ITEMS_PER_PAGE = 25;
const INDEX_TOTAL_PAGES = Math.ceil(EXPERIMENTS_DATA.length / ITEMS_PER_PAGE);


const IndexPage = ({ onSelectExperiment }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(EXPERIMENTS_DATA.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentExperiments = EXPERIMENTS_DATA.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);


  return (
    <div className="py-4 md:py-8 bg-gray-200 min-h-screen font-serif">
      <A4Page>
        {/* Header */}
        <div className="text-center mb-10 border-b-2 border-black pb-4">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2">
            Practical Copy
          </h1>
          <h2 className="text-lg md:text-xl">
            Python Programming Lab (MCA-301)
          </h2>
          <div className="mt-6 flex flex-col md:flex-row justify-between text-sm italic gap-2">
            <span>Name: Shivam Kumar</span>
            <span>Roll No: 100011</span>
          </div>
        </div>

        <h3 className="text-center font-bold underline mb-4 text-lg">
          INDEX
        </h3>

        {/* Table */}
        <div className="w-full border-2 border-black">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-r border-b border-black p-2 w-16 text-center">
                  S.No.
                </th>
                <th className="border-r border-b border-black p-2 text-center">
                  Name of Experiment
                </th>
                <th className="border-b border-black p-2 w-20 text-center">
                  Sign
                </th>
              </tr>
            </thead>

            <tbody>
              {currentExperiments.map((exp, index) => (
                <tr
                  key={exp.id}
                  onClick={() => onSelectExperiment(exp.id)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors group"
                >
                  <td className="border-r border-b border-black p-3 text-center font-bold">
                    {startIndex + index + 1}
                  </td>

                  <td className="border-r border-b border-black p-3 font-medium text-blue-900 underline decoration-dotted underline-offset-4 group-hover:text-blue-700 break-words">
                    {exp.title}
                  </td>

                  <td className="border-b border-black p-3 text-center"></td>
                </tr>
              ))}

              {/* Fill empty rows to keep A4 look */}
              {[...Array(Math.max(0, ITEMS_PER_PAGE - currentExperiments.length))].map(
                (_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border-r border-b border-black p-3">&nbsp;</td>
                    <td className="border-r border-b border-black p-3">&nbsp;</td>
                    <td className="border-b border-black p-3">&nbsp;</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border border-black disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>

          <span className="text-sm font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              currentPage === totalPages
                ? onSelectExperiment(1) // jump to first experiment
                : setCurrentPage(p => p + 1)
            }
            className="px-4 py-2 border border-black hover:bg-gray-100"
          >
            Next
          </button>

        </div>
      </A4Page>
    </div>
  );
};


const ExperimentPage = ({ experimentId, onBack, onNavigate }) => {


  const experiment = EXPERIMENTS_DATA.find(e => e.id === experimentId);
  const [code, setCode] = useState(experiment?.code || "");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isOutputStale, setIsOutputStale] = useState(false);
  const pageNumber = INDEX_TOTAL_PAGES + experiment.id;




  // Navigation Calculation
  const currentIndex = EXPERIMENTS_DATA.findIndex(e => e.id === experimentId);
  const prevExperiment = EXPERIMENTS_DATA[currentIndex - 1];
  const nextExperiment = EXPERIMENTS_DATA[currentIndex + 1];

  useEffect(() => {
    const handleKeyDown = (e) => {
      const active = document.activeElement;
      const tag = active?.tagName;

      // Ignore when typing
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        active?.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          if (prevExperiment) onNavigate(prevExperiment.id);
          break;

        case "ArrowRight":
          if (nextExperiment) onNavigate(nextExperiment.id);
          break;

        case "Escape":
          onBack();
          break;

        case "Home":
          onNavigate(EXPERIMENTS_DATA[0].id);
          break;

        case "End":
          onNavigate(EXPERIMENTS_DATA[EXPERIMENTS_DATA.length - 1].id);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevExperiment, nextExperiment, onNavigate, onBack]);

  useEffect(() => {
    if (experiment) {
      setCode(experiment.code);
      setConsoleOutput(experiment.expectedOutput);
      setIsOutputStale(false);
      window.scrollTo(0, 0);
    }
  }, [experimentId, experiment]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setIsOutputStale(true);
  };

  const executeCode = async () => {
    setIsRunning(true);

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python",
          version: "3.10.0",
          files: [{ content: code }],
        }),
      });
      const data = await response.json();

      if (data.run) {
        const output = data.run.output || "No output returned.";
        setConsoleOutput(output);
      } else {
        setConsoleOutput("Error: Could not execute on remote server.");
      }
      setIsOutputStale(false);

    } catch (err) {
      setConsoleOutput("Error: Network connection failed.\nPlease check your internet connection.");
    } finally {
      setIsRunning(false);
    }
  };

  const resetOutput = () => {
    setConsoleOutput(experiment.expectedOutput);
    setIsOutputStale(false);
    setCode(experiment.code);
  };

  if (!experiment) return null;

  return (
    <div className="py-4 md:py-8 bg-gray-200 min-h-screen font-serif text-black">
      {/* Mobile Sticky Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 p-2 print:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 md:bg-transparent md:border-none md:p-4 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition-colors text-sm font-sans"
          >
            <ArrowLeft size={16} /> <span className="font-medium hidden sm:inline">Back to Index</span><span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Navigation Buttons (Top) */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => prevExperiment && onNavigate(prevExperiment.id)}
            disabled={!prevExperiment}
            className="flex items-center gap-1 bg-white text-black border border-gray-300 px-3 py-2 rounded shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-sans"
            title={prevExperiment ? `Go to Exp ${prevExperiment.id}` : "No previous experiment"}
          >
            <ChevronLeft size={16} /> <span className="hidden sm:inline">Prev</span>
          </button>
          <button
            onClick={() => nextExperiment && onNavigate(nextExperiment.id)}
            disabled={!nextExperiment}
            className="flex items-center gap-1 bg-white text-black border border-gray-300 px-3 py-2 rounded shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-sans"
            title={nextExperiment ? `Go to Exp ${nextExperiment.id}` : "No next experiment"}
          >
            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <A4Page className="mt-14 md:mt-0">
        {/* Header Block */}
        <div className="border border-black p-3 mb-6 flex flex-col items-center text-sm font-bold gap-2">

          {/* Experiment Number (Top Center) */}
          <div className="text-center">
            <span className="uppercase tracking-wide">
              Experiment No: {experiment.id}
            </span>
          </div>

          {/* Experiment Title */}
          <div className="text-center w-full">
            <span className="uppercase text-lg border-b border-black pb-1">
              {experiment.title}
            </span>
          </div>

        </div>

        {/* AIM */}
        <SectionHeading title="Aim" />
        <p className="text-justify leading-relaxed ml-0 md:ml-6 mb-4">
          {experiment.aim}
        </p>

        {/* PROCEDURE */}
        <SectionHeading title="Procedure" />
        <ol className="list-decimal ml-5 md:ml-10 space-y-1 mb-6 leading-relaxed">
          {experiment.procedure.map((step, idx) => (
            <li key={idx} className="pl-2">{step}</li>
          ))}
        </ol>

        {/* SOURCE CODE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-2 md:gap-0">
          <SectionHeading title="Source Code" />
          <div className="flex gap-2 print:hidden self-end">
            {isOutputStale && (
              <span className="flex items-center gap-1 text-xs text-orange-600 font-bold self-center animate-pulse mr-2 bg-orange-100 px-2 py-1 rounded-full">
                <AlertCircle size={12} />
                Output Stale
              </span>
            )}
            <button
              onClick={resetOutput}
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
              title="Reset to Original"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-black text-white text-sm font-sans rounded shadow hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-95"
            >
              {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="white" />}
              {isRunning ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        <div className="ml-0 md:ml-6 mb-6">
          <Editor code={code} onChange={handleCodeChange} />
        </div>

        {/* OUTPUT */}
        <SectionHeading title="Output" />
        <div className="ml-0 md:ml-6 mb-8 relative">
          <div className="absolute -top-2.5 left-2 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-gray-200 rounded-full z-10">
            Console Output
          </div>
          <div className={`border-2 p-4 pt-6 font-mono text-sm whitespace-pre-wrap min-h-[100px] transition-colors duration-300 relative ${isOutputStale ? 'border-orange-300 bg-orange-50/50' : 'border-black bg-gray-50'}`}>
            {consoleOutput}
          </div>
        </div>

        {/* RESULT */}
        <SectionHeading title="Result" />
        <p className="ml-0 md:ml-6 leading-relaxed">
          The program was successfully executed and the output was verified.
        </p>
        {/* Bottom Page Navigation */}
        <div className="mt-8 pt-6 border-t border-dashed border-gray-300 relative flex print:hidden">

          <div className="flex flex-col items-center gap-2 w-full">
            {/* Prev / Next row */}
            <div className="flex w-full items-center">
              {/* Prev */}
              <div className="flex-1">
                {prevExperiment && (
                  <button
                    onClick={() => onNavigate(prevExperiment.id)}
                    className="text-sm text-gray-500 hover:text-black flex items-center gap-1 font-sans group"
                  >
                    <ChevronLeft
                      size={14}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    {prevExperiment.title.substring(0, 20)}
                    {prevExperiment.title.length > 20 ? "..." : ""}
                  </button>
                )}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Next */}
              <div className="flex-1 flex justify-end">
                {nextExperiment && (
                  <button
                    onClick={() => onNavigate(nextExperiment.id)}
                    className="text-sm text-gray-500 hover:text-black flex items-center gap-1 font-sans group"
                  >
                    {nextExperiment.title.substring(0, 20)}
                    {nextExperiment.title.length > 20 ? "..." : ""}
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Page number – guaranteed clear */}
            <div className="text-sm font-semibold text-gray-600">
              Page {pageNumber} of 101
            </div>
          </div>

        </div>



      </A4Page>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('index');
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectExperiment = (id) => {
    setSelectedId(id);
    setCurrentView('experiment');
  };

  const handleBack = () => {
    setSelectedId(null);
    setCurrentView('index');
  };

  return currentView === 'index' ? (
    <IndexPage onSelectExperiment={handleSelectExperiment} />
  ) : (
    <ExperimentPage
      experimentId={selectedId}
      onBack={handleBack}
      onNavigate={handleSelectExperiment}
    />
  );
}