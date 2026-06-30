const DeleteCitizen = require('../src/application/DeleteCitizen')
const { CitizenNotFoundError } = require('../src/application/GetCitizen')

describe('DeleteCitizen', () => {
  let repository
  let deleteCitizen

  beforeEach(() => {
    repository = {
      findById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Maria Silva',
        cpf: '52998224725',
        createdAt: '2024-01-01T00:00:00.000Z',
      }),
      delete: jest.fn().mockResolvedValue(undefined),
    }
    deleteCitizen = new DeleteCitizen(repository)
  })

  it('remove cidadão existente', async () => {
    const result = await deleteCitizen.execute(1)

    expect(result).toEqual({ success: true })
    expect(repository.findById).toHaveBeenCalledWith(1)
    expect(repository.delete).toHaveBeenCalledWith(1)
  })

  it('rejeita cidadão inexistente', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(deleteCitizen.execute(999)).rejects.toThrow(CitizenNotFoundError)
    expect(repository.delete).not.toHaveBeenCalled()
  })
})
