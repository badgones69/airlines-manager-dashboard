import packageJson from '../../../../../package.json';
import { formatDate } from '../../utils/date-utils';

export function getAppReleaseDate(): string {
  return formatDate(packageJson.releaseDate);
}

export function getHomeLabel(): string {
  return 'Accueil';
}

export function getAlphabet(): string[] {
  return [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
}
