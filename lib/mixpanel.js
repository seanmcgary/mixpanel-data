var _ = require('lodash');
var hashlib = require('hashlib');
var q = require('q');
var querystring = require('querystring');
var request = require('./request');

var mixpanel = function(options){

	if(!options || !options.apiKey || !options.apiSecret){
		throw 'invalid_options';
	}

	var apiKey = options.apiKey;
	var apiSecret = options.apiSecret;

	var generateSignature = function(options){
		options = options || {};

		var sortedParams = _.sortBy(_.keys(options), function(k){ return k; }).map(function(param){
			return (param + '=' + options[param]);
		});

		return hashlib.md5(sortedParams.join('') + apiSecret);
	};

	var makeRequest = function(route, options){
		options = options || {};
		options.api_key = apiKey;

		var now = new Date();
		var expire = new Date((new Date()).setUTCMinutes(now.getUTCMinutes() + 5));
		options.expire = options.expire || expire.getTime();

		options.sig = generateSignature(options);		

		return request.get({
			url: route,
			data: options
		});
	};

	return _.extend(this, {	
		getData: function(route, options){
			if(!route){
				throw 'route_required';
			}

			return makeRequest(route, options);

		},
		getEvent: function(options){
			
			return makeRequest('/events', options);
		},
		getEventProperties: function(event){
			var url = '/events/properties/top';

			return makeRequest(url, {
				event: event,
				limit: 200
			});
		},
		getEventPropertyValues: function(event, property){
			var url = '/events/properties/values';

			return makeRequest(url, {
				event: event,
				name: property
			});
		}
	});
};

module.exports = mixpanel;