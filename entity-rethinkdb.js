const app = require('./app')
const r = require("rethinkdb")

class Entity {
  constructor(data) {
    this.id = undefined;
    this.created = new Date();

    for(let key in data) {
      if(data.hasOwnProperty(key) && !this.isReserved(key)) {
        this[key] = data[key];
      }
    }
  }
  isReserved(key) {
    for(let reserved in this.getReserved()) {
      if(key === reserved) {
        return true;
      }
    }

    return false;
  }
  getConnection() {
    return app.rethinkdb.connection;
  }
  getReserved() {
    return ['table'];
  }
  save() {
    var _base = this;
    return Promise.resolve(this.saveRecord())
      .then( (data) => {
        _base.id = data.generated_keys[0];
      })
      .catch( (e) => console.log );
  }
  saveRecord() {
    if(this.id) {
      // Create new record
      return r.table(this.getTable())
        .update(this.id, this.toDataObject())
        .run(this.getConnection());
    } else {
      // Update existing record
      let data = this.toDataObject();
      delete(data.id);
      try {
        return r.table(this.getTable())
          .insert(data)
          .run(this.getConnection());
      } catch (e) {
        console.log( e );
      }
    }
  }
  toDataObject() {
    let data = {};
    for(let key in this) {
      if(this.hasOwnProperty(key) && !this.isReserved(key)) {
        data[key] = this[key];
      }
    }
    return data;
  }
};

module.exports = Entity;
