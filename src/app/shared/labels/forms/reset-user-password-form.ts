export function getResetUserPasswordFormTitle(isNotification: boolean): string {
  const title: string = `Réinitialisation du mot de passe<br /> d'un utilisateur`;

  if (isNotification) {
    return title.replaceAll(/(<([^>]+)>)/gi, '');
  }
  return title;
}

export function getSubmitButtonLabel(): string {
  return 'Réinitialiser';
}

export function getResetUserPasswordFormSuccessNotificationMessage(): string {
  return `Le mot de passe de votre utilisateur a bien été réinitialisé !`;
}
