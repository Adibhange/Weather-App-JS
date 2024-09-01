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

// 5 day forecast container
let forecastContainer = document.getElementById("forecastContainer");

// Previous searched city
let previousSearchedCity = document.getElementById("previousCity");

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
			getForecast(lat, lon);
			saveCity(name); //Save city in localstorage
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

// For a 5 day forecast
const getForecast = (lat, lon) => {
	let forecastApi = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${apiKey}`;
	fetch(forecastApi)
		.then((res) => res.json())
		.then((data) => {
			let nextForecastDays = [];
			let forecastDays = data.list.filter((forecast) => {
				let forecastDate = new Date(forecast.dt_txt).getDate();
				if (!nextForecastDays.includes(forecastDate)) {
					return nextForecastDays.push(forecastDate);
				}
			});
			// console.log(forecastDays);
			forecastContainer.innerHTML = ``;
			for (i = 1; i < forecastDays.length; i++) {
				let date = new Date(forecastDays[i].dt_txt);
				forecastContainer.innerHTML += `
                <div class="bg-indigo-50 p-4 rounded-lg text-center">
					<p class="text-lg font-semibold text-gray-800">${date.toLocaleString("en-US", {
						weekday: "long",
					})}</p>
					<img
						src="https://openweathermap.org/img/wn/${
							forecastDays[i].weather[0].icon
						}@2x.png"
						alt="Weather Icon"
						class="size-12 mx-auto my-2" />
					<p class="text-xl font-bold text-gray-800">${Math.round(
						forecastDays[i].main.temp - 273.15
					)}°C</p>
					<p class="text-gray-600 font-semibold">${
						forecastDays[i].weather[0].description
					}</p>
					<p class="text-sm text-gray-500">Wind: ${forecastDays[i].wind.speed} km/h</p>
					<p class="text-sm text-gray-500">Humidity: ${forecastDays[i].main.humidity}%</p>
				</div>
            `;
			}
		})
		.catch(() => {
			alert("Failed to fetch forecast...");
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
			getForecast(lat, lon);
		})
		.catch(() => {
			alert("Failed to fetch weather for default city...");
		});
};

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
				getForecast(latitude, longitude);
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

// Save city in localstorage
const saveCity = (city) => {
	let previousSearches =
		JSON.parse(localStorage.getItem("previousSearches")) || [];
	if (!previousSearches.includes(city)) {
		previousSearches.push(city);
		localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
		loadPreviousSearches();
	}
};

// Get previous searched city
const loadPreviousSearches = () => {
	let previousSearches =
		JSON.parse(localStorage.getItem("previousSearches")) || [];

	if (previousSearches.length > 0) {
		previousSearchedCity.style.display = "block"; // Show the select element
		previousSearchedCity.innerHTML =
			'<option value="" disabled selected>Searched Cities</option>'; // Reset options
		previousSearches.forEach((city) => {
			let option = document.createElement("option");
			option.value = city;
			option.textContent = city;
			previousSearchedCity.appendChild(option);
		});
	} else {
		previousSearchedCity.style.display = "none"; // Hide the select element
	}
};

// Event handler for city selection
previousSearchedCity.addEventListener("change", (e) => {
	let cityName = e.target.value;
	if (cityName) {
		getCityCoordinateFromSaved(cityName);
	}
});

// Get city coordinate from saved searches
const getCityCoordinateFromSaved = (cityName) => {
	let geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
	fetch(geoCode)
		.then((res) => res.json())
		.then((data) => {
			let { lat, lon, name, state } = data[0];
			getWeather(lat, lon, name, state);
			getForecast(lat, lon);
		})
		.catch(() => {
			alert("Failed to fetch weather for saved city......");
		});
};

// Call the function to load default city weather and previous searches when the page loads
window.addEventListener("load", () => {
	defaultCityWeather();
	loadPreviousSearches();
});
