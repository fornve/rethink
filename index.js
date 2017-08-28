const r = require("rethinkdb")
const app = require('./app')
const User = require('./models/user')

app.ready().then(() => {
  console.log( 'Starting application');

  r.table("user").changes().run( app.rethinkdb.connection, function( err, cursor) {
    console.log( '*----------- START --------------*')
	if( cursor )
		cursor.each( console.log );
    console.log( '*------------- END --------------*')
  });
}).catch( (e) => console.log );
