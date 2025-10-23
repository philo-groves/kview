import TestBreakdown from "./_components/home/test-breakdown";
import TestResults from "./_components/home/test-results";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <TestResults />
      <TestBreakdown />
    </div>
  );
}
