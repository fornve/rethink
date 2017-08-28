const r = require("rethinkdb")
const Chance = require("chance")
const app = require('../app')
const User = require('../models/user')
let chance = new Chance();

app.ready().then(() => {
  console.log( 'Starting test');
  try {
    let user = new User({
      email: chance.email(),
      name: chance.name(),
      address: chance.address(),
      account: chance.integer({min: 1, max: 100000}),
      group: 1,
    });

    user.save().then( (data) => {
      console.log( 'saved' );
      console.log( user )

      user.delete().then(() => {
        new User().retrieve(user.id).then((check) => {
          console.log( check ); // shuld be null
        });
      });
    });
  } catch (e) {
    console.log( e );
  }
}).catch( (e) => console.log );
