import request from "supertest";
import { expect } from "chai";

import createServer from "server";

const app = createServer();

describe("auth route", () => {
  it("should auth respond with 200", (done) => {
    request(app).get("/auth").expect(200, done);
  });
});
