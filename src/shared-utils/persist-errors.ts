import { writeFile } from 'fs/promises';

export async function persistErrors(filePath: string, data: any, errorLog: string) {
  console.log(errorLog);

  return writeFile(filePath, JSON.stringify(data), 'utf8');
}
