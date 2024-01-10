import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
      await this.$connect() // await connection to prisma
  }
}

// onModuleInit method is used to establish a connection to the database using the PrismaClient
//  PrismaClient allows you to perform database operations like querying and updating data.