const http = require('http');
const fs = require('fs');
var requests = require("requests")

const homeFile = fs.readFileSync("home.html", "utf-8");

replaceVal = (tempVal, orgVal) => {
    let temprature = tempVal.replace("{%tempval%}", orgVal.main.temp)
    temprature = temprature.replace("{%tempmin%}", orgVal.main.temp_min)
    temprature = temprature.replace("{%tempmax%}", orgVal.main.temp_max)
    temprature = temprature.replace("{%location%}", orgVal.name)
    temprature = temprature.replace("{%status%}", orgVal.weather[0].main)
    temprature = temprature.replace("{%country%}", orgVal.sys.country)

    return temprature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/")
        requests('http://api.openweathermap.org/data/2.5/weather?q=Hubli&APPID=577f9412faa46587f345c06dc30d40e5')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]

                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val))
                    .join("")
                res.write(realTimeData)
                // console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
})

server.listen(8000, "127.0.0.1")