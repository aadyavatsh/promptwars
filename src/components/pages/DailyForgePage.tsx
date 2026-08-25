import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Code2,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const DailyForgePage: React.FC = () => {
  const {
    dailyStreak,
    solvedToday,
    completeDailyChallenge,
    triggerNetworkPulse,
  } = useApp();

  const [language, setLanguage] = useState<'typescript' | 'python'>('typescript');
  const [code, setCode] = useState<string>(
`function maxTeammateSynergy(
  candidates: { id: string; role: string; score: number }[],
  targetRoles: string[]
): number {
  // Your code here: Return the maximum synergy sum for matching targetRoles
  const chosenScores = candidates
    .filter(c => targetRoles.includes(c.role))
    .map(c => c.score);

  return chosenScores.reduce((acc, curr) => acc + curr, 0);
}`
  );

  const [testResults, setTestResults] = useState<{
    status: 'idle' | 'running' | 'passed' | 'failed';
    cases: Array<{ input: string; expected: string; actual: string; passed: boolean }>;
  }>({
    status: 'idle',
    cases: [],
  });

  const handleRunTests = () => {
    setTestResults({ status: 'running', cases: [] });
    setTimeout(() => {
      setTestResults({
        status: 'passed',
        cases: [
          {
            input: 'candidates: [{role: "AI", score: 95}, {role: "Design", score: 92}], target: ["AI", "Design"]',
            expected: '187',
            actual: '187',
            passed: true,
          },
          {
            input: 'candidates: [{role: "Backend", score: 88}], target: ["Frontend"]',
            expected: '0',
            actual: '0',
            passed: true,
          },
          {
            input: 'candidates: [{role: "FullStack", score: 98}, {role: "Mobile", score: 85}], target: ["FullStack"]',
            expected: '98',
            actual: '98',
            passed: true,
          },
        ],
      });
    }, 600);
  };

  const handleSubmit = () => {
    setTestResults({ status: 'running', cases: [] });
    setTimeout(() => {
      setTestResults({
        status: 'passed',
        cases: [
          {
            input: 'candidates: [{role: "AI", score: 95}], target: ["AI"]',
            expected: '95',
            actual: '95',
            passed: true,
          },
        ],
      });
      completeDailyChallenge();
      triggerNetworkPulse(2.5);
    }, 700);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-bold border border-orange-200 dark:border-orange-800/60">
            <Flame className="w-3.5 h-3.5" />
            <span>Daily Algorithmic Sprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            DailyForge 🔥
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sharpen your hackathon problem-solving skills daily, build reputation, and maintain your streak.
          </p>
        </div>

        {/* Streak Counter Box */}
        <div className="flex items-center gap-3 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md p-3 px-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm self-start sm:self-auto">
          <div className="text-3xl font-black text-orange-600 dark:text-orange-400">
            🔥 {dailyStreak}
          </div>
          <div className="text-left text-xs">
            <p className="font-extrabold text-slate-900 dark:text-white">Day Streak</p>
            <p className="text-slate-400 font-medium">
              {solvedToday ? 'Solved today! (+120 XP)' : 'Solve today to keep streak!'}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Problem Description (Left) vs Code Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Problem Specification (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                #142: Maximum Teammate Synergy
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Medium • 120 XP
              </span>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              <p>
                You are given an array of hackathon candidate objects, where each candidate has an <code>id</code>, a primary <code>role</code>, and a historical synergy <code>score</code>.
              </p>
              <p>
                You are also given an array of <code>targetRoles</code> required for your hackathon squad.
              </p>
              <p>
                Calculate and return the <strong>maximum total synergy sum</strong> by selecting one candidate per required role without duplicates.
              </p>
            </div>

            {/* Example Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2 font-mono text-[11px]">
              <p className="font-bold text-slate-900 dark:text-white font-sans text-xs">Example 1:</p>
              <div className="text-slate-600 dark:text-slate-300">
                <strong>Input:</strong> candidates = [&#123;role: "AI", score: 95&#125;, &#123;role: "Design", score: 92&#125;], targetRoles = ["AI", "Design"]
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong>Output:</strong> 187
              </div>
              <div className="text-slate-400 font-sans text-[10px]">
                Explanation: 95 (AI) + 92 (Design) = 187 total synergy.
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-1 text-slate-500 dark:text-slate-400">
              <p className="font-bold text-slate-900 dark:text-white">Constraints:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li><code>1 &lt;= candidates.length &lt;= 500</code></li>
                <li><code>1 &lt;= targetRoles.length &lt;= 6</code></li>
                <li><code>0 &lt;= score &lt;= 100</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* In-Browser Code Workspace (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            {/* Editor Header Bar */}
            <div className="p-3.5 px-5 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Solution Editor</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python 3</option>
                </select>
              </div>
            </div>

            {/* Editor Textarea */}
            <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full bg-transparent font-mono text-xs focus:outline-none resize-none leading-relaxed text-emerald-400 placeholder-slate-600"
                spellCheck={false}
              />
            </div>

            {/* Test Results Output Drawer */}
            {testResults.status !== 'idle' && (
              <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 font-sans">Test Execution:</span>
                  {testResults.status === 'running' ? (
                    <span className="text-amber-400 animate-pulse">Running test cases...</span>
                  ) : testResults.status === 'passed' ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                      <CheckCircle2 className="w-4 h-4" /> All Tests Passed (12ms)
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold">Failed on Test 2</span>
                  )}
                </div>

                {testResults.cases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Test Case #{idx + 1}</span>
                      <span className="text-emerald-400 font-bold">Passed ✓</span>
                    </div>
                    <div className="text-slate-300">Expected: {tc.expected} | Actual: {tc.actual}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setCode(`function maxTeammateSynergy(candidates, targetRoles) {\n  return 187;\n}`);
                  setTestResults({ status: 'idle', cases: [] });
                }}
                className="p-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunTests}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Tests</span>
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Submit Solution (+120 XP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
