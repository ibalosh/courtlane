import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { env } from '../../src/config/env';
import { closeTestApp, createTestApp } from '../support/test-app';

function signupRequest(app: INestApplication) {
  return request(app.getHttpServer()).post('/auth/signup').set('Origin', env.webAppUrl);
}

describe('Users HTTP', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  it('updates the authenticated user profile', async () => {
    const email = faker.internet.email().toLowerCase();
    const signupResponse = await signupRequest(app).send({
      email,
      name: 'Profile User',
      password: 'password123',
    });

    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Origin', env.webAppUrl)
      .set('Cookie', signupResponse.headers['set-cookie'])
      .send({
        email: faker.internet.email().toLowerCase(),
        name: 'Updated User',
      });

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({
      id: expect.any(Number),
      accountId: expect.any(Number),
      email: expect.any(String),
      name: 'Updated User',
    });
  });

  it('updates the password when the current password is valid', async () => {
    const email = faker.internet.email().toLowerCase();
    await signupRequest(app).send({
      email,
      name: 'Password User',
      password: 'password123',
    });

    const loginResponse = await request(app.getHttpServer()).post('/auth/login').set('Origin', env.webAppUrl).send({
      email,
      password: 'password123',
    });

    const updateResponse = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Origin', env.webAppUrl)
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send({
        email,
        name: 'Password User',
        currentPassword: 'password123',
        newPassword: 'new-password123',
      });

    expect(updateResponse.status).toBe(200);

    const reloginResponse = await request(app.getHttpServer()).post('/auth/login').set('Origin', env.webAppUrl).send({
      email,
      password: 'new-password123',
    });

    expect(reloginResponse.status).toBe(201);
  });

  it('rejects profile password changes when the current password is wrong', async () => {
    const email = faker.internet.email().toLowerCase();
    const signupResponse = await signupRequest(app).send({
      email,
      name: 'Rejected Password User',
      password: 'password123',
    });

    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Origin', env.webAppUrl)
      .set('Cookie', signupResponse.headers['set-cookie'])
      .send({
        email,
        name: 'Rejected Password User',
        currentPassword: 'wrong-password',
        newPassword: 'new-password123',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Current password is incorrect.');
  });
});
