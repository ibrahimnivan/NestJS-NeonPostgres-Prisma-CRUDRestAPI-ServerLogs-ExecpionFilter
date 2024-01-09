import { Body, Controller, Delete, Get, Param, Patch, Post, Query, } from '@nestjs/common';

@Controller('users') // localhost/users
export class UsersController {
  /* 
 GET /users
 GET /users/:id
 POST /users
 PATCH /users/:id
 DELETE /users/:id
  */


 @Get() // GET /users or /users?role=value&age=value
 findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') { // using optional porps '?'
  return []
 }

 @Get('interns') // GET /users/interns (ONLY FOR EXAMPLE)
findAllInterns() {
  return []
}

 @Get(':id') //  GET /users/:id
 findOne(@Param('id') id: string) {
  return { id }
 }

 @Post()
 create(@Body() user: {}) {
  return user
 }

 @Patch(':id') //  PATCH /users/:id
 update(@Param('id') id: string, @Body() userUpdate: {}) {
  return { id, ...userUpdate }
 }

 @Delete(':id') //  DELETE /users/:id
 delete(@Param('id') id: string) {
  return { id }
 }

}





