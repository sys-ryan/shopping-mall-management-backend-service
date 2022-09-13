import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto, CreateUserResponseDto } from "./dto/create-user.dto";
import { DeleteUserResponseDto } from "./dto/delete-user.dto";
import { Users } from "./entities/users.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  /**
   * 새로운 유저를 생성하는 서비스 함수
   * @param createUserDto user 생성 요청 request body
   * @returns { message }
   */
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const { name } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { name } });

    // 중복 name 금지
    if (existingUser) {
      throw new BadRequestException("User name already exists.");
    }

    const user = await this.usersRepository.create({ name });

    await this.usersRepository.save(user);

    return {
      message: `User (name: ${name}) was successfully created.`,
    };
  }

  /**
   * User 목록을 조회하는 서비스 함수
   * @returns User 목록
   */
  async findAll(): Promise<Users[]> {
    const users = await this.usersRepository.find({
      where: { isDeleted: false },
      relations: ["orders.coupon"],
    });

    return users;
  }

  /**
   * id로 User를 조회하는 서비스 함수
   * @param id User ID
   * @returns User
   */
  async findOneById(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id, isDeleted: false },
      relations: ["orders"],
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * 제출한 id를 가진 user를 삭제합니다.
   * @param id User id
   * @returns { message }
   */
  async remove(id: number): Promise<DeleteUserResponseDto> {
    const user = await this.findOneById(id);

    user.isDeleted = true;

    await this.usersRepository.save(user);

    return {
      message: `User (id: ${id}) was successfully deleted.`,
    };
  }
}
