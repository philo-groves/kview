import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { readdirSync, statSync } from 'fs';

export async function GET(request: Request) {
  try {
    let { searchParams } = new URL(request.url);
    const timestampParam = searchParams.get('timestamp');

    let testing_directory = `${process.env.BUILD_DIRECTORY || '/ktest'}/testing-${timestampParam}`;
    const files = getAllFilesInDirectory(path.resolve(testing_directory));
    const results = await Promise.all(files.map(async (file) => {
      const fileData = await readFile(file, 'utf-8');
      return JSON.parse(fileData);
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read test results' }, { status: 500 });
  }
}

function getAllFilesInDirectory(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      getAllFilesInDirectory(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });
  return arrayOfFiles;
}
