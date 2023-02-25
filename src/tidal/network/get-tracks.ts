import { fetchWithHeaders } from '../../shared-utils/fetch-with-headers';
import { URLs } from './urls';

export async function getTrackIds(trackList: string[], failedIDRequests: string[]) {
  return Promise.allSettled(trackList.map(async (track) => {
    try {
      const response = await fetchWithHeaders(URLs.searchAPIURL(track), 'tidal');
      const data = await response.json();

      // if (!track.toLowerCase().includes(data.tracks.items[0].title.toLowerCase())) {
      //   throw new Error(`Looked for ${track} but found ${data.tracks.items[0].title} which is not contained in the full track name, track hasn't been added`);
      // }

      // optimistic approach - the first result is probably the correct track
      return data.tracks.items[0].id;
    } catch (e) {
      console.log(`${track} - ${e}`);
      failedIDRequests.push(track);
    }
  }));
}

export async function getTracksInCollection() {
  const response = await fetchWithHeaders(URLs.collectionAPIURL(), 'tidal');
  const data = await response.json();
  const trackIdsInCollection = data.items.map((track: any) => track.item.id);

  return new Set(trackIdsInCollection as string[]);
}

export async function getTracksWithArtistsFromCollection() {
  const response = await fetchWithHeaders(URLs.collectionAPIURL(), 'tidal');
  const data = await response.json();

  return data.items.map((track: any) => `${track.item.artist.name} - ${track.item.title}`);
}