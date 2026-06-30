const UpdateCitizen = require('../src/application/UpdateCitizen')
const { CitizenNotFoundError } = require('../src/application/GetCitizen')
const {
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
} = require('../src/application/RegisterCitizen')

describe('UpdateCitizen', () => {
  let repository
  let updateCitizen

  const existingCitizen = {
    id: 1,
    name: 'Maria Silva',
    cpf: '52998224725',
    createdAt: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    repository = {
      findById: jest.fn().mockResolvedValue({ ...existingCitizen }),
      findByCpf: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockImplementation((id, data) =>
        Promise.resolve({ ...existingCitizen, id, ...data }),
      ),
    }
    updateCitizen = new UpdateCitizen(repository)
  })

  it('atualiza cidadão com dados válidos', async () => {
    const result = await updateCitizen.execute(1, {
      name: 'Maria Santos',
      cpf: '529.982.247-25',
    })

    expect(result.name).toBe('Maria Santos')
    expect(repository.update).toHaveBeenCalledWith(1, {
      name: 'Maria Santos',
      cpf: '52998224725',
    })
  })

  it('rejeita cidadão inexistente', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      updateCitizen.execute(999, { name: 'Maria Silva', cpf: '52998224725' }),
    ).rejects.toThrow(CitizenNotFoundError)
  })

  it('rejeita nome com menos de 3 caracteres', async () => {
    await expect(
      updateCitizen.execute(1, { name: 'Ab', cpf: '52998224725' }),
    ).rejects.toThrow(InvalidNameError)
  })

  it('rejeita CPF inválido', async () => {
    await expect(
      updateCitizen.execute(1, { name: 'Maria Silva', cpf: '111.111.111-11' }),
    ).rejects.toThrow(InvalidCpfError)
  })

  it('rejeita CPF já usado por outro cidadão', async () => {
    repository.findByCpf.mockResolvedValue({
      id: 2,
      name: 'Outro',
      cpf: '11144477735',
    })

    await expect(
      updateCitizen.execute(1, { name: 'Maria Silva', cpf: '111.444.777-35' }),
    ).rejects.toThrow(DuplicateCpfError)
  })

  it('permite manter o mesmo CPF do próprio cidadão', async () => {
    repository.findByCpf.mockResolvedValue({ ...existingCitizen })

    const result = await updateCitizen.execute(1, {
      name: 'Maria Santos',
      cpf: '529.982.247-25',
    })

    expect(result.name).toBe('Maria Santos')
    expect(repository.findByCpf).not.toHaveBeenCalled()
  })
})
