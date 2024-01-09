1. NESTJS VS EXPRESSJS
1. 1. Nest using MVC pattern, Express dont (express very unopinionated)

1. NESTJS IS BULT ON TOP OF EXPRESS
   -- and provides a set of abstractions and additional features to make it easier to develop scalable and maintainable server-side applications using TypeScript.

1. GETTING STARTED
1. 1. `npm i -g @nestjs/cli` (globally install nestjs commandline interface)

1. 2. `nest new <project name>` (to create new project)

1. SCRIPT FOR DEVELOPMET STAGE => `"npm run start:dev"`

1. SIGN THE BOILERPLATE APP IS RUNNING
   -- run request for http://localhost:3000 (method : get)
   -- response = Hello, World!

1. CREATE OUR OWN MODULE (named users)
   -- Using nestjs cli : `nest g module <module_name>`
   -- result : new folder in src directi with `<module_name>`
   -- import in app.module.ts automatically filled (`imports: [<module_name>Module],`)

1. 1. CREATE CONTROLLER FOR MODULE users
      -- cli command : `nest g controller <controller_name>`
      -- result : controller file and it's controller testing
      -- import in users.module.ts automatically filled (`import { <controller_name>Controller }`)

1. 2. CREATE OUR OWN PROVIDER FOR MODULE users
      -- cli command : `nest g service <provider_name>`
      -- result : 2 more files users.service.ts and users.service.spec.ts(for test)
      -- import in users.module.ts automatically filled (`import { <provider_name>Service }`)

-----------------------------------------02Controllers--------------------------------

7. CREATE ROUTING LOGIC IN OUR CONTROLLER (users.contorller.ts)
   -- Controllers are responsible for handling incoming request and returning rosponses to the client
   -- purposes : receive specific request for the app
   -- each controller can have more than one routem and different route can preform differenct action
   -- users controller = http://localhost:port/users

```js
//// INSIDE users.controller.ts
 @Get() // GET /users or /users?role=value&age=value
 findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') { // using optional porps '?'
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
```

99. DECORATORS is '@someFunction' that run automatically when called
    example : `@Controller('users')`

100.  PARAM CANNOT BE IN ABOVE SUBROUTE
      Example : WRONG ORDER

```js
 @Get(':id') //  GET /users/:id
 findOne(@Param('id') id: string) {
  return { id } // the return = {  "id": "1"  }
 }

 @Get('interns') // GET /users/interns
findAllInterns() {
  return [] // return = {  "id": "interns" } (interns should be above :id)
}
```

---------------------------------03Providers---------------------------------------------- 8. CREATE LOGIC FOR HANDLING EACH ROUTES(from controller) INSIDE THE PROVIDER
-- providers doesn't have to be a service but it often is (it also can be a repositories, factories, helpers, and so on);
-- the main idea of provider : it can be injected as dependecy, this means object can create various relationship with each other

8. 1. CREATE METHOD TO HANDLE ROUTE

```js
private users = [`array of object`]

findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      return this.users.filter((user) => user.role === role);
    }
    return this.users; // if no role was passed
  }

  findOne(id: number) {
    const user = this.users.find(user => user.id === id)
    return user;
  }

  create(user: {name: string, email: string, role: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
    const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id) //finding highest id for newUser
    const newUser = {
      id: usersByHighestId[0].id + 1,
      ...user //the rest of user that we received
    }
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUser: {name?: string, email?: string, role?: 'INTERN' | 'ENGINEER' | 'ADMIN' } ) {
    this.users = this.users.map(user => { //knp this.users 2?
      if(user.id === id) {
        return {...user, ...updateUser}
      } 
      return user;
    })
    return this.findOne(id); // after we've updated we only want to return the updated user
  }

  delete(id: number) {
    const removedUser = this.findOne(id);

    this.users = this.users.filter(user => user.id !== id)

    return removedUser;
  }
```

8. 2. IMPORT TO users.controller.ts

```js
import { UsersService } from './users.service';
```

8. 3. WE NEED TO INJECT IT INTO THE CONTROLL
      -- dependency injection : In Nest, thanks to TypeScript capabilities, it's extremely easy to manage dependencies because they are resolved just by type. In the example below, Nest will resolve the `usersService` by creating and returning an instance of `UsersService` (or, in the normal case of a singleton, returning the existing instance if it has already been requested elsewhere).

```js
constructor(private readonly userService: UsersService) {} //dependency injection resolved just by type (ts feature)

// without nestjs it would be
const usersService = new UsersService
```

8. 4. REPLACE RETURN USING METHOD FROM UsersService in `users.controler.ts`

@Get() // GET /users or /users?role=value&age=value
findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
// using optional porps '?'
`return this.userService.findAll(role);`
}

@Get(':id') // GET /users/:id
findOne(@Param('id') id: string) { // every params is string
`return this.userService.findOne(+id)` // + is unary to convert something to number
}

@Post()
create(@Body() user: {name: string, email: string, role: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
`return this.userService.create(user);`
}

@Patch(':id') // PATCH /users/:id
update(@Param('id') id: string, @Body() userUpdate: {name?: string, email?: string, role?: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
`return this.userService.update(+id, userUpdate);`
}

@Delete(':id') // DELETE /users/:id
delete(@Param('id') id: string) {
`return this.userService.delete(+id)`
}

8. 5. TEST ALL HTTP METHOD USING THUNDERCLIENTS
      -- Result: successfully tested

------------------------------ 04-DTO, Validation & Pipes -----------------------------

- UNTIL THIS POINT INVALID REQUEST WOULD RETURN EMPTY ARRAY (need validation for request)

9. PIPES (a Middleware for **transformation** and **validation**)

9. 1. `ParseIntPipe` FOR BOTH TRANSFORM DATA AND VALIDATON

```js
//// BEFORE
    @Get(':id') //  GET /users/:id
    findOne(@Param('id') id: string) { // every params is string
    return this.userService.findOne(+id) 
}

// AFTER (USING PIPE)
  @Get(':id') //  GET /users/:id
  findOne(@Param('id', ParseIntPipe) id: number) { // every params is string
    return this.userService.findOne(id) 
  }
```

-- THE RESULT IF PARAM IN REQUEST IS STRING:
```json
{
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request",
  "statusCode": 400
}
```

10. DATA TRANSFER OBJECT SCHEMA (DTO) or input validation types 
-- Definition : A DTO is an object that defines how the data will be sent over the network. 
-- Create DTO using classes : We could determine the DTO schema by using TypeScript `interfaces`, or by simple `classes`. Interestingly, __we recommend using classes__ here. Why? Classes are part of the JavaScript ES6 standard, and therefore they are preserved as real entities in the compiled JavaScript. On the other hand, since TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime. 

10. 1. CREATE DTO IN (src>usrs>dto>create-user.dto.ts)
```js
export class CreateUserDto  {
  name: string;
  email: string;
  role: "INTERN" | "ENGINEER" | "ADMIN";
}
```

10. 2. BUILD __CREATE__ AND __UPDATE__ VARIATIONS DTO ON THE SAME TYPE
-- it's often useful to build create and update variations on the same type. For example, the create variant may require all fields, while the update variant may make all fields optional.
-- Nest provides the `PartialType()` utility function to make this task easier and minimize boilerplate.
-- By default, all of these fields are required. To create a type with the same fields, but with each one optional, use PartialType() passing the class reference (CreateCatDto) as an argument:
Example : `export class UpdateCatDto extends PartialType(CreateCatDto) {}`

-- `npm i @nestjs/mapped-types -D` : to use `PartialType()`

-- CREATE UPDATE DTO (src>usrs>dto>update-user.dto.ts)
```js
import { CreateUserDto } from "./create-user.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

10. 3. APPLYING DTO TO  `users.controller.ts`
```js
//// WITHOUT DTO
  @Post()
  create(@Body() user: {name: string, email: string, role: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
    return this.userService.create(user);
  }

  @Patch(':id') 
  update(@Param('id', ParseIntPipe) id: number, @Body() userUpdate: {name?: string, email?: string, role?: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
    return this.userService.update(id, userUpdate);
  }

//// WITH DTO
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Patch(':id') 
  update(@Param('id', ParseIntPipe) id: number, @Body() userUpdate: UpdateUserDto) {
    return this.userService.update(id, userUpdate);
  }
```

10. 4. APPLYING DTO TO  `users.service.ts`
```js
  create(user: CreateUserDto) {
    const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id) //finding highest id for newUser
    const newUser = {
      id: usersByHighestId[0].id + 1,
      ...user //the rest of user that we received
    }
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUser: UpdateUserDto ) {
    this.users = this.users.map(user => { //knp this.users 2? in order tooriginal array is not mutated,
      if(user.id === id) {
        return {...user, ...updateUser}
      } 
      return user;
    })
    return this.findOne(id); // after we've updated we only want to return the updated user
  }
```
11. `npm i class-validator class-transformer` PACKAGE FOR VALIDATION

11. 1. SET VALIDATOR IN DTO 
```js
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto  {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(["INTERN", "ENGINEER", "ADMIN"], {
    message: 'Valid role required'  // message if role not valid
  })
  role: "INTERN" | "ENGINEER" | "ADMIN";
}
```

11. 2. APPLYING VALIDATOR IN @Body in Controller

import { `ValidationPipe` } from '@nestjs/common';

  @Post()
  create(@Body(`ValidationPipe`) user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Patch(':id') 
  update(@Param('id', ParseIntPipe) id: number, @Body(`ValidationPipe`) userUpdate: UpdateUserDto) {
    return this.userService.update(id, userUpdate);
  }

11. 3. TRY OUR VALIDATION USING THUNDER CLIENT
result : success

12. __HTTP EXEPTION__ ERROR HANDLING FOR ROUTE THAT DOESN'T EXIS
example : localhost:3000/users/99999

12. 1. INSIDE `users.service.ts`

import { `NotFoundException` } from '@nestjs/common';

  findOne(id: number) {
    const user = this.users.find(user => user.id === id)
    `if(!user) throw new NotFoundException('User Not Found')`
    return user;
  }

  findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      const rolesArray = this.users.filter((user) => user.role === role);
```js
      if(rolesArray.length === 0) { // validaton for query role if it's filled
        throw new NotFoundException('User Role Not Found')
        return rolesArray
      }
```
    }
    return this.users; // if no role was passed
  }














