import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Users } from "./entities/users.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  create(createUserDto: CreateUserDto) {
    // TODO: User 추가 기능
    return "This action adds a new user";
  }

  findAll() {
    // TODO: User 목록 조회 기능
    return `This action returns all users`;
  }

  findOne(id: number) {
    // TODO: User 조회 기능
    return `This action returns a #${id} user`;
  }

  /**
   * id로 User를 조회합니다.
   * @param id User ID
   * @returns User
   */
  async findOneById(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  remove(id: number) {
    // TODO: User삭제 기능
    return `This action removes a #${id} user`;
  }
}
