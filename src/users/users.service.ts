import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    const { password, ...safe } = saved as any;
    return safe;
  }
  //TODO: tipar el retorno de datos de los métodos de este servicio y otro en caso de existir.
  async findAll() {
    return this.repo.find({
      select: ['id', 'name', 'lastName', 'email', 'createdAt', 'updatedAt'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      select: ['id', 'name', 'lastName', 'email', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    Object.assign(user, dto);
    const saved = await this.repo.save(user);
    const { password, ...safe } = saved as any;
    return safe;
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.repo.remove(user);
    return { message: 'Usuario eliminado' };
  }
}
