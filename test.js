'use strict';

var chai = require('chai').use(require('chai-as-promised'));
var mongoose = require('mongoose');
var mongodb = require('mongodb')
var goosepage = require('.');
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var expect = chai.expect;

if (!process.env.MONGODB_URI) {
  throw new Error('you must define a test database via the MONGODB_URI environment variable');
}

describe('utils/pagination', () => {
  var Doc = mongoose.model('Doc', new mongoose.Schema({}));

  var db;

  before(() => {
    mongoose.connect(process.env.MONGODB_URI);
    return MongoClient
      .connect(process.env.MONGODB_URI)
      .then((connection) => db = exports.mongo = connection);
  });

  beforeEach(() => {
    return db.dropDatabase();
  });

  after(() => {
    db.close();
    mongoose.disconnect();
  });

  var seedDocuments = function(num) {
    var docs = Array(num).fill(0).map(() => (
      { _id: new ObjectID() }));

    return db.collection('docs').insert(docs)
      .then(() => docs);
  };

  describe('paginate', () => {
    it('returns the correct number of items', () => {
      return seedDocuments(6).then(query).then(assert);

      function query() {
        return goosepage(Doc.find(), { page: 0, itemsPerPage: 5 });
      }

      function assert(res) {
        expect(res).to.have.property('items').with.lengthOf(5);
      }
    });

    it('returns the total number of items', () => {
      return seedDocuments(16).then(query).then(assert);

      function query() {
        return goosepage(Doc.find());
      }

      function assert(res) {
        expect(res).to.have.property('total', 16);
      }
    });

    it('returns the page', () => {
      return seedDocuments(16).then(query).then(assert);

      function query() {
        return goosepage(Doc.find(), {
          page: 2,
          itemsPerPage: 3
        });
      }

      function assert(res) {
        expect(res).to.have.property('page', 2);
      }
    });

    it('returns the items per page', () => {
      return seedDocuments(5).then(query).then(assert);

      function query() {
        return goosepage(Doc.find(), {
          page: 0,
          itemsPerPage: 2
        });
      }

      function assert(res) {
        expect(res).to.have.property('itemsPerPage', 2);
      }
    });

    it('calculates the offset correctly', () => {
      var docs;

      return seedDocuments(11)
        .then((d) => docs = d)
        .then(query)
        .then(assert);

      function query() {
        return goosepage(Doc.find(), { page: 1, itemsPerPage: 5 });
      }

      function assert(res) {
        expect(res).to.have.property('items').with.lengthOf(5);
        expect(res.items[0]).to.have.property('_id');

        var fetchedIds = res.items.map((item) => String(item._id));
        expect(fetchedIds).to.contain(String(docs[5]._id));
        expect(fetchedIds).to.contain(String(docs[6]._id));
        expect(fetchedIds).to.contain(String(docs[7]._id));
        expect(fetchedIds).to.contain(String(docs[8]._id));
        expect(fetchedIds).to.contain(String(docs[9]._id));
      }
    });
  });
});
