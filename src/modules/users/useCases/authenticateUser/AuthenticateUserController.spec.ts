import request from 'supertest';
import { Connection } from 'typeorm';
import { createConnection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able authenticate user with user exists', async () => {
    const userEmail = 'user@mail.com';
    const userPassword = '12345';
    
    await request(app).post('/api/v1/users').send({
      name: 'User',
      email: userEmail,
      password: userPassword,
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: userEmail,
      password: userPassword,
    });

    expect(responseToken.status).toBe(200);
    expect(responseToken.body).toHaveProperty('token');
  });

  it('Should not be able authenticate user with incorrect password', async () => {
    const userEmail = 'userincorrect@mail.com';
    const userPassword = '12345';
    
    await request(app).post('/api/v1/users').send({
      name: 'User',
      email: userEmail,
      password: userPassword,
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: userEmail,
      password: 'XXXX',
    });

    expect(responseToken.status).toBe(401);
    expect(responseToken.body).toEqual({ message: 'Incorrect email or password'});
  });

  it('Should not be able authenticate user with incorrect email', async () => {
    const userEmail = 'incorrectemail@mail.com';
    const userPassword = '12345';
    
    await request(app).post('/api/v1/users').send({
      name: 'User',
      email: userEmail,
      password: userPassword,
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'incorrect@mail.com',
      password: userPassword,
    });

    expect(responseToken.status).toBe(401);
    expect(responseToken.body).toEqual({ message: 'Incorrect email or password'});
  });
});