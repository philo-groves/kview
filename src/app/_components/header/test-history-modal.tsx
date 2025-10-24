"use client"

import React, { useEffect } from 'react';
import { useResults } from '../results-provider';

type Props = {
  title: string;
  isOpen: boolean;
  onClose: (timestamp?: number) => void;
}

const TestHistoryModal = ({ title, isOpen, onClose }: Props) => {
  const { history } = useResults();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  function formattedTestTime(baseTime: number): string {
    return new Date(baseTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-container rounded-lg border-container-2 shadow-lg max-w-md w-full">
        <div className="w-full flex flex-row justify-between items-between p-3">
          <h5>{title}</h5>
          <button
            className="text-4xl absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => onClose()}>
            &times;
          </button>
        </div>
        <div className="w-full max-h-[300px] overflow-auto">
          {history.length === 0 && (
            <div className="text-center text-sm text-gray-500 p-3">No test history available.</div>
          )}
          {history.length > 0 && (
            <ul className="max-h-96 overflow-y-auto">
              {history.map((timestamp, index) => <li key={timestamp} onClick={() => onClose(timestamp)} className={`p-3 border-t-container-2 py-2 bg-container-low-hover cursor-pointer ${index % 2 === 1 ? 'bg-container-almost' : ''}`}>{formattedTestTime(timestamp)}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestHistoryModal;