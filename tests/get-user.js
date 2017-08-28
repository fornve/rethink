const r = require("rethinkdb")
const Chance = require("chance")
const app = require('../app')
const User = require('../models/user')
let chance = new Chance();

app.ready().then(() => {
  console.log( 'Starting test');
  try {
    new User().retrieve('47b6e2bf-fceb-4fc5-8a56-c85f6ca82fec').then( (user) => {
      console.log( user );
    });
  } catch (e) {
    console.log( e );
  }

  try {
    new User().collection({group: 1}).then( (users) => {
      console.log( 'Received '+ users.length )
      console.log( users );
    });
  } catch (e) {
    console.log( e );
  }


}).catch( (e) => console.log );
