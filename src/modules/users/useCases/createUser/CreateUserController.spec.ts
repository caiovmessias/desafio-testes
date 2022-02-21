import request from 'supertest';
import { Connection } from 'typeorm';
import { createConnection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  
  it('Should be able to create a new user', async () => {
    const responseUser = await request(app).post('/api/v1/users').send({
      name: 'User Test',
      email: 'user@email.com',
      password: '12345'
    });

    expect(responseUser.status).toBe(201);
  });

  it('Should not be able to create a new user with email already exists', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'User Test Duplicated',
      email: 'userduplicated@email.com',
      password: '12345'
    });

    const responseUser = await request(app).post('/api/v1/users').send({
      name: 'User Test Duplicated',
      email: 'userduplicated@email.com',
      password: '12345'
    });

    expect(responseUser.status).toBe(400);
    expect(responseUser.body).toEqual({ message: 'User already exists'});
  });
})