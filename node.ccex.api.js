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
