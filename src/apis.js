const API_KEY = '1BG6IWIYHKC1MGPS';
let apis  = {
    getIntraDay: function (symbol, options = {}) {
        if (symbol && typeof symbol === 'string') {
            let defaultOptions = {
                interval: '5min',
                outputsize: 'compact',
            };
            let {interval, outputsize} = Object.assign({}, defaultOptions, options);
            return fetch(`https://www.alphavantage.co/query?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=1BG6IWIYHKC1MGPS&function=TIME_SERIES_INTRADAY&`)
                .then(function (res) {
                    return res.json();
                })
        }
        return null;
    }
};

export default apis;