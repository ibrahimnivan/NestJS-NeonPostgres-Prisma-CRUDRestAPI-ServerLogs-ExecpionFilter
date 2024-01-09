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

---------------------------------03Providers----------------------------------------------

8. CREATE LOGIC FOR HANDLING EACH ROUTES INSIDE THE PROVIDER

9. DECORATORS is '@someFunction' that run automatically when called 
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




