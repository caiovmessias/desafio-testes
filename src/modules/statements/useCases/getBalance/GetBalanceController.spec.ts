import request from 'supertest';
import { Connection } from 'typeorm';
import { createConnection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;

let token: string;
describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

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

    token = responseToken.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to get balance user authenticated', async () => {
    const response = await request(app)
    .get('/api/v1/statements/balance')
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('balance');
  });

  it('Should not be able to get balance with incorrect token', async () => {
    const response = await request(app)
    .get('/api/v1/statements/balance')
    .set({
      Authorization: `Bearer ${token}4598`,
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'JWT invalid token!'});
  });

});