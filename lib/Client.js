'use strict';

const { deprecate } = require('util');
const { createSocket } = require('dgram');

const { toBuffer } = require('osc-min');

const Message = require('./Message');

async function createClient(host,port) {
    const sock = createSocket({
        type: 'udp4',
        reuseAddr: true
      });
    return function sendMessage(...args) {
        let message = args[0];
        let callback = () => {};
        if (typeof args[args.length - 1] === 'function') {
          callback = args.pop();
        }
    
        if (message instanceof Array) {
          message = {
            address: message[0],
            args: message.splice(1)
          };
        }
        
        let mes;
        let buf;
        switch (typeof message) {
          case 'object':
            buf = toBuffer(message);
            sock.send(buf, 0, buf.length, port, host, callback);
            break;
          case 'string':
            mes = new Message(args[0]);
            for (let i = 1; i < args.length; i++) {
              mes.append(args[i]);
            }
            buf = toBuffer(mes);
            sock.send(buf, 0, buf.length, port, host, callback);
            break;
          default:
            throw new Error('That Message Just Doesn\'t Seem Right');
        }
      }
}



 

module.exports = createClient;
