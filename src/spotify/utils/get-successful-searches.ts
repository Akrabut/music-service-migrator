import { readFile } from 'fs/promises';
import type { MappedSpotifyEntry } from '../types/mapped-entry';

const SUCCESSFUL_SEARCHES_PATH = './successful-spotify-searches.json';

export async function readEntryMapFile(): Promise<MappedSpotifyEntry | {}> {
  try {
    return JSON.parse(await readFile(SUCCESSFUL_SEARCHES_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}
