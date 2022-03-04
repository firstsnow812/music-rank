'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let app = require('../apps/music/api/index');

chai.should();
chai.use(chaiHttp);


// Test Case 들은 작성을 제대로 하지 못했습니다.
describe('API Response Test', () => {
    it("should get one records", (done) => {
    chai.request(app)
        .get('/genie/song/1')
        .end((err, res) => {
        console.log("body: " + res.body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
    });
  });
});
