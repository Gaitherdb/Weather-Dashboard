var searchFormEl = document.querySelector('#search-form');
var searchInputVal = document.querySelector('#input-city');
var currentWeather = document.querySelector('#currentWeather');
var fiveDayForecast = document.querySelector('#fiveDayForecast');
const APIKey = "92421b7f2bf12b73f6e7c38295c935c0";


function handleSearchFormSubmit(event) {
    event.preventDefault();
    var city = searchInputVal.value.trim();
   
    if (!city) {
        alert('You need a search input value!');
        return;
    }
    else {
        fiveDayForecast.textContent = '';
        searchInputVal.value = '';
        currentWeather.textContent = '';
        searchApiCurrentDay(city);
    }
}

function searchApiCurrentDay(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    renderCurrentWeather(data);

                })
            } else {
                alert('Error: ' + response.statusText)
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeatherMap.com');
        })

}

function renderCurrentWeather(data) {
    console.log(data);

    var currentDate = getLocalDate(data);
    var icon = getIcons(data.weather[0].icon);
    var temp = convertTemp(data.main.temp).toFixed(2);
    var wind = MStoMPH(data.wind.speed).toFixed(2);
    var humidity = data.main.humidity;
    var h1 = document.createElement("h1");
    var ul = document.createElement("ul");
    ul.classList.add("todayList");
    var tempList = document.createElement("li");
    var windList = document.createElement("li");
    var humidityList = document.createElement("li");
    h1.textContent = data.name + " " + currentDate + " " + icon;
    tempList.textContent = "Temp: " + temp + " ℉";
    windList.textContent = "Wind: " + wind + " MPH";
    humidityList.textContent = "Humidity: " + humidity + " %";
    currentWeather.appendChild(h1);
    currentWeather.appendChild(ul);
    ul.appendChild(tempList);
    ul.appendChild(windList);
    ul.appendChild(humidityList);

    searchApi5DayForecast(data);
}

function getLocalDate(data) {
    //gets local time, converts it into miliseconds and adds the product of seconds shifted from UTC and 1000 and converts it to UTC.
    var localDate = new Date((new Date().getTime()) + data.timezone * 1000).toUTCString();
    console.log(localDate);
    var date = localDate.split(' ');
    date.splice(-2);
    return date;
}
function getIcons(icon) {

    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";

    return iconurl;

    {/* <div id="icon"><img id="wicon" src="" alt="Weather icon"></div> */ }
}
function convertTemp(K) {
    return (9 / 5) * (K - 273) + 32;
}
function MStoMPH(ms) {
    return ms * 2.236936;
}
function searchApi5DayForecast(currentData) {
    var queryURL = " https://api.openweathermap.org/data/2.5/onecall?lat=" + currentData.coord.lat + "&lon=" + currentData.coord.lon + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    render5DayForecast(data);
                    getUVI(data);

                })
            } else {
                alert('Error: ' + response.statusText)
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeatherMap.com');
        })
}

function getUVI(data) {
    var currentUVI = data.current.uvi;
    var uviList = document.createElement("li");
    uviList.textContent = "UV Index: " + currentUVI;
    var ul = document.querySelector(".todayList");
    ul.appendChild(uviList);


    // for (i = 0; i < 5; i++) {
    //     var forecastUVI = data.daily[i].uvi;
    //     var div = document.createElement("div");
    //     fiveDayForecast.appendChild(div);
    //     div.textContent = forecastUVI;


    //     //append each time
    // }
    console.log(forecastUVI);
}

// function setLocalStorage() {

// }








// li.setAttribute("data-index", i);
// li.classList.add("todayList")
// var h2 = document.createElement("h2");
// currentWeather.appendChild(h2);
// h2.textContent = temp;
// currentWeather.appendChild(h2);
// h2.textContent = wind + " MPH";


function render5DayForecast(data) {
    console.log(data);

}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);



