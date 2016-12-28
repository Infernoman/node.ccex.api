/* ============================================================
 * node.ccex.api
 * https://github.com/infernoman/node.ccex.api
 *
 * ============================================================
 * Copyright 2014-2015, Adrian Soluch - http://soluch.us/
   Copyright 2016-2017, Alastair Clark - http://infernopool.com/
 * Released under the MIT License
 * ============================================================ */
var NodeCcexApi = function() {

    'use strict';

    var request = require('request'),
        hmac_sha512 = require('./hmac-sha512.js'),
        JSONStream = require('JSONStream'),
        es = require('event-stream');

    var start,
        request_options = {
            method: 'GET',
            agent: false,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; Node C-Cex API)",
                "Content-type": "application/x-www-form-urlencoded"
            }
        };

    var opts = {
        baseUrl: 'https://c-cex.com/t/api.html',
        apikey: 'APIKEY',
        apisecret: 'APISECRET',
        verbose: false,
        cleartext: false
    };

    var getNonce = function() {
        return Math.floor(new Date().getTime() / 1000);
    };

    var extractOptions = function(options) {

        var o = Object.keys(options),
            i;
        for (i = 0; i < o.length; i++) {
            opts[o[i]] = options[o[i]];
        }
    };

    var apiCredentials = function(uri) {

        var options = {
            apikey: opts.apikey,
            nonce: getNonce()
        };

        return setRequestUriGetParams(uri, options);
    };

    var setRequestUriGetParams = function(uri, options) {
        var op;
        if (typeof(uri) === 'object') {
            op = uri;
            uri = op.uri;
        } else {
            op = request_options;
        }


        var o = Object.keys(options),
            i;
        for (i = 0; i < o.length; i++) {
            uri = updateQueryStringParameter(uri, o[i], options[o[i]]);
        }

        op.headers.apisign = hmac_sha512.HmacSHA512(uri, opts.apisecret); // setting the HMAC hash `apisign` http header
        op.uri = uri;

        return op;
    };

    var updateQueryStringParameter = function(uri, key, value) {

        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";

        if (uri.match(re)) {
            uri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            uri = uri + separator + key + "=" + value;
        }

        return uri;
    };

    var sendRequestCallback = function(callback, op) {
        start = Date.now();
        request(op, function(error, result, body) {
            if (!body || !result || result.statusCode != 200) {
                console.error(error);
            } else {
                callback(((opts.cleartext) ? body : JSON.parse(body)));
                ((opts.verbose) ? console.log("requested from " + result.request.href + " in: %ds", (Date.now() - start) / 1000) : '');
            }
        });
    };

    return {
        options: function(options) {
            extractOptions(options);
        },
        custom: function(options, callback) {
            var op = setRequestUriGetParams(apiCredentials(opts.baseUrl), options);
            sendRequestCallback(callback, op);
        }

    };

}();

module.exports = NodeCcexApi;
