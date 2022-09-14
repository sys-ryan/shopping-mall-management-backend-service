import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, CreateUserResponseDto } from "./dto/create-user.dto";
import { Users } from "./entities/users.entity";
import { DeleteUserResponseDto } from "./dto/delete-user.dto";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Users API")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "유저 생성 API", description: "유저를 생성합니다." })
  @ApiCreatedResponse({ description: "유저를 생성합니다.", type: CreateUserResponseDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: "유저 목록 조회 API", description: "유저 목록을 조회합니다." })
  @ApiOkResponse({ description: "유저 목록을 조회합니다.", type: Users, isArray: true })
  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: "유저 조회 API", description: "유저 정보를 조회합니다." })
  @ApiOkResponse({ description: "유저 정보를 조회합니다.", type: Users })
  @Get(":id")
  findOneById(@Param("id") id: string): Promise<Users> {
    return this.usersService.findOneById(+id);
  }

  @ApiOperation({ summary: "유저 삭제 API", description: "유저를 삭제합니다." })
  @ApiOkResponse({ description: "유저를 삭제합니다.", type: DeleteUserResponseDto })
  @Delete(":id")
  remove(@Param("id") id: string): Promise<DeleteUserResponseDto> {
    return this.usersService.remove(+id);
  }
}
