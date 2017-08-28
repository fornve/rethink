const r = require("rethinkdb")
const Chance = require("chance")
const app = require('../app')
const User = require('../models/user')
let chance = new Chance();

app.ready().then(() => {
  console.log( 'Starting test');

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

  } )
  .catch( (e) => {
    console.log( 'saving error' );
    console.log( e )
  });
}).catch( (e) => console.log );
