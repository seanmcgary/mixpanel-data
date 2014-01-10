var mixpanel = require('../index');
var util = require('util');

var mp = new mixpanel({
	apiKey: '',
	apiSecret: ''
});

/*
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
});*/

mp.getEventProperties('some event')
	.then(function(data){
		console.log(util.inspect(data, true, 5, true));
	})
	.fail(function(){
		console.log(arguments);
	});

mp.getEventPropertyValues('some event', 'some property')
	.then(function(data){
		console.log(util.inspect(data, true, 5, true));
	})
	.fail(function(){
		console.log(arguments);
	});