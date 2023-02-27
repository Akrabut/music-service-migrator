import { fetchWithHeaders } from '../../shared-utils/fetch-with-headers';
import { URLs } from '../network/urls';

async function save50Tracks(trackIds: string[]) {
  const url = URLs.saveTracksForCurrentUser();
  const response = await fetchWithHeaders(url, 'spotify', 'PUT', JSON.stringify({ ids: trackIds }));
  // const data = await response.json();

  return response;
}


export async function saveTracksForCurrentUser(trackIds: string[]) {
  let saveTasks = [];
  for (let i = 0; i < trackIds.length; i += 50) {
    const trackIds50 = trackIds.slice(i, i + 50);
    saveTasks.push(save50Tracks(trackIds50));
  }
  
  const responses = await Promise.all(saveTasks);
  
  const successfulResponses = responses.filter(res => res.ok);

  console.log(`Saved up to ${50 * successfulResponses.length} tracks for current user`);
}
