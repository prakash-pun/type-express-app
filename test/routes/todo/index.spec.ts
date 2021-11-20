import request from "supertest";
import { expect } from "chai";
import createServer from "../../../src/server";

const app = createServer();

describe("todo route", () => {
  it("should response with 200", () => {
    request(app)
      .get("/todo")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body);
      });
  });

  it("should post todo with respone 201", () => {
    request(app)
      .post("/todo")
      .send({
        text: "yo yo",
      })
      .expect(201)
      .then((response) => {
        expect(response.body).to.equal({ text: "yo" });
      });
  });

  it("should update the todo list", (done) => {
    request(app).put("/todo/dfdfdf").expect(401, done);
  });

  it("should delete the todo list", () => {});
});
