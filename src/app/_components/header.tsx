"use client"

import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "./theme-provider";
import { brand_font } from "../fonts";
import { useResults } from "./results-provider";
import { toast } from "react-toastify";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { results, history } = useResults();

  function copyResults() {
    navigator.clipboard.writeText(JSON.stringify(results));
    toast.success("Results copied to clipboard!");
  }

  function appLogo(): React.ReactNode {
    return <span className={`text-2xl mt-1 ${brand_font.className}`}>kview</span>;
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

  function calculateTestTime(): string {
    if (history.length < 1) {
      return "N/A";
    }

    const latestTime = new Date(history[0]);
    return latestTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function testTime(): React.ReactNode {
    return (
      <div className="bg-surface rounded-lg py-0.5 flex flex-col items-start">
        <span className="font-bold text-xs">Tested At</span>
        <span className="-mt-0.5 text-sm">{calculateTestTime()}</span>
      </div>
    );
  }

  function testHistory(): React.ReactNode {
    return (
      <button className="px-2.5 py-1 rounded-full text-sm bg-container border-container-2">
          Test History
      </button>
    );
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="h-full flex flex-row items-center bg-surface rounded-lg py-1.5 px-5">
        {appLogo()}
      </div>
      
      <div className="flex flex-row gap-3">
        <div className="grow flex flex-row gap-15 items-center justify-between bg-surface rounded-lg py-1.5 px-5">
          {testTime()}
          {/* {testHistory()} */}
        </div>
        <div className="bg-surface rounded-lg py-1.5 px-5 flex flex-row items-center gap-3">
          {copyJsonButton()}
          {themeToggleButton()}
        </div>
      </div>
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
