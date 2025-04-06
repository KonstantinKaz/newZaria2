export interface IUser {
    id: string;
    name: string;
    email: string;
    rights: 'USER' | 'ADMIN';
    surname?: string;
    patronymic?: string;
    gender?: string;
    birthday?: string; 
  }
