var mysql = require('mysql');

// db Connection
// var connection = mysql.createConnection({
//   host: "192.168.1.103",
//   user: "ideal2",
//   password: "$$103iDeal@BeTa##",
//   database: "ideal_beta",
//   port: "3306"
// });
// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("Succesfully Connected to the Mysql Database");
// });
// var connection;
var db_config =
{
  host: "192.168.1.103",
  user: "ideal2",
  password: "$$103iDeal@BeTa##",
  database: "ideal_kra",
  port: "3306"
};

var pool = mysql.createPool(db_config);
var getConnection = function (callback) {
  pool.getConnection(function (err, connection) {
    // console.log("Succesfully Connected to the Mysql Database")
    callback(err, connection);
  });
};
// function handleDisconnect() {
//   connection = mysql.createPool(db_config); // Recreate the connection, since
//   // the old one cannot be reused.

//   connection.connect(function (err) {              // The server is either down
//     if (err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     } else{
//       console.log("Succesfully Connected to the Mysql Database")
//     }                                    // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//   // If you're also serving http, display a 503 error.
//   connection.on('error', function (err) {
//     console.log('db error', err);
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
//   connection.on('error', function (err){
//     if(err.code === 'ETIMEDOUT' ){
//         connection.connect();
//     }
// });
// }
// handleDisconnect();
module.exports = getConnection;