import packageJson from '../../../../../package.json';
import { formatDate } from '../../utils/date-utils';

export function getAppReleaseDate(): string {
  return formatDate(packageJson.releaseDate);
}
