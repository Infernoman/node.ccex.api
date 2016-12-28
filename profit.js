var ccex = require('./node.ccex.api.js');
ccex.options({
    'apikey' : 'APIKEY',
    'apisecret' : 'APISECRET',
    'verbose' : false,
    'cleartext' : true
});
var args = process.argv.slice(2);
var run = true;
if (args.length < 2){
    console.log("nodejs profit.js <CoinTicker> <NumberOfTrades>");
    run = false;
}
if ( Number(args[1]) == "NaN"){
    console.log("Please enter a number of trades to calculate profit for");
    run = false;
}
var coin = args[0];
var trades = Number(args[1]);

if (run == true) {
    ccex.custom({ a:'mytrades', marketid:coin+'-BTC', limit: trades}, function( data ) {
        //console.log(JSON.parse(data).return);
        var selltrades=0;
        var sell=0;
        var buy=0;
        var buytrades=0;
        for(var i = 0, len = JSON.parse(data).return.length; i < len; i++){
            var crw = JSON.parse(data).return[i];
            if (crw.tradetype == "Sell"){
                //console.log(crw);
                sell += Number(crw.total);
                sell -= Number(crw.fee);
                selltrades += 1;
            }
            if (crw.tradetype == "Buy"){
                //console.log(crw);
                buy += Number(crw.total);
                buy -= Number(crw.fee);
                buytrades += 1;
            }
        }

        var test = sell - buy;
        console.log(JSON.parse(data).return.length + " Trades Total. Buy:" + buytrades + " Sell:" + selltrades + " Profit:" + test);
    });
}
