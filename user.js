const Entity = require('./entity-rethinkdb')

class User extends Entity {
  getTable() {
    return 'user';
  }
};

module.exports = User
