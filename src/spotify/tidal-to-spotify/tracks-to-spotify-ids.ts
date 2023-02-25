import { fetchWithHeaders } from '../../shared-utils/fetch-with-headers';
import { URLs } from '../network/urls';
import type { SearchResponse } from '../types/search-response';
import { writeFile, appendFile } from 'fs/promises';

function filterTracksWithNoResults(data: SearchResponse[]) {
  console.log(`Converted ${data.length} tracks to Spotify IDs.`);
  const filteredData = data.filter((response) => response.tracks.items && response.tracks.items.length > 0);
  console.log(`Filtered out ${data.length - filteredData.length} tracks with no results.`);

  return filteredData.map((response) => response.tracks.items![0].id);
}

function persistFailedRequests(responses: Response[]) {
  console.log(`Persisting ${responses.length} failed Spotify search requests...`);

  return writeFile('./failed-spotify-searches.json', JSON.stringify(responses), 'utf8');
}

export async function tracksToSpotifyIDs(tracks: string[]) {
  console.log(`Converting ${tracks.length} tracks to Spotify IDs...`);
  
  // cant be bothered to deal with spotify's rate limiting, so just shuffle the tracks and assume that after enough runs everything will go through
  const shuffledTracks = tracks.sort((_1, _2) => 0.5 - Math.random());
  const responses = await Promise.all(shuffledTracks.map(async (track) => fetchWithHeaders(URLs.searchAPIURL(track), 'spotify')));
  // const wtf = await responses[0].json();
  // console.log(wtf);
  // console.log(tracks[0]);
  
  
  
  const failedResponses = responses.filter(res => !res.ok);
  await persistFailedRequests(failedResponses);
  
  const data: SearchResponse[] = await Promise.all(responses.filter(res => res.ok).map(async (response) => response.json()));
  const filteredData = filterTracksWithNoResults(data);
  // await appendFile('spotify-ids.json', filteredData.join('\n'), 'utf8');

  return filteredData;
}
