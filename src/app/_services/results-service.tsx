export async function getHistory(): Promise<ApiResult<any>> {
  try {
    const res = await fetch('/api/history', { next: { revalidate: 1 } });
    if (!res.ok) {
      return {
        success: false,
        error: `Failed to fetch history: ${res.statusText}`,
        status: res.status
      };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getResults(timestamp: number): Promise<ApiResult<any>> {
  try {
    const res = await fetch(`/api/results?timestamp=${timestamp}`, { next: { revalidate: 1 } });
    if (!res.ok) {
      return {
        success: false,
        error: `Failed to fetch results: ${res.statusText}`,
        status: res.status
      };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export type ApiResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  status?: number;
};
