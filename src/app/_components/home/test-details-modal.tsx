"use client"

import React, { useEffect } from 'react';
import { useResults } from '../results-provider';
import { brand_font } from '@/app/fonts';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { VscSyncIgnored } from 'react-icons/vsc';

type Props = {
  title: string;
  test: any,
  isOpen: boolean;
  onClose: (timestamp?: number) => void;
}

const TestDetailsModal = ({ title, test, isOpen, onClose }: Props) => {

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
        <div className="w-full flex flex-row justify-between items-between p-3 border-b-container-2">
          <h5>Test Details</h5>
          <button
            className="text-4xl absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => onClose()}>
            &times;
          </button>
        </div>
        <div className="w-full overflow-auto">
          <div className={`border-b-container-2 px-3 py-2 flex flex-col ${brand_font.className}`}>
            <span className="text-xs">{test.module}</span>
            <span className="text-sm">{test.test}</span>
          </div>
          <div className="p-3">
            <div className="w-full flex items-center justify-center">
              {test.result === "pass" && (
                <div className="bg-success text-container px-2 py-1 rounded-xl flex flex-row items-center gap-1">
                  <FaThumbsUp size={13} />
                  <span className="text-container text-xs px-1">PASS</span>
                </div>
              )}
              {test.result === "ignore" && (
                <div className="bg-warning text-container px-2 py-1 rounded-xl flex flex-row items-center gap-1">
                  <VscSyncIgnored size={13} />
                  <span className="text-container text-xs px-1">IGNORE</span>
                </div>
              )}
              {test.result === "fail" && (
                <div className="bg-danger text-container px-2 py-1 rounded-xl flex flex-row items-center gap-1">
                  <FaThumbsDown size={13} />
                  <span className="text-container text-xs px-1">FAIL</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-3 border-t-container-2 flex flex-col">
            <span>Test Group</span>
            <span className="text-sm">{test.group}</span>
            
            {test.result === "fail" && (
              <>
                <span className="mt-3">Error Message</span>
                <span className="text-sm text-danger">{test.message}</span>

                <span className="mt-3">Location</span>
                <span className="text-sm">{test.location}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsModal;