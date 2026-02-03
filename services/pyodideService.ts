
declare global {
  interface Window {
    loadPyodide: any;
  }
}

let pyodideInstance: any = null;
let initializingPromise: Promise<any> | null = null;

export const initPyodide = async () => {
  if (pyodideInstance) return pyodideInstance;
  if (initializingPromise) return initializingPromise;
  
  if (typeof window.loadPyodide === 'undefined') {
    throw new Error('Pyodide script not loaded yet. Please wait, Chale!');
  }

  // Load pyodide with explicit indexURL for deployment reliability
  initializingPromise = window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
  }).then((instance: any) => {
    pyodideInstance = instance;
    return pyodideInstance;
  });

  return initializingPromise;
};

export const runPythonCode = async (code: string): Promise<{ output: string; error?: string }> => {
  try {
    const pyodide = await initPyodide();
    
    // Redirect stdout to a string buffer
    pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
    `);
    
    await pyodide.runPythonAsync(code);
    
    const stdout = pyodide.runPython('sys.stdout.getvalue()');
    const stderr = pyodide.runPython('sys.stderr.getvalue()');
    
    return { 
      output: stdout.trim(), 
      error: stderr.trim() || undefined 
    };
  } catch (err: any) {
    let errMsg = err.message;
    if (errMsg.includes('Traceback')) {
      const lines = errMsg.split('\n');
      errMsg = lines.slice(-2).join('\n');
    }
    return { output: '', error: errMsg };
  }
};
