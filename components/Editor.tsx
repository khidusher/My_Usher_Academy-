
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { runPythonCode } from '../services/pyodideService.ts';
import { getMentorFeedback } from '../services/geminiService.ts';

interface EditorProps {
  initialCode: string;
  onSuccess: () => void;
  onCodeChange?: (code: string) => void;
  challenge: string;
  testCases: { input?: string; expected: string; hint: string }[];
  userName: string;
  solution: string;
}

const Editor: React.FC<EditorProps> = ({ initialCode, onSuccess, onCodeChange, challenge, testCases, userName, solution }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [mentorHint, setMentorHint] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Optimization: Debounce the autosave to prevent parent re-renders on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code !== initialCode) {
        onCodeChange?.(code);
      }
    }, 1000); // Wait 1 second after typing stops to sync global state
    return () => clearTimeout(timer);
  }, [code, onCodeChange, initialCode]);

  useEffect(() => {
    setCode(initialCode);
    setMentorHint('');
    setOutput('');
    setError('');
    setFailCount(0);
    setShowSolution(false);
  }, [initialCode]);

  // Optimization: Memoize the syntax highlighting calculation
  const highlightedHtml = useMemo(() => {
    const patterns = [
      { name: 'STRING', regex: /(f?".*?"|f?'.*?')/ },
      { name: 'COMMENT', regex: /(#.*)/ },
      { name: 'KEYWORD', regex: /\b(if|elif|else|for|while|def|class|return|import|from|as|try|except|finally|with|pass|break|continue|in|is|not|and|or|True|False|None)\b/ },
      { name: 'BUILTIN', regex: /\b(print|input|float|int|str|len|range|list|dict|set|tuple|type|abs|sum|max|min)\b/ },
      { name: 'NUMBER', regex: /\b(\d+(\.\d+)?)\b/ },
    ];

    const combinedRegex = new RegExp(patterns.map(p => p.regex.source).join('|'), 'g');
    let escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const html = escaped.replace(combinedRegex, (match) => {
      if (match.startsWith('#')) return `<span class="text-[#565f89] italic">${match}</span>`;
      if (match.startsWith('"') || match.startsWith("'") || match.startsWith('f"')) return `<span class="text-[#9ece6a]">${match}</span>`;
      if (/\b(if|elif|else|for|while|def|class|return|import|from|as|try|except|finally|with|pass|break|continue|in|is|not|and|or|True|False|None)\b/.test(match)) return `<span class="text-[#bb9af7]">${match}</span>`;
      if (/\b(print|input|float|int|str|len|range|list|dict|set|tuple|type|abs|sum|max|min)\b/.test(match)) return `<span class="text-[#ff9e64]">${match}</span>`;
      if (/\d/.test(match)) return `<span class="text-[#ff9e64]">${match}</span>`;
      return match;
    });
    
    return html + (code.endsWith('\n') ? ' ' : '');
  }, [code]);

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setError('');
    setOutput('>>> Executing...\n');
    
    try {
      const result = await runPythonCode(code);
      if (result.error) {
        setError(result.error);
        setFailCount(prev => prev + 1);
        const feedback = await getMentorFeedback(code, result.error, challenge, userName);
        setMentorHint(feedback);
      } else {
        const finalOutput = result.output || '(No output generated)';
        setOutput(prev => prev + finalOutput);
        
        const isCorrect = testCases.every(tc => 
          result.output.toLowerCase().includes(tc.expected.toLowerCase())
        );

        if (isCorrect) {
          setMentorHint("Akwaaba! Your code is perfect. Level up, Chale! 🇬🇭🎉");
          setTimeout(onSuccess, 2000);
        } else {
          setFailCount(prev => prev + 1);
          setMentorHint("Almost there! The output doesn't match what the quest asked for. Try again!");
        }
      }
    } catch (err: any) {
      setError(err.message);
      setFailCount(prev => prev + 1);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRevealSolution = () => {
    setCode(solution);
    setShowSolution(true);
    setMentorHint("Don't worry kraa, we all get stuck! Here is the solution. Study it and let's move forward! 🇬🇭");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart, selectionEnd, value } = e.currentTarget;

    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const newCode = value.substring(0, selectionStart) + "    " + value.substring(selectionEnd);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 4;
        }
      }, 0);
    }
  };

  const lineNumbers = Array.from({ length: Math.max(code.split('\n').length, 1) }, (_, i) => i + 1);

  return (
    <div className="bg-[#1a1b26] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full border border-[#24283b] dark:border-slate-800 relative select-none">
      <div className="px-8 py-4 flex items-center justify-between border-b border-[#24283b] bg-[#1a1b26] z-20">
        <div className="flex items-center gap-4">
          <span className="text-white font-mono text-2xl font-bold tracking-tight">python</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">Sync: AUTO</span>
        </div>
        <div className="flex items-center gap-6">
          {failCount >= 2 && !showSolution && (
            <button 
              onClick={handleRevealSolution}
              className="text-[11px] font-black text-yellow-500 hover:text-yellow-400 uppercase tracking-widest transition-all underline decoration-2 underline-offset-4"
            >
              Reveal Solution
            </button>
          )}
          <button 
            onClick={() => setCode(initialCode)}
            className="text-[11px] font-black text-[#565f89] hover:text-white uppercase tracking-[0.2em] transition-all"
          >
            RESET
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xl shadow-black/20 ${
              isRunning ? 'bg-[#24283b] text-[#565f89]' : 'bg-[#414868] text-white hover:bg-[#565f89] hover:scale-105 active:scale-95'
            }`}
          >
            {isRunning ? 'RUNNING...' : 'Run Module'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden relative bg-[#1a1b26]">
        <div 
          ref={gutterRef}
          className="bg-[#1a1b26] text-[#24283b] text-right p-8 pr-4 select-none border-r border-[#24283b] overflow-hidden"
          style={{ width: '4rem' }}
        >
          {lineNumbers.map(n => (
            <div key={n} className="h-7 text-[15px] leading-7 font-mono font-medium">{n}</div>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden font-mono text-[17px] leading-7">
          <div
            ref={highlightRef}
            className="absolute inset-0 p-8 text-white pointer-events-none whitespace-pre overflow-hidden"
            style={{ 
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              tabSize: 4,
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
          
          <textarea
            ref={textareaRef}
            value={code}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full bg-transparent p-8 resize-none focus:outline-none overflow-auto"
            style={{ 
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              whiteSpace: 'pre',
              tabSize: 4,
              color: 'transparent',
              caretColor: 'white',
              WebkitTextFillColor: 'transparent',
            }}
            placeholder="# Type your Python code here..."
          />
        </div>
      </div>

      <div className="bg-[#16161e] border-t border-[#24283b] h-[220px] flex flex-col shrink-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="px-8 py-2.5 bg-[#1a1b26] flex items-center justify-between border-b border-[#24283b]">
          <span className="text-[10px] font-black text-[#565f89] uppercase tracking-[0.3em]">Python 3.10 Shell</span>
        </div>
        <div className="flex-1 p-8 overflow-y-auto text-sm font-mono leading-7 custom-scrollbar bg-[#16161e]">
          {output && <pre className="text-[#7aa2f7] whitespace-pre-wrap animate-in fade-in slide-in-from-left-4">{output}</pre>}
          {error && <pre className="text-[#f7768e] bg-[#f7768e]/5 p-4 rounded-2xl mt-2 border border-[#f7768e]/20 whitespace-pre-wrap font-bold">{error}</pre>}
        </div>
      </div>

      {mentorHint && (
        <div className="absolute bottom-12 left-12 right-12 p-6 bg-[#7aa2f7] text-[#1a1b26] rounded-[2.5rem] shadow-2xl z-40 flex items-start gap-5 border-4 border-white/30 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="text-5xl bg-white/20 p-4 rounded-3xl backdrop-blur-md shadow-inner">👨🏾‍🏫</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em]">Mentor Kofi's Advice</p>
              <button onClick={() => setMentorHint('')} className="bg-white/20 hover:bg-white/40 p-1.5 rounded-full transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="text-[17px] font-black leading-tight drop-shadow-sm">{mentorHint}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;