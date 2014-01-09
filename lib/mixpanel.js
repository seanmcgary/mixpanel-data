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

	return _.extend(this, {	
		getData: function(route, options){
			if(!route){
				throw 'route_required';
			}

			options.api_key = apiKey;
			options.sig = generateSignature(options);

			return request.get({
				url: route,
				data: options
			});
		}
	});

};

module.exports = mixpanel;