"use client"

import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "../theme-provider";
import { brand_font } from "../../fonts";
import { useResults } from "../results-provider";
import { toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import TestHistoryModal from "./test-history-modal";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { results, timestamp, history, isOnline, loadResults } = useResults();

  const [testTime, setTestTime] = useState<string>("N/A");
  const [isTestHistoryModalOpen, setIsTestHistoryModalOpen] = useState(false);

  useEffect(() => {
    calculateTestTime(timestamp);
  }, [timestamp]);

  function copyResults() {
    navigator.clipboard.writeText(JSON.stringify(results));
    toast.success("Results copied to clipboard!");
  }

  function appLogo(): React.ReactNode {
    return <span className={`text-2xl ${brand_font.className}`}>kview</span>;
  }

  function copyJsonButton(): React.ReactNode {
    return (
      <button onClick={copyResults} className="px-2.5 py-1 rounded-full text-sm bg-container border-container-2">
        Copy JSON
      </button>
    );
  }

  function themeToggleButton(): React.ReactNode {
    const currentState = THEME_TOGGLE_STATES.find(state => state.id === theme);
    return (
      <button onClick={toggleTheme} className="p-2 rounded-full bg-container border-container-2">
        {currentState?.icon}
      </button>
    );
  }

  function calculateTestTime(timestamp: number) {
    const latestTime = new Date(timestamp);
    let formattedLatestTime = latestTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    setTestTime(formattedLatestTime);
  }

  function resultsTestTime(): React.ReactNode {
    return (
      <div className="bg-surface rounded-lg py-0.5 flex flex-col items-start">
        <span className="font-bold text-xs">Tested At</span>
        <span className="-mt-0.5 text-sm">{testTime}</span>
      </div>
    );
  }

  function testHistory(): React.ReactNode {
    return (
      <button className="px-2.5 py-1 rounded-full text-sm bg-container border-container-2" onClick={() => setIsTestHistoryModalOpen(true)}>
          Test History
      </button>
    );
  }

  function onTestHistoryModalClose(timestamp?: number) {
    setIsTestHistoryModalOpen(false);
    if (timestamp) {
      console.log("Selected timestamp from history modal:", timestamp);
      loadResults(timestamp);
      calculateTestTime(timestamp);
    }
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="h-full flex flex-row items-center bg-surface rounded-lg py-1.5 px-5">
        {appLogo()}
      </div>
      
      <div className="flex flex-row gap-3">
        <div className="grow flex flex-row items-center justify-between bg-surface rounded-lg py-1.5 px-5">
          {!isOnline && (
            <div className="flex flex-row items-center gap-2">
              <div className="rounded-full bg-danger w-4 h-4"></div>
              <span className="text-danger font-bold text-sm">Offline Monitor</span>
            </div>
          )}
          {isOnline && results.length > 0 && (
            <div className="flex flex-row items-center gap-2">
              <BounceLoader size={14} color="#4bb543" />
              <span className="text-success font-bold text-sm">Live Monitor</span>
            </div>
          )}
        </div>
        <div className="grow flex flex-row items-center justify-between bg-surface rounded-lg py-1.5 px-5 gap-3">
          {resultsTestTime()}
          {testHistory()}
        </div>
        <div className="bg-surface rounded-lg py-1.5 px-5 flex flex-row items-center gap-3">
          {copyJsonButton()}
          {themeToggleButton()}
        </div>
      </div>
      <TestHistoryModal title="Test History" isOpen={isTestHistoryModalOpen} onClose={(timestamp) => onTestHistoryModalClose(timestamp)} />
    </div>
  );
}

type ToggleState = {
  id: string;
  icon: React.ReactNode;
};

const THEME_TOGGLE_STATES: ToggleState[] = [
  {
    id: "light",
    icon: <IoSunnyOutline size={16} />
  },
  {
    id: "dark",
    icon: <IoMoonOutline size={16} />
  }
];
