import { getTracksInCollection } from '../tidal/network/get-tracks';

export async function main() {
  const tidalTracks = await getTracksInCollection();
}