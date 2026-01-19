import { getAboutDialogTitle, getServerAndDatabaseLabel, getFrameworkAndLanguageLabel, getChartsAndMapsLabel, getFlagsAndNotificationsLabel, getSecurityLabel, getTestsLabel } from '../../app/shared/labels/dialogs/about-dialog';
import { describe, it, expect } from 'vitest';

describe('AboutDialogLabels', () => {
  
  it('#getAboutDialogTitle should return about dialog title', () => {
    const aboutDialogTitle: string = getAboutDialogTitle();
    expect(aboutDialogTitle).toStrictEqual('À propos');
  });

  it('#getServerAndDatabaseLabel should return "server & database" label', () => {
    const serverAndDatabaseLabel: string = getServerAndDatabaseLabel();
    expect(serverAndDatabaseLabel).toStrictEqual('Serveur & Base de données');
  });

  it('#getFrameworkAndLanguageLabel should return "framework & language" label', () => {
    const frameworkAndLanguageLabel: string = getFrameworkAndLanguageLabel();
    expect(frameworkAndLanguageLabel).toStrictEqual('Framework & Langage');
  });

  it('#getChartsAndMapsLabel should return "charts & maps" label', () => {
    const chartsAndMapsLabel: string = getChartsAndMapsLabel();
    expect(chartsAndMapsLabel).toStrictEqual('Graphiques & Cartes');
  });

  it('#getFlagsAndNotificationsLabel should return "flags & notifications" label', () => {
    const flagsAndNotificationsLabel: string = getFlagsAndNotificationsLabel();
    expect(flagsAndNotificationsLabel).toStrictEqual('Drapeaux & Notifications');
  });

  it('#getSecurityLabel should return "security" button label', () => {
    const securityLabel: string = getSecurityLabel();
    expect(securityLabel).toStrictEqual('Sécurité');
  });

  it('#getTestsLabel should return "tests" label', () => {
    const testsLabel: string = getTestsLabel();
    expect(testsLabel).toStrictEqual('Tests');
  });
});