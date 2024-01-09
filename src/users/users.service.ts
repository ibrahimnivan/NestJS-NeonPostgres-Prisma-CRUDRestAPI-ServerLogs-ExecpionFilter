import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    // some data to work with (we dont use database now)
    {
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      role: 'INTERN',
    },
    {
      id: 2,
      name: 'Ervin Howell',
      email: 'Shanna@melissa.tv',
      role: 'INTERN',
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      email: 'Nathan@yesenia.net',
      role: 'ENGINEER',
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      email: 'Julianne.OConner@kory.org',
      role: 'ENGINEER',
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      email: 'Lucio_Hettinger@annie.ca',
      role: 'ADMIN',
    },
  ];

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
}
