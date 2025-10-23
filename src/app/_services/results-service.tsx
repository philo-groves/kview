export async function getHistory() {
  const res = await fetch('/api/history', { next: { revalidate: 1 } });
  if (!res.ok) {
    throw new Error('Failed to fetch history');
  }
  return res.json();
}

export async function getResults(timestamp: number) {
  const res = await fetch(`/api/results?timestamp=${timestamp}`, { next: { revalidate: 1 } });
  if (!res.ok) {
    throw new Error('Failed to fetch results');
  }
  return res.json();
}
