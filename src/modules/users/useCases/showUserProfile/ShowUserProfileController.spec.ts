import request from 'supertest';
import { Connection } from 'typeorm';
import { createConnection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to show user', async () => {
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

    const { token } = responseToken.body;

    const response = await request(app)
    .get('/api/v1/profile')
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('Should not be able to show user with incorrect token', async () => {
    const userEmail = 'userincorrect@mail.com';
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

    const { token } = responseToken.body;

    const response = await request(app)
    .get('/api/v1/profile')
    .set({
      Authorization: `Bearer ${token}4569871`,
    });

    expect(response.status).toBe(401);
  });

  it('Should not be able to show user with token no exists', async () => {
    const userEmail = 'incorrect@mail.com';
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

    const response = await request(app)
    .get('/api/v1/profile')

    expect(response.status).toBe(401);
  });
});