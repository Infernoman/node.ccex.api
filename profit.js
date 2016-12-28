var ccex = require('./node.ccex.api.js');
ccex.options({
    'apikey' : 'APIKEY',
    'apisecret' : 'APISECRET',
    'verbose' : false,
    'cleartext' : true
});
if (!process.argv[2])
    console.log("Please enter a number of trades to calculate profit for");
else {
    var trades=process.argv[2];
    ccex.custom({ a:'mytrades', marketid:'CRW-BTC', limit: trades}, function( data ) {
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
