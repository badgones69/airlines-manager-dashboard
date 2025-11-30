import { getWelcomeMessagePrefix, getDefaultWelcomeMessage, getAirlineWelcomeMessage } from '../../app/shared/labels/pages/home';
import { describe, it, expect } from 'vitest';

describe('HomeLabels', () => {
  
  it('#getWelcomeMessagePrefix should return welcome message prefix', () => {
    const welcomeMessagePrefix: string = getWelcomeMessagePrefix();
    expect(welcomeMessagePrefix).toStrictEqual('Bienvenue sur');
  });

  it('#getDefaultWelcomeMessage should return default welcome message', () => {
    const defaultWelcomeMessage: string = getDefaultWelcomeMessage();
    expect(defaultWelcomeMessage).toStrictEqual('Bienvenue sur l\'application AM Dashboard');
  });

  it('#getAirlineWelcomeMessage should return airline welcome message', () => {
    const airlineWelcomeMessage: string = getAirlineWelcomeMessage('American Airlines');
    expect(airlineWelcomeMessage).toStrictEqual('Bienvenue sur le portail de la compagnie American Airlines');
  });
});