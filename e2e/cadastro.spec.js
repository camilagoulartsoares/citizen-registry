import { test, expect } from '@playwright/test'

test.describe('Cadastro de cidadão', () => {
  test('exibe erro quando nome tem menos de 3 caracteres', async ({ page }) => {
    await page.goto('/cadastrar')

    await page.getByRole('textbox', { name: 'Digite o nome completo', exact: true }).fill('Ab')

    await expect(
      page.getByText('Nome deve ter no mínimo 3 caracteres e conter letras.'),
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'Cadastrar cidadão' }),
    ).toBeDisabled()
  })
})
