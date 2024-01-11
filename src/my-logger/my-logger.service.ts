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

    super.log(message, context) // referencing log() method from ConsoleLogger class o extends functionality
  }

  // for error level
  error(message: any, stackOrContext?: string) { 
    const entry = `${stackOrContext}\t${message}`
    this.logTofile(entry)

    super.error(message, stackOrContext) // // referencing error() method from ConsoleLogger class
  }
}
