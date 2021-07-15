"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var server_1 = __importDefault(require("server"));
var app = server_1.default();
describe('server check', function () {
    it('should create server without an error', function (done) {
        supertest_1.default(app).get("/").expect(200, done);
    });
});
