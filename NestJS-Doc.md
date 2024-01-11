1. NESTJS VS EXPRESSJS
1. 1. Nest using MVC pattern, Express dont (express very unopinionated)

2. NESTJS IS BULT ON TOP OF EXPRESS
   -- and provides a set of abstractions and additional features to make it easier to develop scalable and maintainable server-side applications using TypeScript.

3. GETTING STARTED
3. 1. `npm i -g @nestjs/cli` (globally install nestjs commandline interface)

3. 2. `nest new <project name>` (to create new project)

4. SCRIPT FOR DEVELOPMET STAGE => `"npm run start:dev"`

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

10. DATA TRANSFER OBJECT SCHEMA (DTO) a.k.a input validation types 
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

  --------------------------05RestAPI-PrismaORM-NeonPostgre---------------------------------

  14. NEON - (serverless postgres)

  14. 1. SIGNUP TO NEON - (Using Github account)

  14. 2. CHOOSE CONNECTION STRING - (I choose Prisma) 
  -- Copy Prisma Schema and .env
```prisma
    // prisma/schema.prisma
    datasource db {
      provider  = "postgresql"
      url  	    = env("DATABASE_URL")
      directUrl = env("DIRECT_URL")
    }
    // env
    DATABASE_URL="postgresql://ibrahimnivan:hJzQs0gjLr2K@ep-soft-firefly-04940416-pooler.ap-southeast-1.aws.neon.tech/davegray-nestjs?sslmode=require&pgbouncer=true"
    DIRECT_URL="postgresql://ibrahimnivan:hJzQs0gjLr2K@ep-soft-firefly-04940416.ap-southeast-1.aws.neon.tech/davegray-nestjs?sslmode=require"
```

15. PRISMA PREPARATION
15. 1. `npm i prisma -D` 

15. 2. `npx prisma init` - (create schema folder and .env file)

15. 3.  REPLACE prisma schema and .env from boilerplate with Neon

15. 4. CREATE PRISMA MODEL THEN `npx prisma migrate dev --name init` (create a table and its structure for actual db)
```prisma
  model Empoyee {
    id Int @id @default(autoincrement())
    name String @unique 
    email String @unique
    role  Role 
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  // define Enum
  enum Role {
    INTERN
    ENGINEER
    ADMIN
  }
```

GOOD TO KNOW : Option of prisma migration
`npx prisma migrate deploy`: Applies pending migrations to the database, updating its structure based on the changes defined in migration files.

`npx prisma migrate push`: Generates a new migration file based on changes in the Prisma schema, preparing it for deployment to the database.

`npx prisma migrate dev`: Combines migration file generation (push) and deployment (deploy) in one step, streamlining the process during development.

15. 5. AFTER MIGTATION : folder migration and added  packages
-- Folder migration : there's sql file and its sql instruction based on our model
-- added packages : added __@prisma/client__  : generated tailored client API based on our Model

15. 6.  IF WE CHANGED OUR MODEL STRUCTURE THEN 
1. `npx prisma generate`
2. run another migrate with descriptive name `npx prisma migrate dev --name name_changed`
3. another migration.sql file is generated

16. CREATE DATABASE MODULE AND SERVICE
`nest g module database` & `nest g service database`

16. 1. add export in database.module.ts
@Module({
  providers: DatabaseService,
  `exports: [DatabaseService]`
})

++++++++++++++++++
GOOD TO KNOW : @Global() (Global module)
purpose : makeing our module availabel everywhere (it's no always the best designt choice to make it global) 

```js
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
```
++++++++++++++++++

16. 2. in database.service.ts (configure PrismaClient and OnModuleInit)
```js
//  PrismaClient allows you to perform database operations like querying and updating data.
// onModuleInit method is used to establish a connection to the database using the PrismaClient
@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
      await this.$connect() // await connection to prisma
  }
}

```

17. CREATE MODULE employees WITH CRUD REST API 
- `nest g resource <employee>` ( is a shorthand that __generates a module, controller, and service all at once, configured for a RESTful resource.__ )
-  Choose Transport layer (RestAPI)
-  y for CRUD entry point
RESULT : employee folder on scr, and inside empoyee folder we __delete__ dto and entities folder bcs we want to use Prisma model

17. 1. INSIDE employees.module.ts (Add DatabaseModule)

`import { DatabaseModule } from 'src/database/database.module';`

@Module({
  `imports: [DatabaseModule],`
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}

17. 2. CHANGE DTO INTO PRISMA MODUL and add Query('role') to findAll() IN employees.controller.ts 

`import { Prisma } from '@prisma/client';`

  @Get()
  findAll(`@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN'`) {
    return this.employeesService.findAll(`role`);
  }

  @Post()
  create(@Body() createEmployeeDto: `Prisma.EmployeeCreateInput`) { //EmployeeCreateInput create based on prisma modul after migration
    return this.employeesService.create(createEmployeeDto);
  }

    @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: `Prisma.EmployeeUpdateInput`) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

17. 3. INSIDE employees.service.ts WHAT WE DO? 
- CHANGE DTO
- ADD ASYNC
- INJECT databaseService DEPENDENCY,
- ADD PRISMA METHOD TO RETURN
- ADD QUERY 'ROLE'

```js
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EmployeesService {

  constructor(private readonly databaseService: DatabaseService) {} // Inject

  async create(createEmployeeDto: Prisma.EmployeeCreateInput) { // should async if we use DB
    return this.databaseService.employee.create({ // create() is Prisma method
      data: createEmployeeDto
    })
  }

  async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if(role) return this.databaseService.employee.findMany({
      where: {
        role,
      }
    })
    return this.databaseService.employee.findMany(); // findMany() from Prisma
  }

  async findOne(id: number) {
    return this.databaseService.employee.findUnique({ // findUnique() is Prisma method
      where: {
        id
      }
    });
  }

  async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.databaseService.employee.update({ // updata() from Prisma
      where: {
        id,
      },
      data: updateEmployeeDto
    });
  }

  async remove(id: number) {
    return this.databaseService.employee.delete({ // delete() from Prisma
      where: {
        id,
      }
    });
  }
}

```

17. 4. `npm run start:dev` WE'LL TEST OUR CRUD REST API

--  RESULT : CRUD rest api with Neon-Prisma is working

------------------------ 06 CORS, RATE LIMITS,  SERVER LOGS, & EXEPTIONSm ------------------

18. GLOBAL PREFIX (We want to attach `api` for route)

-- To set a prefix for every route registered in an HTTP application => localhost/api/employees/3
-- in main.ts
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    `app.setGlobalPrefix('api')`
    await app.listen(3000);
  }
  bootstrap();

19. CORS (Cross-origin resource sharing)

--  is a mechanism that allows resources to be requested from another domain
-- it's important so people that are not in our domain at another origin can actually request some data from our API
-- we can keep a lit of allowed origin and only let those domain access what we have at our domain

```js
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors() // to apply CROS (opened in everywhere)
  app.setGlobalPrefix('api')
  await app.listen(3000);
}
bootstrap();
```

19. 1. OPTIONAL CONFIGURATION OBJECT ARGUMENT (we don't use it) TO SPECIFY ALLOWED ORIGIN 
- IS SAME LIKE INI NODEJS AND EXPRESS

```js
//// IN corsOptions.js
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;


//// IN allowedOrigin.js
const allowedOrigins = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'http://localhost:3000'
];

module.exports = allowedOrigins;
```

20. RATE LIMITING

- INSTALL : ` npm i --save @nestjs/throttler`

20. 1. INSIDE  app.module.ts TO CONFIGURE RATE LIMITING
`
`import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';`
`import { APP_GUARD } from '@nestjs/core';`

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    EmployeesModule,
```js
    ThrottlerModule.forRoot([
      {
        ttl: 60000,  // time to live (mili seconds)
        limit: 3,
      },
    ]),
```
  ],
  controllers: AppController,
```js
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
```
})
export class AppModule {}

20. 2. WE CREATE TWO OBJECT (short & long)
```js
ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // time to live (1 minute)
        limit: 3, // 3 time for every minute
      },
      {
        name: 'long',
        ttl: 30000,
        limit: 5
      }
    ]),
```

20. 3. INSIDE employees.controller.ts WE OVERRIDE AND SKIP RATE LIMIT

`@SkipThrottle({short: true}) // To skip rate limit named 'short' to all method`
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: Prisma.EmployeeCreateInput) {
    //EmployeeCreateInput create based on prisma modul after migration
    return this.employeesService.create(createEmployeeDto);
  }

  `@SkipThrottle({ short: false }) // we don't skip rate limit`
  @Get()
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return this.employeesService.findAll(role);
  }

  `@Throttle({ short: { ttl: 60000, limit: 1 } }) // override 'short'rate limit`
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: Prisma.EmployeeUpdateInput,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}

+++++++++++

GOOD TO KNOW :
if rate limit doesn't have name use : default
@SkipThrottle({ `default`: false }) 
@Throttle({ `default:` { ttl: 60000, limit: 1 } }) 

+++++++++++

21. LOGGER 

-- many deployed application make use of `winston`
-- but we're gonna use logger built in nestjs

21. 1. NESTJS LOGGER

```js
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn'], // level of logger = 'log', 'fatal', 'error', 'warn', 'debug', and 'verbose'
});
await app.listen(3000);
```

21. 2. CUSTOM IMPLEMENTATION TO OVERRIDE COMMON LOGGER SERVICE (we dont do this, default is fine)

22. 3. EXTENDS BUILT IN LOGGER (more preferred)

22. 4. WE CREATE NEW MODULE AND PROVIDER NAMED my-logger

`nest g module my-logger & nest g service my-logger` 

22. 5. INSIDE my-logger.service.ts
- we extends nestjs built in logger
- we formatted it and write it to file


```js
import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs'
import * as path from 'path'

@Injectable()
export class MyLoggerService extends ConsoleLogger { // extends nestjs built in logger

  // function for formating entry logs and write it to file
  async logTofile(entry: any) { 
    const formattedEntry = `${Intl.DateTimeFormat('en-US', { // Intl is (s internationalization support)
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Chicago'
    }).format(new Date())}\t${entry}\n`

    try {
      // if directory logs doesn't exist we create it
      if (!fs.existsSync(path.join(__dirname, "..", "..", "logs"))) { 
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
      }

       // if directory is exist it just append to the file
      await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', 'myLogFile.log'), formattedEntry)
    } catch(e) {
      if (e instanceof Error) console.error(e.message)
    }
  }

  // for log level
  log(message: any, context?: string) { 
    const entry = `${context}\t${message}`  // \t = tab
    this.logTofile(entry)

    super.log(message, context) 
  }

  // for error level
  error(message: any, stackOrContext?: string) { 
    const entry = `${stackOrContext}\t${message}`
    this.logTofile(entry)

    super.error(message, stackOrContext) 
  }
}

```

22. 6. INSIDE my-logger.module.ts WE ADD EXPORTS

import { Module } from '@nestjs/common';
import { MyLoggerService } from './my-logger.service';

@Module({
  providers: MyLoggerService,
  `exports: [MyLoggerService]`
})
export class MyLoggerModule {}


22. 7. APPLIED OUT EXTENDED BUILT IN LOG GLOBALLY IN main.ts (we dont choose this)

async function bootstrap() {
```js
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, 
  });
```
  `app.useLogger(app.get(MyLoggerService))`
  app.enableCors()
  app.setGlobalPrefix('api')
  await app.listen(3000);
}
bootstrap();

22. 8. APPLIED ONLY TO employees (what we do) INSIDE employees.controller.ts

```js
   // EmployeesController is context for logger
  private readonly logger = new MyLoggerService(EmployeesController.name)

  @Get()
  findAll(@Ip() ip: string, @Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') { //@Ip to get ip number from user (important to logger)
    this.logger.log(`Request for ALL Employees\t${ip}`, EmployeesController.name) // we want to get any ip addres of any request
    return this.employeesService.findAll(role);

```

23. EXCEPTION FILTER
-- While the base (built-in) exception filter can automatically handle many cases for you, `you may want full control over the exceptions layer`. For example, you may want to add logging or use a different JSON schema based on some dynamic factors. Exception filters are designed for exactly this purpose. `They let you control the exact flow of control and the content of the response sent back to the client`.

23. all-exception.filter.ts IN SRC

```js
import { Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { MyLoggerService } from "./my-logger/my-logger.service";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

type MyResponseObj = {
  statusCode: number,
  timeStamp: string,
  path: string,
  response: string | object
}

@Catch() // without argument it means it catch everything 
export class AllExceptionsFilter extends BaseExceptionFilter { 

  // we want to write exceptionn to our log
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name) 

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();          // ctx = context
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      timeStamp: new Date().toISOString(),
      path: request.url,
      response: '',
    }

    if(exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus()
      myResponseObj.response = exception.getResponse()
    } else if (exception instanceof PrismaClientValidationError) {
      myResponseObj.statusCode = 422
      myResponseObj.response = exception.message.replaceAll(/\n/g, ' ')
    } else {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR // 500
      myResponseObj.response = 'Internal Server Error'
    }

    response
      .status(myResponseObj.statusCode)
      .json(myResponseObj)
    
    this.logger.error(myResponseObj.response, AllExceptionsFilter.name)

    super.catch(exception, host) // refeerencing catch() from BaseExceptionFilter to extends functionality
  }
}
```

23. INSIDE main.ts FOR APPLIED TO OUR APLICATION


23. FORMAT RESPONSE IN THUNDER CLIENT
```json
{
  "statusCode": 429,
  "timeStamp": "2024-01-11T03:39:08.680Z",
  "path": "/api/employees",
  "response": "ThrottlerException: Too Many Requests"
}

{
  "statusCode": 422,
  "timeStamp": "2024-01-11T03:40:56.267Z",
  "path": "/api/employees?role=GYPSY%20CATCHER",
  "response": " Invalid `this.databaseService.employee.findMany()` invocation in D:\\5. P\\NestJS\\001\\lesson01\\src\\employees\\employees.service.ts:17:51    14 }   15    16 async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') { → 17   if(role) return this.databaseService.employee.findMany({          where: {            role: \"GYPSY CATCHER\"                  ~~~~~~~~~~~~~~~          }        })  Invalid value for argument `role`. Expected Role."
}
```










  























