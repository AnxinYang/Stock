const API_KEY = '1BG6IWIYHKC1MGPS';
let apis  ={
    getIntraDay: function () {
       return fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=1BG6IWIYHKC1MGPS')
           .then(function (res) {
               return res.json();
           })
           .then(function (json) {
               console.log(json);
           })
    }
};

export default apis;