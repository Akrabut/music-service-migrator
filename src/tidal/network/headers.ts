import { TOKEN } from '../utils/secrets';

export function headersWithToken() {
  return {
    'Authorization': TOKEN,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}