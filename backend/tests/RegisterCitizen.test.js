const {
  RegisterCitizen,
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
} = require('../src/application/RegisterCitizen')

describe('RegisterCitizen', () => {
  let repository
  let registerCitizen

  beforeEach(() => {
    repository = {
      findByCpf: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(({ name, cpf }) =>
        Promise.resolve({ id: 1, name, cpf, createdAt: '2024-01-01T00:00:00.000Z' }),
      ),
    }
    registerCitizen = new RegisterCitizen(repository)
  })

  it('cadastra cidadão com dados válidos', async () => {
    const result = await registerCitizen.execute({
      name: 'Maria Silva',
      cpf: '529.982.247-25',
    })

    expect(result.name).toBe('Maria Silva')
    expect(result.cpf).toBe('52998224725')
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Maria Silva',
      cpf: '52998224725',
    })
  })

  it('rejeita nome com menos de 3 caracteres', async () => {
    await expect(
      registerCitizen.execute({ name: 'Ab', cpf: '52998224725' }),
    ).rejects.toThrow(InvalidNameError)
  })

  it('rejeita CPF inválido', async () => {
    await expect(
      registerCitizen.execute({ name: 'Maria Silva', cpf: '111.111.111-11' }),
    ).rejects.toThrow(InvalidCpfError)
  })

  it('rejeita CPF duplicado', async () => {
    repository.findByCpf.mockResolvedValue({
      id: 1,
      name: 'Outro',
      cpf: '52998224725',
    })

    await expect(
      registerCitizen.execute({ name: 'Maria Silva', cpf: '52998224725' }),
    ).rejects.toThrow(DuplicateCpfError)
  })
})
