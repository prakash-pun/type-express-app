import request from "supertest";
import { expect } from "chai";
import createServer from "server";
import { response } from "express";

const app = createServer();

describe('note route', () => {
  it('should respond with 200 status', () => {
    request(app).get('/note').expect(200);
  });
  
  it('/note should post create note with status 201', (done) => {
    request(app).post('/note').send({
      title: "my note",
      subTitle: "subtitle of note",
      content: "this the content of the note that I create"
    })
      .expect(201, done)
      .then((response) => {
        expect(response.body).equal({
          title: "my note",
          subTitle: "subtitle of note",
          content: "this the content of the note that I create"
        })
      })
  });

  it('/note should update note with status 200', () => {
    request(app).post('/note/1').send({
      title: "my update note",
      subTitle: "subtitle of note",
      content: "this the content of the note that I create"
    })
      .expect(201)
      .then((response) => {
        expect(response.body).equal({
          title: "my update note",
          subTitle: "subtitle of note",
          content: "this the content of the note that I create"
        })
      })
  });

  it('/note/3434 should return 404 respone', (done) => {
    request(app).put('/note/3434').expect(404, done);
  });

  it('/note/2 should return 200 respone', (done) => {
    request(app).put('/note/2').expect(200, done);
  });
  
});
