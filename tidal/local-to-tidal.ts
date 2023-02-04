import { getLocalTrackList } from '../local/get-local-tracks';
import { getTrackIds, getTracksInCollection } from './get-tracks';
import { filterFailedIDResults } from './utils';
import { addToCollection } from './add-to-collection';
import { persistErrors } from '../shared-utils/persist-errors';

const failedIDRequests: string[] = [];

export async function main() {
  const trackList = await getLocalTrackList();
  const trackIDs = await getTrackIds(trackList, failedIDRequests);
  const tracksInCollectionSet = await getTracksInCollection();
  console.log(`Got ${trackIDs.length} track ID responses`);

  const failedTrackIDRequests = trackIDs.filter(item => item.status === 'rejected');
  await persistErrors('./failed-additions.json', failedTrackIDRequests, `Failed to get ID for ${failedTrackIDRequests.length} tracks`);

  const successfulTrackIDRequests = filterFailedIDResults(trackIDs);
  console.log(`Found ${successfulTrackIDRequests.length} tracks`);

  console.log(`Filtering out ${tracksInCollectionSet.size} tracks that are already in collection`);
  const filteredIDs = successfulTrackIDRequests.filter(item => !tracksInCollectionSet.has(item));
  console.log(`Found ${filteredIDs.length} tracks that are not in collection`);

  await addToCollection(filteredIDs);

  await persistErrors('./failed-id-requests.json', failedIDRequests, `Failed to get IDs for ${failedIDRequests.length} tracks, see ./failedIDRequests for the name list`);
}
