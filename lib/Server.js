/* eslint-disable no-console */
'use strict';

const { deprecate } = require('util');
const { createSocket } = require('dgram');
const { EventEmitter } = require('events');

const decode = require('./decode');


function createServer(port,host) {
  return new Promise((resolve,reject) => {
    const sock = createSocket({
      type: 'udp4',
      reuseAddr: true
    });
    const eventEmitter = new EventEmitter();
    sock.on("error",reject);
    sock.on("listening", ()=>resolve(eventEmitter));
    sock.bind(port);
    sock.on('message', (msg, rinfo) => {
      let decoded = null;
      try {
        decoded = decode(msg);
        // [<address>, <typetags>, <values>*]
      }
      catch (e) {
        const error = new Error(`can't decode incoming message: ${e.message}`);
        this.emit('error', error, rinfo);
      }

      if (decoded) {
        eventEmitter.emit('message', decoded, rinfo);
        eventEmitter.emit(decoded[0], decoded, rinfo);
      }
    });
  });
}

// class Server extends EventEmitter {
//   constructor(port, host) {
//     super();
//     let decoded;
//     this.port = port;
//     this.host = host;
//     this._sock = createSocket({
//       type: 'udp4',
//       reuseAddr: true
//     });
//     this._sock.bind(port);
//     this._sock.on('message', (msg, rinfo) => {
//       try {
//         decoded = decode(msg);
//         // [<address>, <typetags>, <values>*]
//       }
//       catch (e) {
//         const error = new Error(`can't decode incoming message: ${e.message}`);
//         this.emit('error', error, rinfo);
//       }

//       if (decoded) {
//         this.emit('message', decoded, rinfo);
//         this.emit(decoded[0], decoded, rinfo);
//       }
//     });
//     this.kill = deprecate(
//       this.close,
//       'Client.kill() and Server.kill() are deprecated and will be removed in the next major version.\n'
//       + 'Use Server.close() and Client.close().',
//       'DEP0001'
//     );
//   }
//   close(cb) {
//     this._sock.close(cb);
//   }
// }

module.exports = createServer;
