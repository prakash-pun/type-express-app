// import request from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import createServer from "../../../src/server";

const app = createServer();

const should = chai.should();
chai.use(chaiHttp);

describe("auth route", () => {
  it("should register user", (done) => {
    chai
      .request(app)
      .post("/auth/register")
      .send({
        email: "prakashpun@gmail.com",
        userName: "prakashpun",
        password: "shyam12345",
      })
      .end((err, res) => {
        res.should.have.status(201);

        chai
          .request(app)
          .post("/auth/login")
          .send({
            email: "prakashpun@gmail.com",
            password: "shyam12345",
          })
          .end((err, res) => {
            console.log("login test");
            res.body.should.have.property("token");
            var token = res.body.token;
          });
      });
    // .expect(200, done);
  });
});
