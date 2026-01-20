import {
  getUnauthorizedMessage,
  getForbiddenMessage,
  getAuthenticatedUserUneditableMessage,
  getTechnicalErrorTitle,
  getTechnicalErrorMessage,
} from '../../app/shared/labels/errors';
import { describe, it, expect } from 'vitest';

describe('ErrorsLabels', () => {
  it('#getUnauthorizedMessage should return unauthorized error message', () => {
    const unauthorizedMessage: string = getUnauthorizedMessage();
    expect(unauthorizedMessage).toStrictEqual(
      'Veuillez vous connecter pour accéder à cette page !',
    );
  });

  it('#getForbiddenMessage should return forbidden error message', () => {
    const forbiddenMessage: string = getForbiddenMessage();
    expect(forbiddenMessage).toStrictEqual(
      "Vous n'êtes pas habilité(e) pour accéder à cette page !",
    );
  });

  it('#getAuthenticatedUserUneditableMessage should return error message because authenticated user is uneditable', () => {
    const authenticatedUserUneditableMessage: string =
      getAuthenticatedUserUneditableMessage();
    expect(authenticatedUserUneditableMessage).toStrictEqual(
      "Aucune action possible sur l'utilisateur connecté !",
    );
  });

  it('#getTechnicalErrorTitle should return technical error title', () => {
    const technicalErrorTitle: string = getTechnicalErrorTitle();
    expect(technicalErrorTitle).toStrictEqual('ERREUR TECHNIQUE');
  });

  it('#getTechnicalErrorMessage should return technical error title', () => {
    const technicalErrorMessage: string = getTechnicalErrorMessage();
    expect(technicalErrorMessage).toStrictEqual(
      'Une erreur est survenue : veuillez réessayer...',
    );
  });
});
