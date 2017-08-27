const r = require("rethinkdb");
const Promise = require('bluebird');

class App {
  constructor() {

  }
  ready() {
    return Promise.all([this.rethinkDB()]);
  }
  rethinkDB() {
    let _base = this;
    _base.rethinkdb = {};
    return new Promise( (resolve, reject ) => {

      r.connect()
        .then( (connection) => {
          _base.rethinkdb.connection = connection;
          console.log( 'connected rethinkDB');
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

let app = new App();

module.exports = app;
