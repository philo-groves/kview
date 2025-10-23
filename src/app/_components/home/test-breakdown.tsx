"use client"

import { useEffect, useState } from "react";
import DropdownInput, { DropdownInputOption } from "../input/dropdown-input";
import { useResults } from "../results-provider";
import { group } from "console";
import { brand_font } from "@/app/fonts";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { VscSyncIgnored } from "react-icons/vsc";

export default function TestBreakdown() {
  const { results } = useResults();

  const [testGroups, setTestGroups] = useState<DropdownInputOption[]>([]);
  const [modules, setModules] = useState<DropdownInputOption[]>([]);

  const [selectedTestGroups, setSelectedTestGroups] = useState<string | string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | string[]>("all");

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
                message: test.message
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
          <h5 className="p-3">Tests</h5>
          <div className="w-full h-full border-t-container-1 overflow-auto test-list">
            {getFilteredTests().map((test, index) => 
              <div key={index} className="px-3 py-1 border-t-container-1 last:border-0 flex flex-row gap-3 items-center justify-between">
                <div className="min-w-[150px]">
                  <div className="text-sm">
                    <span className="rounded-xl border-container-2 px-2 py-0.5 ellipsis">{test.group}</span>
                  </div>
                </div>
                <div className="grow">
                  <div className={`mt-1 text-xs ${brand_font.className}`}>{test.module}</div>
                  <div className={`-mt-0.5 w-full ${brand_font.className}`}>{test.test}</div>
                </div>
                
                {test.result === "pass" && (
                  <div className="bg-success text-container px-2 py-1 rounded-xl flex flex-row items-center gap-1">
                    <FaThumbsUp />
                    <span className="text-container text-xs px-1">PASS</span>
                  </div>
                )}
                {test.result === "ignore" && (
                  <div className="bg-warning text-container px-2 py-1 rounded-xl flex flex-row items-center gap-1">
                    <VscSyncIgnored />
                    <span className="text-container text-xs px-1">IGNORE</span>
                  </div>
                )}
                {test.result === "fail" && (
                  <div className="bg-danger text-container px-2 py-1 rounded-xl flex flex-row items-center gap-1">
                    <FaThumbsDown />
                    <span className="text-container text-xs px-1">FAIL</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type TestResult = {
  group: string;
  module: string;
  test: string;
  result: string;
  message?: string;
}