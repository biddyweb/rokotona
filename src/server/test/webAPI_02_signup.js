var should = require('should');
var request = require('supertest');
var app = require('../mainTest');
var sha1 = require('sha1');

describe('WEB API', function () {

    var req, res;

    describe('/signup POST', function () {
    
        it('works', function (done) {

            request(app)
                .get('/api/v1/test')
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}

                var time = res.body.time;
                
                // generate secret
                var tenSec = Math.floor(time / 1000 / 10);
                var key =  global.hashsalt + tenSec;
                var secret = sha1(key);

                request(app)
                    .post('/api/v1/signup')
                    .send({
                        email : global.user1.email,
                        password : global.user1.password,
                        secret : secret
                    })
                    .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.body.code.should.be.exactly(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('token_new');

                    done();
                
                });   

            }); 

        });

        it('duplicate email', function (done) {

            request(app)
            .get('/api/v1/test')
            .end(function (err, res) {

                if (err) {
                    throw err;
                }

                var time = res.body.time;
                
                // generate secret
                var tenSec = Math.floor(time / 1000 / 10);
                var key =  global.hashsalt + tenSec;
                var secret = sha1(key);

                request(app)
                    .post('/api/v1/signup')
                    .send({
                        email : global.user1.email,
                        password : global.user1.password,
                        secret: secret
                    })
                    .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.body.code.should.be.exactly(6000006);

                    done();
                
                });  

            }); 

        });

        it('wrong email', function (done) {

            request(app)
            .get('/api/v1/test')
            .end(function (err, res) {

                if (err) {
                    throw err;
                }

                var time = res.body.time;
                
                // generate secret
                var tenSec = Math.floor(time / 1000 / 10);
                var key =  global.hashsalt + tenSec;
                var secret = sha1(key);

                request(app)
                    .post('/api/v1/signup')
                    .send({
                        email : "this is not email",
                        password : global.user1.password,
                        secret: secret
                    })
                    .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.body.code.should.be.exactly(6000004);
                    
                    done();
                
                });   
            });   
        });

        it('wrong password', function (done) {


            request(app)
            .get('/api/v1/test')
            .end(function (err, res) {

                if (err) {
                    throw err;
                }

                var time = res.body.time;
                
                // generate secret
                var tenSec = Math.floor(time / 1000 / 10);
                var key =  global.hashsalt + tenSec;
                var secret = sha1(key);

                request(app)
                    .post('/api/v1/signup')
                    .send({
                        email : global.user1.email,
                        password : "bad",
                        secret: secret
                    })
                    .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.body.code.should.be.exactly(6000005);
                    
                    done();
                
                });   
            });   
        });

       it('wrong secret', function (done) {

            request(app)
                .post('/api/v1/signup')
                .send({
                    email : global.user1.email,
                    password : global.user1.password,
                    secret: "wrong secret"
                })
                .end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.body.code.should.be.exactly(6000007);
                
                done();
            
            });  

        });

       it('no secret', function (done) {

            request(app)
                .post('/api/v1/signup')
                .send({
                    email : global.user1.email,
                    password : global.user1.password
                })
                .end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.body.code.should.be.exactly(6000003);
                
                done();
            
            });  
              
        });
    });

});