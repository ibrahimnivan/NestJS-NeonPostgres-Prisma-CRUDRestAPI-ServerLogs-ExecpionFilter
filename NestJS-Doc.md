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

7. CREATE ROUTING LOGIC IN OUR CONTROLLER

8. CREATE LOGIC FOR HANDLING EACH ROUTES INSIDE THE PROVIDER


