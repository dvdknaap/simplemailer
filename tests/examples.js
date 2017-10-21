'use strict';
const simpleMailer = require('../simpleMailer.js');

/* Run These tests by commandline from the root directory:
	NODE_TLS_REJECT_UNAUTHORIZED=0 node tests/examples.js
*/

simpleMailer.send({
    to: 'email@domain.com',
    subject: 'test mail 1',
    text: 'test text mail 1', //Not needed if not present it will create one from the html
    html: '<b>test html mail 1</b>'
});

simpleMailer.send({
    to: 'email@domain.com',
    subject: 'test mail 2',
    html: '<b>test html mail 2</b>'
});

simpleMailer.
	to('email@domain.com').
	subject('test mail 3').
	html('<b>test html mail 3</b>').
	send()
;

simpleMailer.
	to('email@domain.com').
	subject('test mail 4').
	template('./tests/testMail.html').
	send()
;