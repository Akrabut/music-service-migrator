import { headersWithToken } from '../utils/filter-results';
import { URLS } from './urls';

export async function addToCollection(trackIds: number[]) {
  return Promise.allSettled(trackIds.map(async (trackId) => {
    try {
      await fetch(URLS.addToCollection(), {
        method: 'POST',
        // wtf is wrong with you tidal backend devs?
        body: `trackIds=${trackId}&onArtifactNotFound=FAIL`,
        headers: headersWithToken(),
      });
      // api responds with an empty 200
      console.log(`added ${trackId} to collection`);

    } catch (e) {
      console.log(e);

      return `${trackId} NOT ADDED!`;
    }
  }));
}
