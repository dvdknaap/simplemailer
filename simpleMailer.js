'use strict';

const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const _          = require('lodash/fp/object');

var simpleMailer = {
	"init": function (configLocation) {

		const fs   = require('fs');

		// Check if we received an app dir
		if (typeof configLocation === "undefined") {
			let path   = require('path');
			configLocation = path.dirname(require.main.filename+'/config.json');
		}

		// Check if config is in project root
		if (fs.existsSync(configLocation)) {
			this.config = require(configLocation);

			this.options =  {
			    from: this.config.SIMPLEMAILER.FROMNAME+" <"+this.config.SIMPLEMAILER.FROMEMAIL+">",
			    to: '',
			    subject: '',
			    text: '',
			    html: ''
			};

			this.serverConnection =  {
			    host: this.config.SIMPLEMAILER.SERVER.HOST,
			    port: this.config.SIMPLEMAILER.SERVER.PORT,
			    secure: this.config.SIMPLEMAILER.SERVER.SECURE, // upgrade later with STARTTLS
			    auth: {
			        user: this.config.SIMPLEMAILER.SERVER.USERNAME,
			        pass: this.config.SIMPLEMAILER.SERVER.PASSWORD
			    }
			};
		}
		// No config.json found
		else {
			throw new Error("No config.json found, read README.md for help");
		}
	},
	"config": {
		"SIMPLEMAILER": {
			"SERVER": {
				"HOST":"mail.domain.com",
				"PORT":"587",
				"USERNAME":"username",
				"PASSWORD":"password",
				"SECURE": "false",
				"DKIM": {
				"DOMAINNAME": "mail.domain.com",
				"KEYSELECTOR": "2017",
				"PRIVATEKEY": "./DKIM/private.key",
				"CACHEDIR": "/tmp",
				"CACHETRESHOLD": 86400
			},
			"TLS": {
				"REJECTUNAUTHORIZED": false
			},
		},
		"FROMNAME": "from name",
		"FROMEMAIL": "email@domain.com",
		"REPLYTO": "reply@domain.com"
		}
	},
	//Default options for sending mail
	"options":  {
	    from: "",
	    to: '',
	    subject: '',
	    text: '',
	    html: ''
	},
	//Default server connection
	"serverConnection":  {
	    host: "",
	    port: "",
	    secure: "", // upgrade later with STARTTLS
	    auth: {
	        user: "",
	        pass: ""
	    }
	},
	/**
	 * Add an from address
	 * @url https://nodemailer.com/message/
	 * @param  mixed fromAddress	The email address of the sender. All email addresses can be plain ‘sender@server.com’ or formatted ’“Sender Name” sender@server.com‘

	   Examples:
		1. 'sender@server.com'
		2. '"Sender Name sender@server.com'
		3. '"Name, User" <baz@blurdybloop.com>'
		4. {
			    name: 'Майлер, Ноде',
			    address: 'foobar@blurdybloop.com'
			}

	 * @return object            Return this class
	 */
	"from": function (fromAddress) {

		this.options.from = fromAddress;

		return this;
	},
	/**
	 * Add an reply to address
	 * @url https://nodemailer.com/message/
	 * @param  String 	Add an to email address can be comma seperated
	   Examples:
		1. 'foobar@blurdybloop.com'
		2. '"Ноде Майлер" <bar@blurdybloop.com>'
		3. '"Name, User" <baz@blurdybloop.com>'

	 * @return object            Return this class
	 */
	"replyto": function (replyTo) {
		this.options.replyTo = replyTo;

		return this;
	},
	/**
	 * Add an to address
	 * @url https://nodemailer.com/message/addresses/
	 * @param  mixed toAddress This can be an string with an email address or an array
	   Example:
		[
		    'foobar@blurdybloop.com',
		    '"Ноде Майлер" <bar@blurdybloop.com>',
		    '"Name, User" <baz@blurdybloop.com>'
		]

	 * @return object            Return this class
	 */
	"to": function (toAddress)  {

		this.options.to = toAddress;

		return this;
	},
	/**
	 * Add an bcc address
	 * @url https://nodemailer.com/message/addresses/
	 * @param  mixed bccAddress This can be an string with an email address or an array
	   Example:
	   [
		    'foobar@blurdybloop.com',
		    {
		        name: 'Майлер, Ноде',
		        address: 'foobar@blurdybloop.com'
		    }
		]

	 * @return object            Return this class
	 */
	"bcc": function (bccAddress) {

		this.options.bcc = bccAddress;

		return this;
	},
	/**
	 * Add an subject
	 * @url https://nodemailer.com/message/addresses/
	 * @param  string subject This will add the subject of the mail
	   Example:
	   'My awesome subject'

	 * @return object            Return this class
	 */
	"subject": function (subject) {

		this.options.subject = subject;

		return this;
	},
	/**
	 * Add text message
	 * @param  string Add an text message for the mail
	   Example:
	   'text mail'

	 * @return object            Return this class
	 */
	"text": function (text) {

		this.options.text = text;

		return this;
	},
	/**
	 * Add html message
	 * @param  string html Add an html message for the mail
	   Example:
	   '<b>html mail</b>'

	 * @return object            Return this class
	 */
	"html": function (html) {

		this.options.html = html;

		return this;
	},
	/**
	 * Add mail body from file
	 * @param  string templateFile Location of the mail message
	   Example:
	   './templates/mail/confirmMail.html'

	 * @return object            Return this class
	 */
	"template": function (templateFile) {

		this.options.html = fs.readFileSync(templateFile);

		return this;
	},

	/**
	 * Add an attachment to the mail
	 * @url	https://nodemailer.com/message/attachments/
	 * @param  array attachment Array with keys shown bewlow
	 * Attachment object consists of the following properties:
	    filename - filename to be reported as the name of the attached file. Use of unicode is allowed.
	    content - String, Buffer or a Stream contents for the attachment
	    path - path to the file if you want to stream the file instead of including it (better for larger attachments)
	    href - an URL to the file (data uris are allowed as well)
	    contentType - optional content type for the attachment, if not set will be derived from the filename property
	    contentDisposition - optional content disposition type for the attachment, defaults to ‘attachment’
	    cid - optional content id for using inline images in HTML message source
	    encoding - If set and content is string, then encodes the content to a Buffer using the specified encoding. Example values: ‘base64’, ‘hex’, ‘binary’ etc. Useful if you want to use binary attachments in a JSON formatted email object.
	    headers - custom headers for the attachment node. Same usage as with message headers
	    raw - is an optional special value that overrides entire contents of current mime node including mime headers. Useful if you want to prepare node contents yourthis

	 * @return object            Return this class
	 */
	"addAttachment": function (attachment) {
		if (typeof this.options.attachments === "undefined") {
			this.options.attachments = {};
		}

		this.options.attachments = attachment;

		return attachment;
	},
	/**
	 * Add an embedded image
	 * @url		https://nodemailer.com/message/embedded-images/
	 * @param  object image Add an embbed attachment image to the mail (cid)
	   Example:
	   {
	        filename: 'image.png',
	        path: '/path/to/file',
	        cid: 'unique@nodemailer.com' //same cid value as in the html img src
	    }

	 * @return object            Return this class
	 */
	"addImage": function (image) {
		if (typeof this.options.attachments === "undefined") {
			this.options.attachments = {};
		}

		this.options.attachments = image;

		return attachment;
	},
	/**
	 * get the nodemailer transporter
	 * @url		https://nodemailer.com/smtp/
	 * @param  	object customServerConnection An array like serverConnection to override default settings
	 * @return 	object            Return this class
	 */
	"getTransporter": function (customServerConnection) {
		let serverConnection = this.serverConnection;

		if (typeof this.config.SIMPLEMAILER.SERVER.TLS !== "undefined") {
			serverConnection.tls= {
				rejectUnauthorized: this.config.SIMPLEMAILER.SERVER.TLS.REJECTUNAUTHORIZED
			};
		}

		if (typeof this.config.SIMPLEMAILER.SERVER.DKIM !== "undefined" && this.config.SIMPLEMAILER.SERVER.DKIM.DOMAINNAME !== '') {
			serverConnection.dkim = {
		        domainName: this.config.SIMPLEMAILER.SERVER.DKIM.DOMAINNAME,
		        keySelector: this.config.SIMPLEMAILER.SERVER.DKIM.KEYSELECTOR,
		        privateKey: fs.readFileSync(this.config.SIMPLEMAILER.SERVER.DKIM.PRIVATEKEY),
		        cacheDir: this.config.SIMPLEMAILER.SERVER.DKIM.CACHEDIR,
		        cacheTreshold: this.config.SIMPLEMAILER.SERVER.DKIM.CACHETRESHOLD
		    };
		}

		if (typeof customServerConnection === "object") {
			serverConnection = _.merge(this.serverConnection, customServerConnection);
		}
		serverConnection.debug = true;

		return nodemailer.createTransport(serverConnection);
	},
	/**
	 * Send mail
	 * @param  object  customOptions          Override options with custom options
	 * @param  object  customServerConnection Override server connections with custom server connections
	 * @param  boolean resetMail 			  Reset text and html message when mailed default:true
	 * @param  function callback 			  Use an callback before an return
	 */
	"send": function (customOptions, customServerConnection, resetMail, callback) {
		let mailOptions = this.options;
		var ctx         = this;
		var resetMail   = (typeof resetMail === "" ? resetMail : true);

		if (typeof customOptions === "object") {
			mailOptions = _.merge(this.options, customOptions);
		}

		//If text and html message is empty return error
 		if (mailOptions.text === '' && mailOptions.html === '') {
 			if (typeof callback !== "undefined") {
 				callback({'success': false, 'message': 'No mail massage received'});
 			}
 			return {'success': false, 'message': 'No mail massage received'};
 		}

		let transporter = this.getTransporter(customServerConnection);

		transporter.use('compile', htmlToText());

	    // send mail with defined transport object
	    transporter.sendMail(mailOptions, (error, info) => {

	    	if (resetMail) {
		        ctx.options.html = '';
		        ctx.options.text = '';
		    }

	        if (error) {
	 			if (typeof callback !== "undefined") {
	 				callback(error);
	 			}
	            return console.log(error);
	        }

 			if (typeof callback !== "undefined") {
 				callback(info);
 			}

	        console.log('Message sent: %s', info.messageId);
	    });
	}

};

module.exports = simpleMailer;