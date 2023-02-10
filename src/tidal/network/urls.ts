import { BASE_URL } from '../utils/constants';
import { USER_ID } from '../utils/secrets';

export // urls are probably subject to change as i've collected them by simple manual scraping
  const URLS = {
    // you may changed useless params such as countryCode etc, but the request is rejected without them
    searchAPIURL: (trackName: string) => `${BASE_URL}/v1/search/top-hits?query=${trackName}&limit=3&offset=0&types=ARTISTS,ALBUMS,TRACKS,VIDEOS,PLAYLISTS&includeContributors=true&countryCode=IL&locale=en_US&deviceType=BROWSER`,
    // used to filter out tracks that are already in your collection
    // note the 5000 limit - its not validated server side, so you're free to set whatever you want
    collectionAPIURL: () => `https://listen.tidal.com/v1/users/${USER_ID}/favorites/tracks?offset=0&limit=5000&order=DATE&orderDirection=DESC&countryCode=IL&locale=en_US&deviceType=BROWSER`,
    generateTrackURLFromID: (id: number) => `${BASE_URL}/track/${id}`,
    addToCollection: () => `${BASE_URL}/v1/users/${USER_ID}/favorites/tracks?countryCode=IL&locale=en_US&deviceType=BROWSER`,
  };