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
