import { fetchWithHeaders } from '../../shared-utils/fetch-with-headers';
import { URLs } from '../network/urls';
import type { SearchResponse } from '../types/search-response';
import { readFile, writeFile } from 'fs/promises';

function filterTracksWithNoResults(data: SearchResponse[]) {
  console.log(`Successfully converted ${data.length} tracks to Spotify IDs.`);
  const filteredData = data.filter((response) => response.tracks.items && response.tracks.items.length > 0);
  console.log(`Filtered out ${data.length - filteredData.length} tracks with no results.`);

  return filteredData.map((response) => response.tracks.items![0].id);
}

type MappedSpotifyEntry = {
  [id: string]: {
    name: string;
    artist: string;
  }
}

const trackHasData = (track: SearchResponse) => track.tracks.items && track.tracks.items.length > 0 && track.tracks.items[0].id && track.tracks.items[0].name && track.tracks.items[0].artists && track.tracks.items[0].artists[0].name;

const ENTRY_MAP_FILE = './successful-spotify-searches.json';

async function readEntryMapFile(): Promise<MappedSpotifyEntry | {}>  {
  try {
    return JSON.parse(await readFile(ENTRY_MAP_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

async function persistSuccessfulRequests(responses: SearchResponse[]) {
  console.log(`Persisting ${responses.length} successful Spotify search requests...`);
  const previouslyMappedEntries = await readEntryMapFile();

  const mappedEntries = responses.reduce((map: MappedSpotifyEntry, res) => {
    if (trackHasData(res))
      map[res.tracks.items![0].id] = {
        name: res.tracks.items![0].name,
        artist: res.tracks.items![0].artists![0].name,
      };

    return map;
  }, {});

  const mergedEntries = { ...previouslyMappedEntries, ...mappedEntries };
  console.log(`Will now have ${Object.keys(mergedEntries).length} entries mapped.`);

  return writeFile(ENTRY_MAP_FILE, JSON.stringify(mergedEntries), 'utf8');
}

async function filterTracksAlreadyMapped(tracks: string[]) {
  const previouslyMappedEntries = await readEntryMapFile();

  const mappedEntries = Object.values(previouslyMappedEntries);

  const entrySet = new Set(mappedEntries.map(entry => `${entry.artist} - ${entry.name}`));
  const filteredTracks = tracks.filter(track => !entrySet.has(track));

  console.log(`Filtered out ${tracks.length - filteredTracks.length} tracks that were already mapped.`);

  return filteredTracks;
}

export async function tracksToSpotifyIDs(tracks: string[]) {
  console.log(`Originally had ${tracks.length} tracks.`);
  const filteredTracks = await filterTracksAlreadyMapped(tracks);
  console.log(`Converting ${filteredTracks.length} tracks to Spotify IDs...`);

  // cant be bothered to deal with spotify's rate limiting, so just shuffle the tracks and assume that after enough runs everything will go through
  // const shuffledTracks = tracks.sort((_1, _2) => 0.5 - Math.random());

  const responses = await Promise.all(filteredTracks.map(async (track) => fetchWithHeaders(URLs.searchAPIURL(track), 'spotify')));


  const data: SearchResponse[] = await Promise.all(responses.filter(res => res.ok).map(async (response) => response.json()));
  await persistSuccessfulRequests(data);

  const filteredData = filterTracksWithNoResults(data);

  return filteredData;
}
