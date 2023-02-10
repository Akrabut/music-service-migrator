import { BASE_URL } from '../utils/constants';

export const URLS = {
    tidalSearchAPIURL: (trackName: string) => `${BASE_URL}/search?q=${trackName}&type=track&limit=1&offset=0`,
    // used to filter out tracks that are already in your collection
    // collectionAPIURL: () => `https://listen.tidal.com/v1/users/${USER_ID}/favorites/tracks?offset=0&limit=5000&order=DATE&orderDirection=DESC&countryCode=IL&locale=en_US&deviceType=BROWSER`,
    // generateTrackURLFromID: (id: number) => `${BASE_TIDAL_URL}/track/${id}`,
    // addToCollection: () => `${BASE_TIDAL_URL}/v1/users/${USER_ID}/favorites/tracks?countryCode=IL&locale=en_US&deviceType=BROWSER`,
  };