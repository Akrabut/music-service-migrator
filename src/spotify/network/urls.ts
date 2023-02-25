import { BASE_URL } from '../utils/constants';

export const URLs = {
  searchAPIURL: (trackName: string) => `${BASE_URL}/search?q=${encodeURIComponent(trackName)}&type=track&limit=1&offset=0`,
  getTracks: (trackIds: string[]) => `${BASE_URL}/tracks?ids=${trackIds.join(',')}`, // max 50
  saveTracksForCurrentUser: () => `${BASE_URL}/me/tracks`, // put, max 50
  getUserSavedTracks: (offset: number) => `${BASE_URL}/me/tracks?limit=50&offset=${offset}`, // max 50
};
