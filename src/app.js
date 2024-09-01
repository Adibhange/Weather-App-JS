//========================== Weather data for searched city
let city = document.getElementById("cityName");
const searchBtn = document.getElementById("searchBtn");
const apiKey = "37649989d16fa9338178192d4b2a39f4";

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
		.then((data) => console.log(data))
		.catch(() => {
			alert("City not found...");
		});
};

searchBtn.addEventListener("click", getCityCoordinate);
// Weather data for Current Location
const currLocBtn = document.getElementById("currLocBtn");
