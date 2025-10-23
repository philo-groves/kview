"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { getHistory, getResults } from "../_services/results-service";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./theme-provider";

type ResultsContextType = {
  results: TestGroupResults[],
  history: number[]
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined)

export function useResults() {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error("useResults must be used within a ResultsProvider")
  }
  return context;
}

export function ResultsProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [history, setHistory] = useState<number[]>([]);
  const [results, setResults] = useState<TestGroupResults[]>([]);

  useEffect(() => {
    refreshHistory();
    const interval = setInterval(() => {
      refreshHistory();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function refreshHistory() {
    getHistory().then((newHistory) => {
      setHistory((currentHistory) => {
        let latestTimestamp = currentHistory.length > 0 ? currentHistory[0] : 0;
        let newLatestTimestamp = newHistory.length > 0 ? newHistory[0] : 0;
        
        if (newLatestTimestamp > latestTimestamp) {
          console.log(`New test results detected: ${newLatestTimestamp} and old was ${latestTimestamp}`);

          getResults(newLatestTimestamp)
            .then((newResults) => {
              setResults(newResults);
            });
        }
        
        return newHistory;
      });
    });
  }

  return (
    <ResultsContext.Provider value={{ results, history }}>
      <ToastContainer theme={theme} />
      {children}
    </ResultsContext.Provider>
  );
}

export type TestGroupResults = {
  test_group?: string;
  summary?: TestSummary;
  modules?: TestModule[];
}

export type TestSummary = {
  total: number;
  passed: number;
  failed: number;
  ignored: number;
  duration: number;
}

export type TestModule = {
  module: string;
  tests: TestCase[];
}

export type TestCase = {
  test: string;
  result: "pass" | "fail" | "ignore";
  cycle_count: number;
  location?: string;
  message?: string;
}
