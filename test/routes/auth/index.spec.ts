// import request from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import createServer from "server";

const app = createServer();

// const userCredential : {
//   email: string;
//   password: string;
// } ={
//   email: 'prakashpun@gmail.com',
//   password: 'shyam12345',  
// }

// var authenticatedUser = request.agent(app);

// before(function(done){
//   authenticatedUser
//     .post('/auth/login')
//     .send(userCredential)
//     .end(function(err, response){
//       expect(response.statusCode).to.equal(200);
//       done();
//     })
// })

const should = chai.should();
chai.use(chaiHttp);

describe("auth route", () => {
  it("should register user", (done) => {
    chai.request(app)
      .post("/auth/register")
      .send({
        'email': 'prakashpun@gmail.com',
        'userName': 'prakashpun',
        'password': 'shyam12345', 
      }).end((err, res) => {
        res.should.have.status(201);

        chai.request(app)
          .post('/auth/login')
          .send({
            'email': 'prakashpun@gmail.com',
            'password': 'shyam12345', 
          })
          .end((err, res) => {
            console.log('login test');
            res.body.should.have.property('token');
            var token = res.body.token;
          })
      })
      // .expect(200, done);
  });
});
