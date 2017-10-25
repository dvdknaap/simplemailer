# Simplemailer
[![NPM Version](http://img.shields.io/npm/v/simplemailer.svg?style=flat)](https://www.npmjs.org/package/simplemailer)

Easy and simple to use mailer thats using [nodemail](https://nodemailer.com)

#### Install
```npm install simplemailer```


#### Test
```node tests/examples.js```



#### Easy To use
There are 4 different posibilities that you can use
1. Directly pass all info as object to send method
```javascript
simpleMailer.send({
    to: 'email@domain.com',
    subject: 'test mail 1',
    text: 'test text mail 1', //Not needed if not present it will create one from the html
    html: '<b>test html mail 1</b>'
});
```

2. When you dont add an text mail simplemailer will create one from you html
```javascript
simpleMailer.send({
    to: 'email@domain.com',
    subject: 'test mail 2',
    html: '<b>test html mail 2</b>'
});
```

3. You can pass all required params as function with chaining
```javascript
simpleMailer.
	to('email@domain.com').
	subject('test mail 3').
	html('<b>test html mail 3</b>').
	send()
;
```

4. You can even add an template path that will be used for the html and text mail
```javascript
simpleMailer.
	to('email@domain.com').
	subject('test mail 4').
	template('./tests/testMail.html').
	send()
;
```

#### Config
Be sure you have an config.json file in your root directory with the content as discribed in `config.json.example`
```javascript
{
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
      }
    },
    "FROMNAME": "from name",
    "FROMEMAIL": "email@domain.com",
    "REPLYTO": "reply@domain.com"
  },
}
```