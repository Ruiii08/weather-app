function currWeather() {  //openweather api to get their weather data
    const apiKey = '66cff8fdd1f93e364fa8ce86aec439d9';
    var city = document.getElementById('city').value;
    if (!city) {
        // Step 1: Get user coordinates through
        function getCoordintes() {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            function success(pos) {
                var crd = pos.coords;
                var lat = crd.latitude.toString();
                var lng = crd.longitude.toString();
                var coordinates = [lat, lng];
                console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                getCity(coordinates);
                return;

            }
            function error(err) {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            }
            navigator.geolocation.getCurrentPosition(success, error, options);
        }

        function getCity(coordinates) {
            var xhr = new XMLHttpRequest();
            var lat = coordinates[0];
            var lng = coordinates[1];

            // LocationIQ api for reverse geocoding from lat & lon we get address(city). 
            xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.310fa6f6a6235807b46b48bfc9205bfe&lat=" + lat + "&lon=" + lng + "&format=json", true);
            xhr.send();
            xhr.onreadystatechange = processRequest;
            xhr.addEventListener("readystatechange", processRequest, false);
            function processRequest(e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText);
                    console.log(response.address.city);
                    city = response.address.city;
                    return;
                }
            }
        }
        getCoordintes();
    } else {
    //after fetching the city
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    fetch(weatherUrl) //for the current weather condition
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('cannot fetch current data:', error);
            alert("Please try again");
        });
    fetch(forecastUrl)  //for the hourly forecast of the day
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('cannot fetch forecast data:', error);
            alert("Please try again.");
        });
}}
function displayWeather(data) { //to display the data
    const weatherSymbol = document.getElementById('weatherIcon')
    const tempInfo = document.getElementById('temperature');
    const weatherInfo = document.getElementById('info');
    const hourlyForecast = document.getElementById('dayForecast');

    //every time funtion is called we get rid of prev data
    tempInfo.innerHTML = '';
    weatherInfo.innerHTML = '';
    hourlyForecast.innerHTML = '';

    //if the recieved data has any errors in it
    if(data.cod==='404'){
        weatherInfo.innerHTML=`<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temper = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const temperHTML = ` <p> ${temper}°C </p>`;
        const weatherHTML = `<p>${cityName}</p> <p>${description}</p>`;
        weatherSymbol.src = iconUrl;
        weatherSymbol.alt = description;
        tempInfo.innerHTML = temperHTML;
        weatherInfo.innerHTML = weatherHTML;
        showImage();
    }
}
function displayHourlyForecast(hourlyData) {  //to display the scroll bar for hourly data
    const hourlyFore = document.getElementById(`dayForecast`);
    const day = hourlyData.slice(0,8);
    day.forEach(item=>{
        const date = new Date(item.dt*1000);
        const hour = date.getHours();
        const tem = Math.round(item.main.temp-273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const hourlyItemHTML = `<div class='hourly-item'> <span>${hour}:00</span>
        <img src="${iconUrl}" alt = "weather icon of each hour"> 
        <span>${tem}°C</span></div>`;
        hourlyFore.innerHTML += hourlyItemHTML;
    });
}
function showImage(){
    const icon = document.getElementById('weatherIcon');
    icon.style.display='block';
}