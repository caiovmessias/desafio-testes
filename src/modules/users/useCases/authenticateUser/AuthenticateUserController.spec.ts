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

  it('Should be able authenticate user with user exists', async () => {
    const responseUser = await request(app).post('/api/v1/users').send({
      name: 'User',
      email: 'user@mail.com',
      password: '12345'
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: responseUser.body.email,
      password: responseUser.body.password,
    })
  });
});