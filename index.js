const r = require("rethinkdb")
const app = require('./app')
const User = require('./user')

app.ready().then(() => {
  console.log( 'Starting application');

  r.table("user").changes().run( app.rethinkdb.connection, function( err, cursor) {
    console.log( '*----------- START --------------*')
	if( cursor )
		cursor.each( console.log );
    console.log( '*------------- END --------------*')
  });

  let user = new User({
    email: 'marek@dajnowski.net',
    name: 'Marek Dajnowski',
  });

  user.address = 'wiatrakowa 15';

  user.save().then( (data) => {
    console.log( 'saved' );
    console.log( user )
  } )
  .catch( (e) => {
    console.log( 'saving error' );
    console.log( e )
  });

  console.log( user );

}).catch( (e) => console.log );
