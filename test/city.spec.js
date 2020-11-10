process.env.NODE_ENV = 'test';

let server = require('../app');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

const State = require('../models/state.model');
const City = require('../models/city.model');

describe('City CRUD', () => {
    beforeEach((done) => { //Before each test we empty the database
        State.deleteMany({}, (err) => {
            City.deleteMany({}, (err) => {
                done();
            })
        });
    });

    describe('GET tests', () => {
        it('Should get /state successfully', function (done) {
            chai.request(server)
                .get('/city')
                .end((err, res) => {
                    try {
                        res.should.have.status(200);
                        res.body.data.should.be.a('array');
                        res.body.should.have.property('data');
                        res.body.should.have.property('message');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });
    });

    describe('POST tests', () => {
        it('Should not post /city successfully (empty body)', function (done) {
            chai.request(server)
                .post('/city')
                .send({})
                .end((err, res) => {
                    try {
                        res.should.have.status(400);
                        res.body.should.have.property('data');
                        res.body.should.have.property('message');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });

        it('Should not post /city successfully (invalid body)', function (done) {
            chai.request(server)
                .post('/city')
                .send({name: ''})
                .end((err, res) => {
                    try {
                        res.should.have.status(400);
                        res.body.should.have.property('data');
                        res.body.should.have.property('message');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });

        it('Should not post /city successfully (invalid body)', function (done) {
            chai.request(server)
                .post('/city')
                .send({name: 'Paraíba', randomProp: ''})
                .end((err, res) => {
                    try {
                        res.should.have.status(400);
                        res.body.should.have.property('data');
                        res.body.should.have.property('message');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });

        it('Should not post /city successfully (valid body, empty props)', function (done) {
            chai.request(server)
                .post('/city')
                .send({name: '', state: ''})
                .end((err, res) => {
                    try {
                        res.should.have.status(400);
                        res.body.should.have.property('data');
                        res.body.should.have.property('message');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });
    });

    it('Should post /city successfully (valid body)', function (done) {
        // workaround to use await/async features
        (async () => {
            try {
                const state = {name: 'StateName', abbreviation: 'CN'};
                const removalResult = await State.deleteMany({
                    $or: [{name: state.name},
                        {abbreviation: state.abbreviation}]
                });
                const newState = await State.create(state);
                const city = {name: 'CityName', state: newState._id};
                chai.request(server)
                    .post('/city/')
                    .send(city)
                    .end(async (err, res) => {
                        try {
                            res.should.have.status(200);
                            res.body.should.have.property('data');
                            res.body.should.have.property('message');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
            } catch (err) {
                console.log(err);
                done(err);
            }
        })();
    });

    describe('PUT tests', () => {
        it('Should put /city successfully', function (done) {
            // workaround to use await/async features
            (async () => {
                const state = {name: 'StateName', abbreviation: 'Abbreviation'};
                const modification = {name: 'new name', abbreviation: 'NA'}
                try {
                    const removalResult = await State.deleteMany({
                        $or: [{name: state.name}, {abbreviation: state.abbreviation}]
                    });
                    const newState = await State.create(state);
                    const city = {name: 'new city', state: newState._id};
                    const insertedCity = await City.create(city);
                    const newCity = {name: 'edited city'};

                    chai.request(server)
                        .put('/city/' + insertedCity._id)
                        .send(newCity)
                        .end(async (err, res) => {
                            try {
                                res.should.have.status(200);
                                res.body.should.have.property('data');
                                res.body.should.have.property('message');
                                const editedCity = await City.findOne({_id: insertedCity._id});
                                chai.expect(editedCity.name).to.equal(newCity.name);
                                done();
                            } catch (err) {
                                done(err);
                            }
                        });
                } catch (err) {
                    done(err);
                }
            })();
        });
        //
        it('Should not put /city successfully (city not found)', function (done) {
            (async () => {
                try {
                    const id = '507f1f77bcf86cd799439011';
                    const removalResult = await State.deleteOne({_id: id})
                    chai.request(server)
                        .put('/city/' + id)
                        .send({name: 'some name'})
                        .end((err, res) => {
                            try {
                                res.should.have.status(404);
                                res.body.should.have.property('message');
                                done();
                            } catch (err) {
                                done(err);
                            }
                        });
                } catch (err) {
                    done(err);
                }
            })();
        });
    });
    //
    describe('DELETE tests', () => {
        it('Should not delete /city successfully (state not found)', function (done) {
            (async () => {
                try {
                    const id = '507f1f77bcf86cd799439011';
                    const removalResult = await City.deleteOne({_id: id});
                    chai.request(server)
                        .delete('/city/' + id)
                        .end((err, res) => {
                            try {
                                res.should.have.status(404);
                                res.body.should.have.property('message');
                                done();
                            } catch (err) {
                                done(err);
                            }
                        });
                } catch (err) {
                    done(err);
                }
            })();
        });
        //
        it('Should delete /state successfully', function (done) {
            (async () => {
                try {
                    const state = {name: 'state name', abbreviation: 'SN'};
                    const removalResult = await State.deleteMany({
                        $or: [{name: state.name}, {abbreviation: state.abbreviation}]
                    });
                    const newState = await State.create(state);
                    const city = {name: 'new city', state: newState._id};
                    const insertedCity = await City.create(city);

                    chai.request(server)
                        .delete('/city/' + insertedCity._id)
                        .end(async (err, res) => {
                            try {
                                res.should.have.status(200);
                                res.body.should.have.property('message');
                                res.body.should.have.property('data');
                                const removedCity = await City.findOne(insertedCity._id);
                                chai.expect(removedCity).to.equal(null);
                                done();
                            } catch (err) {
                                done(err);
                            }
                        });
                } catch (err) {
                    done(err);
                }
            })();
        });
    });
});
