import { getTracksWithArtistsFromCollection } from '../../tidal/network/get-tracks';
import { tracksToSpotifyIDs } from './tracks-to-spotify-ids';
import { saveTracksForCurrentUser } from './save-tracks-for-user';


export async function main() {
  const tidalTracks = await getTracksWithArtistsFromCollection();
  const spotifyIDs = await tracksToSpotifyIDs(tidalTracks);
  await saveTracksForCurrentUser(spotifyIDs);
}