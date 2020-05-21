import * as request from 'supertest';

const appUrl = 'http://localhost:3000/api';

describe('AppController (e2e)', () => {

  it('/ (GET)', () => {
    return request(appUrl)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
