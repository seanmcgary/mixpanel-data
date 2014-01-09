var mixpanel = require('../index');

var mp = new mixpanel({
	apiKey: '',
	apiSecret: ''
});

var now = new Date();	
var from = new Date((new Date()).setUTCDate(now.getUTCDate() - 5));
var expire = new Date((new Date()).setUTCMinutes(now.getUTCMinutes() + 5));

console.log(now);
console.log(from);

mp.getData('/events/properties', {
	interval: 7,
	unit: 'day',
	event: 'order-placed',
	name: 'campaign',
	expire: expire.getTime(),
	type: 'average'
}).then(function(){
	console.log(arguments);
}).fail(function(){
	console.log(arguments);
});