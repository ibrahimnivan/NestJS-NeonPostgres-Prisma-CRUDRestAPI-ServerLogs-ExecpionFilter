import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Ip
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@SkipThrottle({short: true}) // To skip rate limit named 'short'
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // EmployeesController is context for logger
  private readonly logger = new MyLoggerService(EmployeesController.name)

  @Post()
  create(@Body() createEmployeeDto: Prisma.EmployeeCreateInput) { //EmployeeCreateInput create based on prisma modul after migration
    return this.employeesService.create(createEmployeeDto);
  }

  @SkipThrottle({ short: false }) // we don't skip rate limit
  @Get()
  findAll(@Ip() ip: string, @Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') { //@Ip to get ip number from user (important to logger)
    this.logger.log(`Request for ALL Employees\t${ip}`, EmployeesController.name) // we want to get any ip addres of any request
    return this.employeesService.findAll(role);
  }

  @Throttle({ short: { ttl: 60000, limit: 1 } }) // override 'short'rate limit
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
