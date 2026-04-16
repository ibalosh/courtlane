import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SESSION_COOKIE_NAME } from '../../src/modules/auth/auth.constants';
import { faker } from '@faker-js/faker';
import { closeTestApp, createTestApp } from '../support/test-app';

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
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        name: 'Test User',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toEqual({
      id: expect.any(Number),
      email,
      name: 'Test User',
    });
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining(`${SESSION_COOKIE_NAME}=`),
        expect.stringContaining('HttpOnly'),
      ]),
    );
  });
});
