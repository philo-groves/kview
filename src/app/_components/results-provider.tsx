"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { getHistory, getResults } from "../_services/results-service";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./theme-provider";

type ResultsContextType = {
  results: TestGroupResults[],
  timestamp: number,
  history: number[],
  isOnline: boolean,
  loadResults: (timestamp: number) => Promise<void>,
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
  const [timestamp, setTimestamp] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    refreshHistory();
    const interval = setInterval(() => {
      refreshHistory();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function refreshHistory() {
    getHistory().then((newHistoryResult) => {
      if (newHistoryResult.success) {
        const newHistory = newHistoryResult.data;
        setHistory((currentHistory) => {
          let latestTimestamp = currentHistory.length > 0 ? currentHistory[0] : 0;
          let newLatestTimestamp = newHistory.length > 0 ? newHistory[0] : 0;

          if (newLatestTimestamp > latestTimestamp) {
            getResults(newLatestTimestamp)
              .then((newResultsResult) => {
                if (newResultsResult.success) {
                  setIsOnline(() => true);
                  setTimestamp(newLatestTimestamp);
                  setResults(newResultsResult.data);
                } else {
                  console.error('Error fetching new results:', newResultsResult.error);
                  setIsOnline(() => false);
                }
              });
            }
          return newHistory;
        });
      } else {
        console.error('Error fetching history:', newHistoryResult.error);
        setIsOnline(() => false);
      }
    });
  }
  
  function loadResults(timestamp: number) {
    return getResults(timestamp)
      .then((newResultsResult) => {
        console.log("Loaded results for timestamp:", newResultsResult);
        if (newResultsResult.success) {
          setIsOnline(() => true);
          setTimestamp(timestamp);
          setResults(newResultsResult.data);
        }
      });
  }

  return (
    <ResultsContext.Provider value={{ results, timestamp, history, isOnline, loadResults }}>
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
