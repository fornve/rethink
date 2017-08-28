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

          _base.rethinkPrepareDB().then( () => { resolve(); } );
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
  rethinkPrepareTable(table_name) {
    return new Promise( (resolve, reject) => {
      console.log( 'prepare '+ table_name );

      var tableOptions = {
        primaryKey: 'id',
        durability: 'hard'
      };
      try {
        r.tableCreate(table_name, tableOptions).run(this.rethinkdb.connection, () => {
          resolve();
        } );
      } catch (e) {
        reject( e );
      }
    });
  }
  rethinkPrepareDB() {
    let jobs = [];
    jobs.push(this.rethinkPrepareTable('user'));
    return Promise.all(jobs);
  }
}

let app = new App();

module.exports = app;
