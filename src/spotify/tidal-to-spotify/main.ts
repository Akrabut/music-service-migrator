import { getTracksWithArtistsFromCollection } from '../../tidal/network/get-tracks';
import { tracksToSpotifyIDs } from './tracks-to-spotify-ids';
import { saveTracksForCurrentUser } from './save-tracks-for-user';
import { readEntryMapFile } from '../utils/get-successful-searches';


export async function main() {
  // const tidalTracks = await getTracksWithArtistsFromCollection();
  // const spotifyIDs = await tracksToSpotifyIDs(tidalTracks);
  const entries = await readEntryMapFile();
  await saveTracksForCurrentUser(Object.keys(entries));
}