import { readdir } from 'fs/promises';
import { removeFileExtensions } from './utils';
import { TARGET_FOLDER_PATH } from './constants';

export async function getLocalTrackList() {
  const list = await readdir(TARGET_FOLDER_PATH);

  return removeFileExtensions(list);
}
