"use client"

import { useEffect, useState } from "react";
import DropdownInput, { DropdownInputOption } from "../input/dropdown-input";
import { useResults } from "../results-provider";
import { brand_font } from "@/app/fonts";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { VscSyncIgnored } from "react-icons/vsc";
import TestDetailsModal from "./test-details-modal";

export default function TestBreakdown() {
  const { results } = useResults();

  const [testGroups, setTestGroups] = useState<DropdownInputOption[]>([]);
  const [modules, setModules] = useState<DropdownInputOption[]>([]);

  const [selectedTestGroups, setSelectedTestGroups] = useState<string | string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | string[]>("all");

  const [selectedTest, setSelectedTest] = useState<any>({});
  const [isTestDetailsModalOpen, setIsTestDetailsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const newTestGroups = new Set<DropdownInputOption>();
    const newModules = new Set<DropdownInputOption>();
    newModules.add({ value: "all", label: "All Modules" });

    results.forEach((group) => {
      if (group.modules) {
        group.modules.forEach((module) => {
          newModules.add({ value: module.module, label: module.module });
          newTestGroups.add({ value: group.test_group || "default", label: group.test_group || "default" });
        });
      }
    });

    setTestGroups(Array.from(newTestGroups));
    setSelectedTestGroups(Array.from(newTestGroups).map(tg => tg.value));
    setModules(Array.from(newModules));
  }, [results]);

  function getFilteredTests() {
    // convert grouped tests into a flat list of tests
    let tests: TestResult[] = [];
    results.forEach(group => {
      if (selectedTestGroups.includes(group.test_group || "default")) {
        group.modules?.forEach(module => {
          // Filter by module if not "all"
          if (selectedModule === "all" || selectedModule === module.module) {
            module.tests.forEach(test => {
              tests.push({
                group: group.test_group || "default",
                module: module.module,
                test: test.test,
                result: test.result,
                message: test.message,
                location: test.location
              });
            });
          }
        });
      }
    });

    tests.sort((a, b) => {
      const resultOrder = { "fail": 0, "ignore": 1, "pass": 2 };
      return resultOrder[a.result as keyof typeof resultOrder] - resultOrder[b.result as keyof typeof resultOrder];
    });

    return tests;
  }

  function hasPasses() {
    return getFilteredTests().some(test => test.result === "pass");
  }

  function passesCount() {
    return getFilteredTests().filter(test => test.result === "pass").length;
  }

  function hasIgnores() {
    return getFilteredTests().some(test => test.result === "ignore");
  }

  function ignoresCount() {
    return getFilteredTests().filter(test => test.result === "ignore").length;
  }

  function hasFailures() {
    return getFilteredTests().some(test => test.result === "fail");
  }

  function failuresCount() {
    return getFilteredTests().filter(test => test.result === "fail").length;
  }

  function handleTestClick(test: TestResult) {
    setSelectedTest(test);
    setIsTestDetailsModalOpen(true);
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-3 -mt-1.5">Test Breakdown</h3>
      <div className="grid grid-cols-6 gap-3 grow">

        <div className="col-span-2">
          <div className="bg-container border-container-2 rounded-lg">
            <h5 className="p-3">Filters</h5>
            <div className="w-full flex flex-col gap-3 border-t-container-2 px-3 py-5">
              <DropdownInput name="test_groups" 
                  label="Test Groups" 
                  options={testGroups} 
                  multiple={true}
                  value={selectedTestGroups}
                  onChange={(value) => setSelectedTestGroups(value)}
              />
              <DropdownInput name="modules" 
                  label="Module" 
                  options={modules}
                  value={selectedModule}
                  onChange={(value) => setSelectedModule(value)} />
            </div>
          </div>
        </div>

        <div className="h-full bg-container border-container-2 col-span-4 rounded-lg overflow-hidden">
          <div className="p-3">
            <div className="flex flex-row justify-between items-center gap-3">
              <h5>Tests</h5>
              <div className="flex flex-row gap-2">
                <span className="text-xs bg-container-almost border-primary px-2 py-1 rounded-full">{getFilteredTests().length}</span>
                {hasPasses() && <span className="text-xs bg-container-almost border-success px-2 py-1 rounded-full">{passesCount()}</span>}
                {hasIgnores() && <span className="text-xs bg-container-almost border-warning px-2 py-1 rounded-full">{ignoresCount()}</span>}
                {hasFailures() && <span className="text-xs bg-container-almost border-danger px-2 py-1 rounded-full">{failuresCount()}</span>}
              </div>
            </div>
          </div>
          <div className="w-full h-full border-t-container-2 overflow-auto test-list">
            {getFilteredTests().map((test, index) => 
              <div key={index} onClick={() => handleTestClick(test)} className={`px-3 py-1 border-b-container-2 cursor-pointer bg-container-low-hover last:border-0 flex flex-row gap-3 items-center justify-between ${index % 2 === 1 ? 'bg-container-almost' : ''}`}>
                <div className="min-w-[150px]">
                  <div className="text-sm">
                    <span className={`bg-container ${index % 2 === 0 ? 'bg-container-almost' : ''} px-2 py-0.5 ellipsis`}>{test.group}</span>
                  </div>
                </div>
                <div className="grow">
                  <div className={`text-xs ${brand_font.className}`}>{test.module}</div>
                  <div className={`text-sm w-full ${brand_font.className}`}>{test.test}</div>
                </div>
                
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
            )}
          </div>
        </div>
      </div>
      <TestDetailsModal
        test={selectedTest}
        title="Test Details"
        isOpen={isTestDetailsModalOpen}
        onClose={() => setIsTestDetailsModalOpen(false)}
      />
    </div>
  );
}

type TestResult = {
  group: string;
  module: string;
  test: string;
  result: string;
  message?: string;
  location?: string;
}