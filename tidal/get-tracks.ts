import { headersWithToken } from './utils';
import { URLS } from './urls';
import { TOKEN } from './constants';

export async function getTrackIds(trackList: string[], failedIDRequests: string[]) {
  return Promise.allSettled(trackList.map(async (track) => {
    try {
      const response = await fetch(URLS.tidalSearchAPIURL(track), {
        headers: headersWithToken(TOKEN),
      });
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
  const response = await fetch(URLS.collectionAPIURL(), {
    headers: headersWithToken(TOKEN),
  });
  const data = await response.json();

  const trackIdsInCollection = data.items.map((track: any) => track.item.id);

  return new Set(trackIdsInCollection);
}