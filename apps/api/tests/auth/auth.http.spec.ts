import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SESSION_COOKIE_NAME } from '../../src/modules/auth/auth.cookies';
import { faker } from '@faker-js/faker';
import { env } from '../../src/config/env';
import { closeTestApp, createTestApp } from '../support/test-app';

function signupRequest(app: INestApplication) {
  return request(app.getHttpServer()).post('/auth/signup').set('Origin', env.webAppUrl);
}

describe('Auth HTTP', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  it('creates a user and session cookie on signup', async () => {
    const email = faker.internet.email().toLowerCase();
    const response = await signupRequest(app).send({
      email,
      name: 'Test User',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toEqual({
      id: expect.any(Number),
      accountId: expect.any(Number),
      email,
      name: 'Test User',
    });
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining(`${SESSION_COOKIE_NAME}=`), expect.stringContaining('HttpOnly')]),
    );
  });

  it('returns the authenticated user from /auth/me with a valid session', async () => {
    const email = faker.internet.email().toLowerCase();
    const signupResponse = await signupRequest(app).send({
      email,
      name: 'Session User',
      password: 'password123',
    });

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', signupResponse.headers['set-cookie']);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({
      id: expect.any(Number),
      accountId: expect.any(Number),
      email,
      name: 'Session User',
    });
  });

  it('returns null from /auth/me without a session', async () => {
    const response = await request(app.getHttpServer()).get('/auth/me');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: null });
  });

  it('updates the authenticated user profile', async () => {
    const email = faker.internet.email().toLowerCase();
    const signupResponse = await signupRequest(app).send({
      email,
      name: 'Profile User',
      password: 'password123',
    });

    const response = await request(app.getHttpServer())
      .patch('/auth/me')
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
      .patch('/auth/me')
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
      .patch('/auth/me')
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

  it('allows state-changing requests from the configured web origin', async () => {
    const email = faker.internet.email().toLowerCase();

    const response = await signupRequest(app).send({
      email,
      name: 'Allowed Origin',
      password: 'password123',
    });

    expect(response.status).toBe(201);
  });

  it('rejects state-changing requests from a different origin', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Origin', 'https://evil.example')
      .send({
        email: faker.internet.email().toLowerCase(),
        name: 'Blocked Origin',
        password: 'password123',
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Invalid request origin',
      error: 'Forbidden',
      statusCode: 403,
    });
  });

  it('allows state-changing requests with an allowed referer', async () => {
    const email = faker.internet.email().toLowerCase();

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Referer', `${env.webAppUrl}/signup`)
      .send({
        email,
        name: 'Allowed Referer',
        password: 'password123',
      });

    expect(response.status).toBe(201);
  });

  it('rejects malformed referer headers', async () => {
    const response = await request(app.getHttpServer()).post('/auth/signup').set('Referer', 'not-a-valid-url').send({
      email: faker.internet.email().toLowerCase(),
      name: 'Bad Referer',
      password: 'password123',
    });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Invalid referer header',
      error: 'Forbidden',
      statusCode: 403,
    });
  });

  it('rejects state-changing requests without origin headers', async () => {
    const email = faker.internet.email().toLowerCase();

    const response = await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      name: 'No Origin',
      password: 'password123',
    });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Missing request origin',
      error: 'Forbidden',
      statusCode: 403,
    });
  });
});
