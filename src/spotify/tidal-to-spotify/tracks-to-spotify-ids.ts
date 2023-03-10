import { fetchWithHeaders } from '../../shared-utils/fetch-with-headers';
import { URLs } from '../network/urls';
import type { SearchResponse } from '../types/search-response';
import type { MappedSpotifyEntry } from '../types/mapped-entry';
import { readFile, writeFile } from 'fs/promises';

function filterTracksWithNoResults(data: SearchResponse[]) {
  console.log(`Successfully converted ${data.length} tracks to Spotify IDs.`);
  const filteredData = data.filter((response) => response.tracks.items && response.tracks.items.length > 0);

  if (data.length !== filteredData.length) console.log(`Filtered out ${data.length - filteredData.length} tracks with no results.`);

  return filteredData.map((response) => response.tracks.items![0].id);
}

const trackHasID = (track: SearchResponse) => track.tracks.items && track.tracks.items.length > 0 && track.tracks.items[0].id;
const trackHasName = (track: SearchResponse) => track.tracks.items && track.tracks.items.length > 0 && track.tracks.items[0].name;
const trackHasArtist = (track: SearchResponse) => track.tracks.items && track.tracks.items.length > 0 && track.tracks.items[0].artists && track.tracks.items[0].artists[0].name;
const trackHasData = (track: SearchResponse) => trackHasID(track) && trackHasName(track) && trackHasArtist(track);

const ENTRY_MAP_FILE = './successful-spotify-searches.json';

async function readEntryMapFile(): Promise<MappedSpotifyEntry | {}> {
  try {
    return JSON.parse(await readFile(ENTRY_MAP_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function mapIfEligible(map: MappedSpotifyEntry, res: SearchResponse) {
  if (trackHasData(res)) {
    const track = res.tracks.items![0];
    map[track.id] = {
      name: track.name.toLowerCase(),
      artist: track.artists![0].name.toLowerCase(),
    };
  } else {
    console.log(`Track has no data: ${JSON.stringify(res)}`);
  }

  return map;
}

async function writeDebugMap(responses: SearchResponse[]) {
  const map = responses.reduce((map: MappedSpotifyEntry, res) => {
    if (trackHasID(res)) {
      const track = res.tracks.items![0];
      map[track.id] = {
        name: trackHasName(res) ? track.name.toLowerCase() : 'no name',
        artist: trackHasArtist(res) ? track.artists![0].name.toLowerCase() : 'no artist',
      };
    }

    return map;
  }, {});

  await writeFile('./unmapped.json', JSON.stringify(map), 'utf8');
}

async function persistSuccessfulRequests(responses: SearchResponse[]) {
  const previouslyMappedEntries = await readEntryMapFile();
  console.log(`Already had ${Object.keys(previouslyMappedEntries).length} entries mapped.`);
  console.log(`Persisting ${responses.length} successful Spotify search requests...`);
  await writeDebugMap(responses);

  const mappedEntries = responses.reduce((map: MappedSpotifyEntry, res) => mapIfEligible(map, res), {});

  const mergedEntries = { ...previouslyMappedEntries, ...mappedEntries };

  console.log(`Will now have ${Object.keys(mergedEntries).length} entries mapped.`);

  return writeFile(ENTRY_MAP_FILE, JSON.stringify(mergedEntries), 'utf8');
}

function normalizeTrackString(track: string) {
  return track.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

async function filterTracksAlreadyMapped(tracks: string[]) {
  const previouslyMappedEntries = await readEntryMapFile();

  const mappedEntries = Object.values(previouslyMappedEntries);

  const entrySet = new Set(mappedEntries.map(entry => normalizeTrackString(`${entry.artist}${entry.name}`)));
  mappedEntries.forEach(entry => entrySet.add(`${normalizeTrackString(`${entry.name}${entry.artist}`)}`));
  const unfilteredTracks = tracks.filter(track => !entrySet.has(normalizeTrackString(track)));

  // const harta = normalizeTrackString(`${previouslyMappedEntries['74slG4tYY6qWp52DFZtT2U'].artist}${previouslyMappedEntries['74slG4tYY6qWp52DFZtT2U'].name}`);
  // console.log(harta);
  // console.log(entrySet.has(harta));

  console.log(`Filtered out ${tracks.length - unfilteredTracks.length} tracks that were already mapped.`);

  return unfilteredTracks;
}

async function sampleFailingRequestErrorMessage(responses: Response[]) {
  const json = await responses.find(res => !res.ok)!.json();
  console.log(`Sample error message: ${JSON.stringify(json)}`);
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
  
  if (responses.length > 0 && data.length !== responses.length) {
    await sampleFailingRequestErrorMessage(responses);
  }

  const filteredData = filterTracksWithNoResults(data);

  return filteredData;
}
