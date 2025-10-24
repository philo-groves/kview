import { NextResponse } from 'next/server';
import path from 'path';
import { readdirSync } from 'fs';

export async function GET() {
  try {
    const timestamps = getTestingDirectories(path.resolve(process.env.BUILD_DIRECTORY || '/ktest'))
      .map(dir => Number.parseInt(dir.split('testing-')[1]))
      .sort((a, b) => b - a); // Sort timestamps in descending order
    
    return NextResponse.json(timestamps);
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read test results' }, { status: 500 });
  }
}

function getTestingDirectories(basePath: string): string[] {
  // check if basePath exists
  try {
    readdirSync(basePath);
  } catch (err) {
    return [];
  }

  const entries = readdirSync(basePath, { withFileTypes: true });
  const testingDirs = entries
    .filter(entry => entry.isDirectory() && entry.name.startsWith('testing-'))
    .map(entry => entry.name);

  if (testingDirs.length === 0) return [];

  // Sort directories by name and return the latest one
  testingDirs.sort();
  return testingDirs;
}
