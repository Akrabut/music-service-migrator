import { fetchWithHeaders } from '../../shared-utils/fetch-with-headers';
import { URLs } from './urls';

export async function addToCollection(trackIds: number[]) {
  return Promise.allSettled(trackIds.map(async (trackId) => {
    try {
      await fetchWithHeaders(URLs.addToCollection(), 'tidal', 'POST', `trackIds=${trackId}&onArtifactNotFound=FAIL`);
      // api responds with an empty 200
      console.log(`added ${trackId} to collection`);

    } catch (e) {
      console.log(e);

      return `${trackId} NOT ADDED!`;
    }
  }));
}
