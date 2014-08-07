    var STKPRJ = STKPRJ || {};

    // Default Stock Symbols while displaying in the page
    STKPRJ.apiCalls = {
        symbols : '"YHOO","AAPL","GOOG","MSFT","AFG"'
    };
    
    var stockQuotes = function(){
        var self = this;
        self.stockQuoteList = [];
        self.stockQuoteListObserve = ko.observableArray(self.stockQuoteList);
        self.isStockSymbolEmpty = ko.observable(false);
        self.isInvalidStartEndDates = ko.observable(false);
    
        this.requestData = function(){
            $.ajax({
                url: 'http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol in ('+ STKPRJ.apiCalls.symbols +') and startDate = "' + STKPRJ.apiCalls.startDate + '" and endDate = "' + STKPRJ.apiCalls.endDate + '"&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json',
                dataType: 'jsonp',
                crossDomain: true,
                type: 'GET',
                success: function(data){
                    if (data && data.query && data.query.results.quote.length > 0) {
                        self.stockQuoteList = [];
                        for(var ind in data.query.results.quote){
                            self.stockQuoteList.push(data.query.results.quote[ind]);
                        }
                    } else {
                        self.stockQuoteList = [];
                        self.stockQuoteList.push(data.query.results.quote);
                    }
                    self.stockQuoteListObserve(self.stockQuoteList);
                }
            });
        };
    
        this.validateEntry = function(){
            var symbols = $.trim($("input[name='stockSymbol']").val());
            var startDate = new Date($("input[name='startDate']").val());
            var endDate = new Date($("input[name='endDate']").val());
            if ($.trim($("input[name='stockSymbol']").val()) === "") {
                self.isStockSymbolEmpty(true);
                return false;
            }
            self.isStockSymbolEmpty(false);
            if (startDate > endDate) {
                self.isInvalidStartEndDates(true);
                return false;
            }
            self.isInvalidStartEndDates(false);
            symbols = symbols.split(",");
            STKPRJ.apiCalls.symbols = '';
            for(var ind in symbols) {
                STKPRJ.apiCalls.symbols += '"'+ symbols[ind] +'"';
                if ((symbols.length - 1) !== parseInt(ind, 10)) {
                    STKPRJ.apiCalls.symbols += ",";
                }
            }
            
            STKPRJ.apiCalls.startDate = $("input[name='startDate']").val();
            STKPRJ.apiCalls.endDate = $("input[name='endDate']").val();
            self.requestData();
        };
    
        self.requestData();
    }
    
    $(function(){
        var currentDate = new Date();
        var today, yesterday;
        var currentDay = (currentDate.getDate().length > 1) ? currentDate.getDate() : ("0"+ currentDate.getDate());
        var previousDay = "0" + (currentDate.getDate() - 1);
        var currentMonth =  "0" + (currentDate.getMonth() + 1);
        today = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;
        yesterday = currentDate.getFullYear() + "-" + currentMonth + "-" + previousDay;
        STKPRJ.apiCalls.startDate = yesterday;
        STKPRJ.apiCalls.endDate = today;
    
        ko.applyBindings(new stockQuotes);
        $(".datepicker.start").datepicker({
            dateFormat : "yy-mm-dd"
        }).val(yesterday);
        $(".datepicker.end").datepicker({
            dateFormat : "yy-mm-dd"
        }).val(today);
    });