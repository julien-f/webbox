WebBox is a simple HTTP server which provides web pages the ability to
send a message to someone.

Its modular architecture makes it really powerful.

# Message object

Description with [JSON Schema](http://en.wikipedia.org/wiki/JSON#JSON_Schema):

```javascript
{
	name: 'Message',
	type: 'object',
	properties: {
		to: {
			type: 'string',
			required: true,
		},
		subject: {
			type: 'string',
			required: false,
		}
		body: {
			type: 'string',
			required: true,
		},
	}
}
```

# Configuration

```javascript
module.exports = function (webbox) {
	// webbox functions can be accessed through the first parameter or
	// the current context `this`.

	// The usage is similar to connect/express/rectify, i.e. you have to
	// declare the use of middlewares.

	// Prevents DOS.
	this.use(throttle({
		burst: 100,
		rate: 50,
		ip: true,
	}));

	// You can also applies
};

```
