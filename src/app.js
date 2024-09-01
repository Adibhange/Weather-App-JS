//========================== Weather data for searched city
let city = document.getElementById("cityName");
const searchBtn = document.getElementById("searchBtn");
const apiKey = "37649989d16fa9338178192d4b2a39f4";

// Get element to display weather info for a searched city
let searchedCity = document.getElementById("searchedCity");
let todayDate = document.getElementById("todayDate");
let todayWeatherImg = document.getElementById("todayWeatherImg");
let todayTemp = document.getElementById("todayTemp");
let todayWeather = document.getElementById("todayWeather");
let todayHumidity = document.getElementById("todayHumidity");
let todayWind = document.getElementById("todayWind");

// Get city coordinate
const getCityCoordinate = (e) => {
	e.preventDefault();
	let cityName = city.value.trim(); //If name has a blank spaces
	// console.log(cityName);

	// If city not given...
	if (cityName === "") {
		alert("Enter a city name...");
		return;
	}

	let geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
	fetch(geoCode)
		.then((res) => res.json())
		.then((data) => {
			let { lat, lon, name, state } = data[0];
			getWeather(lat, lon, name, state);
		})
		.catch(() => {
			alert("City not found...");
		});
};

//Get weather data for given city coordinates
const getWeather = (lat, lon, name, state) => {
	let weatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
	fetch(weatherApi)
		.then((res) => res.json())
		.then((data) => {
			// console.log(data);
			let date = new Date();

			searchedCity.innerText = `${name}, ${state}`;

			// Current Date
			todayDate.innerText = date.toLocaleString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});

			// Today's Weather Img
			todayWeatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

			// Today's Weather temp
			todayTemp.innerText = `${Math.round(data.main.temp - 273.15)}°C`; //In kelvin so for convert used -273.15 to convert in celcius

			// Today's Weather description
			todayWeather.innerText = data.weather[0].description;

			// Today's Humidity and Wind Speed
			todayHumidity.innerText = `${data.main.humidity}%`;
			todayWind.innerText = `${data.wind.speed} m/s`;
		})
		.catch(() => {
			alert("Failed to fetch weather...");
		});
};

searchBtn.addEventListener("click", getCityCoordinate);

// Load a weather info on page load
const defaultCityWeather = () => {
	const defaultCity = "Mumbai";
	let geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${defaultCity}&limit=1&appid=${apiKey}`;
	fetch(geoCode)
		.then((res) => res.json())
		.then((data) => {
			let { lat, lon, name, state } = data[0];
			getWeather(lat, lon, name, state);
		})
		.catch(() => {
			alert("Failed to fetch weather for default city...");
		});
};
// Call the function to load default city weather when the page loads
window.addEventListener("load", defaultCityWeather);

// Weather data for Current Location
const currLocBtn = document.getElementById("currLocBtn");
// Get weather for current location
const getCurrentLocWeather = (e) => {
	e.preventDefault();
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				getWeather(latitude, longitude, "Current Location", "");
			},
			(error) => {
				alert("Failed to get current location...", error);
			}
		);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
};

currLocBtn.addEventListener("click", getCurrentLocWeather);
