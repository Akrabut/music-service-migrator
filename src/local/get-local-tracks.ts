import { readdir } from 'fs/promises';
import { removeFileExtensions } from './utils/file-utils';
import { TARGET_FOLDER_PATH } from './utils/constants';

export async function getLocalTrackList() {
  const list = await readdir(TARGET_FOLDER_PATH);

  return removeFileExtensions(list);
}
