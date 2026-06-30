import { test, expect } from '@playwright/test'

test.describe('Página inicial', () => {
  test('exibe título e acesso rápido', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Início', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Acesso rápido' })).toBeVisible()
    await expect(page.locator('.quick-card__title', { hasText: 'Baixar CSV' })).toBeVisible()
  })

  test('navega para cadastro pela sidebar', async ({ page }) => {
    await page.goto('/')

    await page.locator('.sidebar-nav__item', { hasText: 'Cadastrar cidadão' }).click()

    await expect(page).toHaveURL(/\/cadastrar/)
    await expect(
      page.getByRole('textbox', { name: 'Digite o nome completo', exact: true }),
    ).toBeVisible()
  })
})
