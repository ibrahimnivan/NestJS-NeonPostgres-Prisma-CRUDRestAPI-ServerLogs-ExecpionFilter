1. NESTJS VS EXPRESSJS
1. 1. Nest using MVC pattern, Express dont (express very unopinionated)

2.  NESTJS IS BULT ON TOP OF EXPRESS 
-- and provides a set of abstractions and additional features to make it easier to develop scalable and maintainable server-side applications using TypeScript. 

3. GETTING STARTED
3. 1. `npm i -g @nestjs/cli` (globally install nestjs commandline interface)

3. 2. `nest new <project name>` (to create new project) 

4. SCRIPT FOR DEVELOPMET STAGE => `"start:dev"` 

5. SIGN THE BOILERPLATE APP IS RUNNING 
-- run request for http://localhost:3000 (method : get)
-- response = Hello, World!

6. CREATE OUR OWN MODULE (named users)
-- Using nestjs cli : `nest g module <module_name>`
-- result : new folder in src directi with `<module_name>` 
-- import in app.module.ts automatically filled (`imports: [<module_name>Module],`)

6. 1. CREATE CONTROLLER FOR MODULE users
-- cli command : `nest g controller <controller_name>`
-- result : controller file and it's controller testing
-- import in users.module.ts automatically filled (`import { <controller_name>Controller }`)

6. 2. CREATE OUR OWN PROVIDER FOR MODULE users
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


99. PARAM CANNOT BE IN ABOVE SUBROUTE
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

---------------------------------03Providers----------------------------------------------
8. CREATE LOGIC FOR HANDLING EACH ROUTES(from controller) INSIDE THE PROVIDER
-- providers doesn't have to be a service but it often is (it also can be a repositories, factories, helpers, and so on);
-- the main idea of provider : it can be injected as dependecy, this means object can create various relationship with each other

8. 1. CREATE METHOD TO HANDLE ROUTE
```js

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

  @Get(':id') //  GET /users/:id
  findOne(@Param('id') id: string) { // every params is string
    `return this.userService.findOne(+id)` // + is unary to convert something to number
  }

  @Post()
  create(@Body() user: {name: string, email: string, role: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
    `return this.userService.create(user);`
  }

  @Patch(':id') //  PATCH /users/:id
  update(@Param('id') id: string, @Body() userUpdate: {name?: string, email?: string, role?: 'INTERN' | 'ENGINEER' | 'ADMIN' }) {
    `return this.userService.update(+id, userUpdate);`
  }

  @Delete(':id') //  DELETE /users/:id
  delete(@Param('id') id: string) {
    `return this.userService.delete(+id)`
  }

  8. 5. TEST ALL HTTP METHOD USING THUNDERCLIENTS
  -- Result: successfully tested

  ------------------------------ 04-DTO, Validation & Pipes -----------------------------








