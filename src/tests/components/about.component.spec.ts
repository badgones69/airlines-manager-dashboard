import { describe, it, expect } from 'vitest';
import { AboutComponent } from '../../app/about/about.component';
import { INFO_DIALOG_MODE } from '../../app/shared/constants/dialogs-constants';

describe('AboutComponent', () => {
  it('#ngOnInit should initialize "About" component', () => {
    const aboutComponent: AboutComponent = new AboutComponent();
    aboutComponent.ngOnInit();
    expect(aboutComponent.aboutDialogTitle).toStrictEqual(
      'AM Dashboard - À propos',
    );
    aboutComponent.aboutDialogMode = INFO_DIALOG_MODE;
    expect(aboutComponent.serverAndDatabaseLabel).toStrictEqual(
      'Serveur & Base de données',
    );
    expect(aboutComponent.frameworkAndLanguageLabel).toStrictEqual(
      'Framework & Langage',
    );
    expect(aboutComponent.chartsAndMapsLabel).toStrictEqual(
      'Graphiques & Cartes',
    );
    expect(aboutComponent.flagsAndNotificationsLabel).toStrictEqual(
      'Drapeaux & Notifications',
    );
    expect(aboutComponent.securityLabel).toStrictEqual('Sécurité');
    expect(aboutComponent.testsLabel).toStrictEqual('Tests');
  });
});
