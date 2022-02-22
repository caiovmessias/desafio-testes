import request from 'supertest';
import { Connection } from 'typeorm';
import { createConnection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;

let token: string;
describe('Create Statement Controller', () => {
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

  describe('Create Statement DEPOSIT', () => {
    it('Should be able to create statement with type DEPOSIT', async () => {
      const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 150,
        description: 'Deposito conta'
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('Should not be able to create statement with type DEPOSIT incorrect token', async () => {
      const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 150,
        description: 'Deposito conta'
      })
      .set({
        Authorization: `Bearer ${token}45998`,
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'JWT invalid token!'});
    });
  });

  describe('Create Statement WITHDRAW', () => {
    it('Should be able to create statement with type WITHDRAW', async () => {
      const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 50,
        description: 'Saque conta'
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('Should not be able to create statement with type WITHDRAW incorrect token', async () => {
      const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 50,
        description: 'Saque conta'
      })
      .set({
        Authorization: `Bearer ${token}45998`,
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'JWT invalid token!'});
    });

    it('Should not be able to create statement with type WITHDRAW insuficient balance', async () => {
      const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 5000000,
        description: 'Saque conta'
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Insufficient funds'});
    });
  });
});