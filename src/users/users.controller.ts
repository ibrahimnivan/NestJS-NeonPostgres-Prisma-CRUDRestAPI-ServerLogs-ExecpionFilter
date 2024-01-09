import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe, ValidationPipe
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users') // localhost/users
export class UsersController {
  constructor(private readonly userService: UsersService) {} //dependency injection resolved just by type (ts feature)

  @Get() // GET /users or /users?role=value&age=value
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') { // using optional porps '?'
    return this.userService.findAll(role);
  }

  @Get(':id') //  GET /users/:id
  findOne(@Param('id', ParseIntPipe) id: number) { // every params is string
    return this.userService.findOne(id) 
  }

  @Post()
  create(@Body(ValidationPipe) user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Patch(':id') //  PATCH /users/:id
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) userUpdate: UpdateUserDto) {
    return this.userService.update(id, userUpdate);
  }

  @Delete(':id') //  DELETE /users/:id
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }
}
