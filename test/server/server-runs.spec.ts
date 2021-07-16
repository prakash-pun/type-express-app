import request from 'supertest';
import { expect } from 'chai';
import createServer from 'server';

const app = createServer();

describe('server check', () => {
  it('should create server without an error', (done) => {
    request(app).get("/").expect(200, done)
  });
});
