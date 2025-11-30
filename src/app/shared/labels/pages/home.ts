import packageJson from '../../../../../package.json';

export function getWelcomeMessagePrefix(): string {
  return 'Bienvenue sur';
}

export function getDefaultWelcomeMessage(): string {
  return `${getWelcomeMessagePrefix()} l'application ${
    packageJson.productName
  }`;
}

export function getAirlineWelcomeMessage(airlineName: string): string {
  return `${getWelcomeMessagePrefix()} le portail de la compagnie ${airlineName}`;
}
