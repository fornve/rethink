const app = require('./app')
const r = require("rethinkdb")

class Entity {
  collection(filter) {
    let _base = this;
    return new Promise((resolve, reject) => {
      r.table(this.getTable()).filter(filter).run(app.rethinkdb.connection, (error, cursor) => {
        let objects = [];

        cursor.each(function(error, row){
          console.log( row );
          if( row < 0 ) {
            cursor.close();
          } else {
            objects.push(_base.assemble(row));
          }
        }, function(){
          if(objects.length) {
            resolve(objects);
          } else {
            resolve(null);
          }
        });
      });
    });
  }
  delete() {
    console.log('Deleting '+ this.id);
    return new Promise((resolve, reject) => {
      r.table(this.getTable()).get(this.id).delete().run(app.rethinkdb.connection, (error, cursor) => {
        resolve();
      });
    });
  }
  constructor(data) {
    this.id = undefined;
    this.created = new Date();

    for(let key in data) {
      if(data.hasOwnProperty(key) && !this.isReserved(key)) {
        this[key] = data[key];
      }
    }
  }
  getConnection() {
    return app.rethinkdb.connection;
  }
  getReserved() {
    return ['table'];
  }
  isReserved(key) {
    for(let reserved in this.getReserved()) {
      if(key === reserved) {
        return true;
      }
    }

    return false;
  }
  retrieve(id) {
    return new Promise((resolve, reject) => {
      r.table(this.getTable()).get(id).run(app.rethinkdb.connection, (error, data) => {
        if(data) {
          resolve(this.assemble(data));
        } else {
          resolve(null);
        }
      });
    });
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
