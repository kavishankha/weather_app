// Import the required modules
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

// Create a new instance of the Express application
const app = express();

// Use the body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({extended: true}));

// Define a route for the home page
app.get("/", function (req, res) {

    // Send the weather.html file as the response to the GET request
    res.sendFile(__dirname + "/weather.html");

    // Define a route for the form submission (using POST)
    app.post("/", function (req, res) {

        // Retrieve the city name from the form data
        const query = req.body.cityName;

        // Set up the API call to OpenWeatherMap
        const apyKey = "d13fed61a1b6b6485c6162b69a1857b8";
        const unit = "metric";
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apyKey + "&units=" + unit + "";

        // Make the API call and handle the response
        https.get(url, function (response) {

            // Log the status code of the response (for debugging purposes)
            console.log(response.statusCode);

            // Set up a data listener to handle the response body
            response.on("data", function (data) {

                // Parse the JSON data into a JavaScript object
                const weatherData = JSON.parse(data)

                // Extract the relevant weather data from the object
                const temp = weatherData['main']['temp']
                const weatherDescription = weatherData['weather'][0]['description']
                const icon = weatherData['weather'][0]['icon']
                const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"

                // Send the weather data as the response to the POST request
                res.write("<p>The weather is currently " + weatherDescription + "</p>");
                res.write("<h1>The temperature  in " + query + " is currently " + temp + "</h1>");
                res.write("<img src='" + imageURL + "' alt='' >");
                res.send()
            })
        })
    })
})

// Start the server and listen for incoming requests on port 3000
app.listen(3000, function () {
    console.log("server is running");
})
