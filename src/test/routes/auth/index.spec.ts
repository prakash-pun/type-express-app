import request from "supertest";
import { expect } from "chai";

import createServer from "server";

const app = createServer();

describe("auth route", () => {
  it("should auth respont with 2000", (done) => {
    request(app).get("/auth").expect(200, done);
  });
});
