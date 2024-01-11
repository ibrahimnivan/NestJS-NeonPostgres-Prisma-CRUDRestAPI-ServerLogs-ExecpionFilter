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