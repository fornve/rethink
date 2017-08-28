const Entity = require('../entity-rethinkdb')

class User extends Entity {
  assemble(data) {
    return new User(data);
  }
  getTable() {
    return 'user';
  }
};

module.exports = User
