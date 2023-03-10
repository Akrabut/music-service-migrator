import { fetchWithHeaders } from '../../shared-utils/fetch-with-headers';
import { URLs } from '../network/urls';
import { execSync } from 'child_process';
import { appendFile } from 'fs/promises';

async function save50Tracks(trackIds: string[]) {
  const url = URLs.saveTracksForCurrentUser();
  const response = await fetchWithHeaders(url, 'spotify', 'PUT', JSON.stringify({ ids: trackIds }));
  // const data = await response.json();

  return response;
}

async function sleepFor30Seconds() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 30000);
  });
}


export async function saveTracksForCurrentUser(trackIds: string[]) {
  // const saveTasks = [];
  const responses = [];
  for (let i = 0; i < trackIds.length; i += 50) {
    const trackIds50 = trackIds.slice(i, i + 50);

    const res = await save50Tracks(trackIds50);
    await appendFile('./save-tracks.log', `${res.ok ? 'SUCCESS' : 'FAILURE'}: ${JSON.stringify(trackIds50)}\n`);
    responses.push(res);

    // delay to avoid rate limiting
    await sleepFor30Seconds();
  }
  
  // const responses = await Promise.all(saveTasks);
  
  const successfulResponses = responses.filter(res => res.ok);

  console.log(`Saved up to ${50 * successfulResponses.length} tracks for current user`);
}
