'use strict';

/**
 * @ngdoc service
 * @name stockManApp.QuoteService
 * @description
 * # QuoteService
 * Service in the stockManApp.
 */
angular.module('stockManApp')
    .service('QuoteService', function ($http, $interval) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var stocks = [];
        var BASE = 'http://query.yahooapis.com/v1/public/yql';
        //[1] Handlesupdating stock modelwith appropriate data from quote 
        var update = function (quotes) {
            if (quotes.length === stocks.length) {
                _.each(quotes, function (quote, idx) {
                    var stock = stocks[idx];
                    stock.lastPrice = parseFloat(quote.LastTradePriceOnly);
                    stock.change = quote.Change;
                    stock.percentChange = quote.ChangeinPercent;
                    stock.marketValue = stock.shares * stock.lastPrice;
                    stock.dayChange = stock.shares * parseFloat(stock.change);
                    stock.save();
                });
            }
        };
        //[2] Helper functions for managing whch stocks to pull quotes for
        this.register = function (stock) {
            stocks.push(stock);
        };
        this.deregister = function (stock) {
            _.remove(stocks, stock);
        };
        this.clear = function () {
            stocks = [];
        };
        //[3] Main processing function for communicating with Yahoo finance API
        this.fetch = function () {
            var symbols = _.reduce(stocks, function (symbols, stock) {
                symbols.push(stock.company.symbol);
                return symbols;
            }, []);
            var query = encodeURIComponent('select *  from yahoo.finance.quotes ' +
            'where symbol in (\''+ symbols.join(',') + '\')');
            var  url = BASE + '?'+'q=' + query + '&format=json&diagnostics = true' + 
            '&env=http://datatables.org/alltables.env';
            $http.jsonp(url + '&callback= JSON_CALLBACK')
            .success(function (data) {
                if(data.query.count) {
                    var quotes = data.query.count > 1 ? data.query.results.quote : [data.query.results.quote];
                    update(quotes);
                }
            })
            .error(function (data) {
                console.log(data);
            });
        };
        
        //[4] Used to fetch new quote data every 5 seconds
        $interval(this.fetch, 5000);
    });
   
    