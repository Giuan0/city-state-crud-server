process.env.NODE_ENV = 'test';

let server = require('../app');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

const State = require('../models/state.model');

describe('State CRUD', () => {
    beforeEach((done) => { //Before each test we empty the database
        State.deleteMany({}, (err) => {
            done();
        });
    });

    describe('GET tests', () => {
        it('Should get /state successfully', function (done) {
            chai.request(server)
                .get('/state')
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
        it('Should not post /state successfully (empty body)', function (done) {
            chai.request(server)
                .post('/state')
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

        it('Should not post /state successfully (invalid body)', function (done) {
            chai.request(server)
                .post('/state')
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

        it('Should not post /state successfully (invalid body)', function (done) {
            chai.request(server)
                .post('/state')
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

        it('Should not post /state successfully (valid body, empty props)', function (done) {
            chai.request(server)
                .post('/state')
                .send({name: '', abbreviation: ''})
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

        it('Should not post /state successfully (already exist)', function (done) {
            // workaround to use await/async features
            (async () => {
                const state = {name: 'CityName', abbreviation: 'Abbreviation'};
                try {
                    const removalResult = await State.deleteMany({
                        $or: [{name: state.name}, {abbreviation: state.abbreviation}]
                    });
                    const create = await State.create(state);
                } catch (err) {
                    console.log(err)
                }
                chai.request(server)
                    .post('/state')
                    .send(state)
                    .end((err, res) => {
                        try {
                            res.should.have.status(409);
                            res.body.should.have.property('message');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
            })();
        });

        it('Should post /state successfully (valid body)', function (done) {
            // workaround to use await/async features
            (async () => {
                const state = {name: 'state name', abbreviation: 'SN'};
                const removalResult = await State.deleteMany({
                    $or: [{name: state.name}, {abbreviation: state.abbreviation}]
                });
                chai.request(server)
                    .post('/state')
                    .send(state)
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
            })();
        });

        describe('PUT tests', () => {
            it('Should put /state successfully', function (done) {
                // workaround to use await/async features
                (async () => {
                    const state = {name: 'CityName', abbreviation: 'Abbreviation'};
                    let newState;
                    const modification = {name: 'new name', abbreviation: 'NA'}
                    try {
                        const removalResult = await State.deleteMany({
                            $or: [{name: state.name}, {abbreviation: state.abbreviation}]
                        });
                        const removalResult2 = await State.deleteMany({
                            $or: [{name: modification.name}, {abbreviation: modification.abbreviation}]
                        });
                        newState = await State.create(state);
                    } catch (err) {
                        done(err);
                    }

                    chai.request(server)
                        .put('/state/' + newState._id)
                        .send(modification)
                        .end((err, res) => {
                            try {
                                res.should.have.status(200);
                                res.body.should.have.property('data');
                                res.body.should.have.property('message');
                                done();
                            } catch (err) {
                                done(err);
                            }
                        });
                })();
            });

            it('Should not put /state successfully (state not found)', function (done) {
                (async () => {
                    try {
                        const id = '507f1f77bcf86cd799439011';
                        const removalResult = await State.deleteOne({_id: id})
                        chai.request(server)
                            .put('/state/' + id)
                            .send({name: 'some name', abbreviation: 'some abbreviation'})
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

        describe('DELETE tests', () => {
            it('Should not delete /state successfully (state not found)', function (done) {
                (async () => {
                    try {
                        const id = '507f1f77bcf86cd799439011';
                        const removalResult = await State.deleteOne({_id: id})
                        chai.request(server)
                            .delete('/state/' + id)
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

            it('Should delete /state successfully', function (done) {
                (async () => {
                    try {
                        const newState = {name: 'new state', abbreviation: 'NE'};
                        const removalResult = await State.deleteMany({
                            $or: [{name: newState.name}, {abbreviation: newState.abbreviation}]
                        });
                        const insertResult = await State.create(newState);
                        chai.request(server)
                            .delete('/state/' + insertResult._id)
                            .end(async (err, res) => {
                                try {
                                    res.should.have.status(200);
                                    res.body.should.have.property('message');
                                    res.body.should.have.property('data');
                                    const removedState = await State.findOne(insertResult._id);
                                    chai.assert(removedState === null);
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
});
