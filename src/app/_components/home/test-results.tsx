"use client"

import { brand_font } from "@/app/fonts";
import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaLayerGroup } from "react-icons/fa";
import { GrDocumentTest } from "react-icons/gr";
import { VscSyncIgnored } from "react-icons/vsc";
import { useResults } from "../results-provider";

export default function TestResults() {
  const { results } = useResults();
  const [metrics, setMetrics] = useState<Metric[]>(DEFAULT_METRICS);

  useEffect(() => {
    getMetric("Groups")!.value = results.length;

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let ignoredTests = 0;

    results.forEach((group) => {
      if (group.modules) {
        group.modules.forEach((module) => {
          if (module.tests) {
            totalTests += module.tests.length;
            module.tests.forEach((test) => {
              switch (test.result) {
                case "pass":
                  passedTests++;
                  break;
                case "fail":
                  failedTests++;
                  break;
                case "ignore":
                  ignoredTests++;
                  break;
              }
            });
          }
        });
      }
    });

    getMetric("Tests")!.value = totalTests;
    getMetric("Passed")!.value = passedTests;
    getMetric("Failed")!.value = failedTests;
    getMetric("Ignored")!.value = ignoredTests;

    setMetrics([...metrics]);
  }, [results]);

  function getMetric(name: string): Metric | undefined {
    return metrics.find((metric) => metric.name === name);
  }

  return (
    <div className={`grid grid-cols-5 gap-3 mb-4`}>
      {metrics.map((metric) => (
        <div key={metric.name.toString()} className="bg-container border-container-2 rounded-lg px-4 py-2 text-center flex flex-row">
          <div className={`w-full h-full flex items-center text-4xl ${metric.colorClass}`}>
            {metric.icon}
          </div>
          <div className="flex flex-col items-end">
            <h5 className="text-lg font-normal">{metric.name}</h5>
            <p className={`text-4xl font-normal ${brand_font.className}`}>{metric.value.toFixed(0)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

type Metric = {
  name: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
};

const DEFAULT_METRICS: Metric[] = [
  {
    name: "Groups",
    value: 0,
    icon: <FaLayerGroup />,
    colorClass: "text-primary"
  },
  {
    name: "Tests",
    value: 0,
    icon: <GrDocumentTest />,
    colorClass: "text-primary"
  },
  {
    name: "Passed",
    value: 0,
    icon: <FaThumbsUp />,
    colorClass: "text-success"
  },
  {
    name: "Failed",
    value: 0,
    icon: <FaThumbsDown />,
    colorClass: "text-danger"
  },
  {
    name: "Ignored",
    value: 0,
    icon: <VscSyncIgnored />,
    colorClass: "text-warning"
  }
];
