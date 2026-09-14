import { test, expect } from '@playwright/test';

test('Authentication page redirection', async ({ page }) => {
  await page.goto('https://airlines-manager-dashboard.vercel.app');
  await expect(page.getByText('Authentification')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'IDENTIFIANT' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'MOT DE PASSE' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'visibility' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Connexion'})).toBeVisible();
  await expect(page.getByRole('button', { name: 'Connexion'})).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Effacer' })).toBeVisible();
  await page.getByRole('button', { name: 'visibility' }).click();
  await expect(page.getByRole('button', { name: 'visibility' })).toBeVisible();

  await page.getByRole('textbox', { name: 'IDENTIFIANT' }).click();
  await page.getByRole('textbox', { name: 'IDENTIFIANT' }).fill('f.renard');
  await page.getByRole('textbox', { name: 'IDENTIFIANT' }).press('Tab');
  await page.getByRole('textbox', { name: 'MOT DE PASSE' }).fill('@@@@');
  await page.getByRole('button', { name: 'Connexion' }).click();
  await expect(page.getByRole('alert', {})).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText('Identifiant et/ou mot de passe incorrects !');
  await page.getByRole('alert', {}).click();
  await expect(page.getByRole('alert', {})).toBeHidden();
});