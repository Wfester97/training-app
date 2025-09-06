import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type RepoMock = {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
  remove: jest.Mock;
};

const createRepoMock = (): RepoMock => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: RepoMock;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: createRepoMock },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
    repo = moduleRef.get(getRepositoryToken(User));
  });

  it('create: guarda y NO retorna password', async () => {
    const dto = { name: 'Ana', lastName: 'Pérez', email: 'ana@example.com', password: 'abc12345' };
    repo.create.mockReturnValue(dto as unknown as User);
    repo.save.mockResolvedValue({ id: 1, ...dto, password: 'hashed!' } as unknown as User);

    const res = await service.create(dto as any);
    expect(res).toMatchObject({ id: 1, name: 'Ana', lastName: 'Pérez', email: 'ana@example.com' });
    expect((res as any).password).toBeUndefined();
  });

  it('findAll: devuelve array', async () => {
    repo.find.mockResolvedValueOnce([]);
    const res = await service.findAll();
    expect(Array.isArray(res)).toBe(true);
  });

  it('findOne: retorna usuario o lanza NotFound', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 1 } as unknown as User);
    expect(await service.findOne(1)).toMatchObject({ id: 1 });

    repo.findOne.mockResolvedValueOnce(null as any);
    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update: fusiona cambios y NO retorna password', async () => {
    const existing = { id: 1, name: 'A', lastName: 'B', email: 'a@b.com' } as unknown as User;
    repo.findOne.mockResolvedValueOnce(existing);
    repo.save.mockResolvedValueOnce({ ...existing, name: 'Ana' } as unknown as User);

    const res = await service.update(1, { name: 'Ana' } as any);
    expect(res).toMatchObject({ id: 1, name: 'Ana' });
    expect((res as any).password).toBeUndefined();
  });

  it('remove: elimina o lanza NotFound', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 1 } as unknown as User);
    repo.remove.mockResolvedValueOnce(undefined as any);

    expect(await service.remove(1)).toEqual({ message: 'Usuario eliminado' });

    repo.findOne.mockResolvedValueOnce(null as any);
    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
