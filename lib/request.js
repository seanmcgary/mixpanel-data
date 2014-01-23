var http = require('http');
var _ = require('lodash');
var q = require('q');
var qs = require('querystring');


var host = 'api.mixpanel.com';
var basePath = '/api/2.0';

var makeRequest = function(method, url, data, headers, eventName){
	var deferred = q.defer();
	data = data || {};

	var options = {
		host: host,
		path: basePath + url,
		data: data,
		method: method,
		headers: {}
	};

	var request = http.request(options, function(res){		

		var data = '';
		res.on('data', function(d){
			data += d.toString();
		});

		res.on('end', function(){
			var statusCode = res.statusCode;

			var statusCodeTrunc = Math.floor(statusCode / 100);

			var json;

			try {
				json = JSON.parse(data);
			} catch(e){}

			if(!json){
				return deferred.reject({ err: 'invalid_json_response' });
			}

			if(statusCodeTrunc == 2){
				return deferred.resolve(json);
			} else {
				return deferred.reject(json);
			}
		});
	});

	request.on('error', function(error){
		return deferred.reject({ err: error });
	});

	// 30 second timeout for now
	request.setTimeout(30000, function(){
		return deferred.reject({ err: 'timeout' });
	});

	//request.write(JSON.stringify(data));
	request.end();

	return deferred.promise;
};

var get = exports.get = function(options){
	var url = options.url || '';
	var data = options.data || {};

	var queryString = qs.stringify(data);

	if(queryString.length){
		url += ('?' + queryString);
	}

	return makeRequest('GET', url, {}, options.headers);
};

var post = exports.post = function(options){
	return makeRequest('POST', options.url, options.data, options.headers);
};

var del = exports.del = function(options){
	return makeRequest('DELETE', options.url, options.data, options.headers);
};

var put = exports.put = function(options){
	return makeRequest('PUT', options.url, options.data, options.headers);
};
