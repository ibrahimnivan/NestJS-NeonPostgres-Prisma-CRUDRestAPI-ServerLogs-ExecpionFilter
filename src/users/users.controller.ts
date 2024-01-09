import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users') // localhost/users
export class UsersController {
  constructor(private readonly userService: UsersService) {} //dependency injection resolved just by type (ts feature)

  @Get() // GET /users or /users?role=value&age=value
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    // using optional porps '?'
    return this.userService.findAll(role);
  }

  @Get(':id') //  GET /users/:id
  findOne(@Param('id') id: string) { // every params is string
    return this.userService.findOne(+id) // + is unary to convert something to number
  }

  @Post()
  create(@Body() user: {name: string, email: string, role: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
    return this.userService.create(user);
  }

  @Patch(':id') //  PATCH /users/:id
  update(@Param('id') id: string, @Body() userUpdate: {name?: string, email?: string, role?: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
    return this.userService.update(+id, userUpdate);
  }

  @Delete(':id') //  DELETE /users/:id
  delete(@Param('id') id: string) {
    return this.userService.delete(+id)
  }
}
