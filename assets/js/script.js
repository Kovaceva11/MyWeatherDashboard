
// search field input data
var CityName = $('#searchCity').val();
// Search field input city name to an array. Using local storage, loop through array to append city name to #recentCities div. 
$("#button-addon2").on("click", function(event) {
  event.preventDefault();
  var searchedCity = $("#searchCity").val();
  var cityArray = []; 
// save city input to local storage array. must be stringified. 
  cityArray = JSON.parse(localStorage.getItem("City")) || [];
  cityArray.push(searchedCity);
  localStorage.setItem("City", JSON.stringify(cityArray));  

  // Run the following on click.
  console.log(searchedCity);
  searchHistory();
  getSearchedCityWeather();
}); 

// function to get local storage of City name and append to the #recentCities div.
function searchHistory() {
  $("#recentCities").empty(); 
  var savedCitiesArray = JSON.parse(localStorage.getItem("City")) || []; 
  var citiesArrayLength = savedCitiesArray.length;

  for (var i = 0; i < citiesArrayLength; i++) {
    var cityNameFromArray = savedCitiesArray[i]; 

    $("#recentCities").append ("<div class='list-group'>" + "<button class='list-group-item'>" + cityNameFromArray 
    + "</button>")
  };
  
}

searchHistory (); 


  $("#recentCities").on("click", ".list-group-item", function(event) {
    event.preventDefault();
    var oldCity = ($(this).text());
    getOldCityWeather(oldCity);
    function getOldCityWeather(){
      $.ajax({
        url:"https://api.openweathermap.org/data/2.5/weather?q="+oldCity+"&units=imperial&appid="+apiKey,
        method:"GET",
        dataType: "jsonp",
        success: function(data) {
          $("#name").text(data.name);      
          $("#date").text(`(${moment().format("dddd, MMMM Do YYYY")})`);      
          $("#icon").attr(
            "src",
            `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
          );    
          $("#temp").text(data.main.temp + " F");      
          $("#humidity").text(data.main.humidity + " %");
          $("#windspeed").text(data.wind.speed + " MPH");
    
          // UV Index
          var lon = data.coord.lon;
          var lat = data.coord.lat;
          whatIsUVI(lat, lon);
    
          //5 day Forecast
          fivedayWx(lat,lon);
        }
      });

    };
  });


// Deletes the localstorage and clears the sity search history. 
$("#deleteHistory").on("click", function () {
  localStorage.clear();
  $("#recentCities").empty();
});


// Open Weather API Calls
// API Key
const apiKey = "7503a3a46c465487882967eb34bca497";
function getSearchedCityWeather(){
 
  var city = $('#searchCity').val();
  if (city != '') {
    $.ajax({
      url:"https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+apiKey,
      method:"GET",
      dataType: "jsonp",
      success: function(data) {
        $("#name").text(data.name);      
        $("#date").text(`(${moment().format("dddd, MMMM Do YYYY")})`);      
        $("#icon").attr(
          "src",
          `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
        );    
        $("#temp").text(data.main.temp + " F");      
        $("#humidity").text(data.main.humidity + " %");
        $("#windspeed").text(data.wind.speed + " MPH");
  
        // UV Index
        var lon = data.coord.lon;
        var lat = data.coord.lat;
        whatIsUVI(lat, lon);
  
        //5 day Forecast
        fivedayWx(lat,lon);
      }
    });
  };
}

// get Default Weather based on user's location:
function getDefaultCityWeather(){
  
  navigator.geolocation.getCurrentPosition((position) => {
    const lat  = position.coords.latitude;
    const lon = position.coords.longitude;
 
  
    $.ajax({
      url:"https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid="+apiKey,
      method:"GET",
      dataType: "jsonp",
      success: function(data) {
        $("#name").text(data.name);      
        $("#date").text(`(${moment().format("dddd, MMMM Do YYYY")})`);      
        $("#icon").attr(
          "src",
          `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
        );    
        $("#temp").text(data.main.temp + " F");      
        $("#humidity").text(data.main.humidity + " %");
        $("#windspeed").text(data.wind.speed + " MPH");
  
        // UV Index
        var lon = data.coord.lon;
        var lat = data.coord.lat;
        whatIsUVI(lat, lon);
  
        //5 day Forecast
        fivedayWx(lat,lon);
      }
    });
  });
};

// get default city weather using device's location
getDefaultCityWeather();

// UV Index from OneCall API
function whatIsUVI(lat, lon) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+apiKey,
    method: "GET",
    dataType: "jsonp",
    success: function(data){
      if (data.current.uvi <= 2.0) {
        $('#uvi').text(data.current.uvi);
        $("#uvi").addClass("bg-success");
       } else if (data.current.uvi > 2.0 && data.current.uvi <= 5.0) {
        $('#uvi').text(data.current.uvi); 
        $("#uvi").addClass("bg-warning");
       } else if (data.current.uvi >5.0  && data.current.uvi <= 7.0) {
        $('#uvi').text(data.current.uvi);   
        $("#uvi").addClass("bg-danger");
       };
    }
  }) 
}

function fivedayWx(lat, lon) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+apiKey,
    method: "GET",
    dataType: "jsonp",
    success: function(data){
      var appendDiv =""
      for(var i = 1; i < 6; i++){
        var icon = data.daily[i].weather[0].icon;
        var date = moment.unix(data.daily[i].dt).format("dddd");
        appendDiv += `
          <div class="card-group text-white bg-dark col s12 m">
            <div class="card-header text-center font-weight-bold">${date}
            </div>
              <div class="card-body bg-dark">
                <div class="card-text text-center text-white bg-dark"><img id="icon" src="https://openweathermap.org/img/w/${icon}.png"/></div>
                <div class="card-text text-white bg-dark"> Temp: ${data.daily[i].temp.eve} F</div>
                <div class="card-text text-white bg-dark">Humidity: ${data.daily[i].humidity}%</div>
                <div class="card-text text-white bg-dark"> Wind: ${data.daily[i].wind_speed} mph</div>
              </div>
          </div>`;
          $('#5dayWx').html(appendDiv)
      }
    }
  });
}