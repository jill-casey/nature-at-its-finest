'use strict'

const apiKey = 'z5UamSS2tY6wiHIGqaDAN45vz0U1M4VHB55z8U0n';

function formatUrl(stateValue, maxLimit, fields) {
    let params = `stateCode=${stateValue}&limit=${maxLimit}&fields=${fields}&api_key=${apiKey}`
    return params;
}

function formatCampgroundUrl(stateValue, maxLimit) {
    let params = `limit=${maxLimit}&stateCode=${stateValue}&api_key=${apiKey}`
    return params;
}

//stateSearch function only returning JSON from api with parks endpoint. 
function stateSearch(stateValue, maxLimit, fields) {
    displayLoading();
    const newParams = formatUrl(stateValue, maxLimit, fields)
    const newUrl = `https://developer.nps.gov/api/v1/parks?${newParams}`
    console.log(newUrl);
    fetch(newUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('response.statusText');
    })
    .then(responseJson => displayParks(responseJson))
    .catch(error => {
        $('#js-error-message').text(`We are having difficulty getting the data you want about ${stateValue}. ${error.message}`)
    })
}
    
//simplified function to get the basic data each response can send for more display info
function displayParks(responseJson){
    $('.results').empty();   
    let parkList = responseJson.data;
    console.log(`parkList length is ${parkList.length}`);
    if(parkList.length == 0){
        $('.results').append(
            `<li id="js-park-item-none"><h4>We cannot find any national parks using this search criteria.</h4></li>
            `)
        } else { 
    
        for (let i = 0; i < parkList.length; i++) {
        let currentPark = parkList[i];   
        $('.results').append(
            `<li id="js-park-item-${currentPark.parkCode}"><h3>${currentPark.fullName}</h3>
            <p>${currentPark.description}</p>
            <p><a href="${currentPark.url}" target="_blank">${currentPark.url}</a></p>
            `)
        if(currentPark.latLong == ""){
            $(`#js-park-item-${currentPark.parkCode}`).append(`
            <div id="buttons-no-go">Weather and Hikes are not available for this site</div>
            `)
        } else {
            $(`#js-park-item-${currentPark.parkCode}`).append(`
            <button type="submit" id="get-hours-${currentPark.parkCode}" class="">Get Hours</button>
            <button type="submit" id="hide-hours-${currentPark.parkCode}" class="hidden">Hide Hours</button>
            <button type="submit" id="show-hours-${currentPark.parkCode}" class="hidden">Show Hours</button>
            <button type="submit" id="get-weather-${currentPark.parkCode}" class="">Get Weather</button>
            <button type="submit" id="hide-weather-${currentPark.parkCode}" class="hidden">Hide Weather</button>
            <button type="submit" id="show-weather-${currentPark.parkCode}" class="hidden">Show Weather</button>
            <button type="submit" id="get-nearbyHikes-${currentPark.parkCode}" class="">Get Nearby Hikes</button>
            <button type="submit" id="hide-nearbyHikes-${currentPark.parkCode}" class="hidden">Hide Nearby Hikes</button>
            <button type="submit" id="show-nearbyHikes-${currentPark.parkCode}" class="hidden">Show Nearby Hikes</button>
            `)}
        getHours(currentPark);
        getWeather(currentPark);
        getHikes(currentPark); 
        }  
    } 
}


//param loaded from specific button to select park then toggle button and append operating hours
//note that the operating hours naming conventions include "/" impeding calls using JS, renamed js-park-hours-item using a counting method intead.
function getHours(currentPark){   
    $(`#get-hours-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#get-hours-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-hours-${currentPark.parkCode}`).toggleClass('hidden');    
        let thisHours = Object.keys(currentPark);
        console.log(`the keys returned on click are ${thisHours}`)
        console.log(`the name for this park is ${currentPark.name}`)
        for(let j=0; j < currentPark.operatingHours.length; j++){
            let theseHours = j;
        $(`#js-park-item-${currentPark.parkCode}`).append(
            `<li id="js-park-hours-item-${currentPark.parkCode}-${j}" class=""><h3>${currentPark.fullName}-${currentPark.operatingHours[j].name}</h3>
            <p>Standard Operating Hours at ${currentPark.operatingHours[j].name}</p>
            <p>${currentPark.operatingHours[j].description}</p>
                <p>Monday: ${currentPark.operatingHours[j].standardHours.monday}</p>
                <p>Tuesday: ${currentPark.operatingHours[j].standardHours.tuesday}</p>
                <p>Wedesday: ${currentPark.operatingHours[j].standardHours.wednesday}</p>
                <p>Thursday: ${currentPark.operatingHours[j].standardHours.thursday}</p>
                <p>Friday: ${currentPark.operatingHours[j].standardHours.friday}</p>
                <p>Saturday: ${currentPark.operatingHours[j].standardHours.saturday}</p>
                <p>Sunday: ${currentPark.operatingHours[j].standardHours.sunday}</p>
                <hr>
        </li>`
        )
        console.log(`theseHours is ${theseHours}`)
        hideHours(currentPark, theseHours); 
        showHours(currentPark, theseHours);
    }})
}    


//toggle hide the hours
function hideHours(currentPark, theseHours){   
    $(`#hide-hours-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-hours-item-${currentPark.parkCode}-${theseHours}`).toggleClass('hidden');
        $(`#show-hours-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-hours-${currentPark.parkCode}`).toggleClass('hidden');      
    });
}


//toggle showing the hours again after initial show-hide sequence without regenerating code
function showHours(currentPark, theseHours){   
    $(`#show-hours-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-hours-item-${currentPark.parkCode}-${theseHours}`).toggleClass('hidden');
        $(`#show-hours-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-hours-${currentPark.parkCode}`).toggleClass('hidden');      
    });  
}


function getWeather(currentPark){
        $(`#get-weather-${currentPark.parkCode}`).click(event => {
            event.preventDefault();
            $(`#get-weather-${currentPark.parkCode}`).toggleClass('hidden');
            $(`#hide-weather-${currentPark.parkCode}`).toggleClass('hidden');
            weatherPoints(currentPark);
            hideWeather(currentPark); 
            showWeather(currentPark);
            $(event.target).closest('li').append('<div id="loading-weather">Loading weather data</div>');
        });
}

//toggle hide the weather
function hideWeather(currentPark){   
    $(`#hide-weather-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-weather-item-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#show-weather-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-weather-${currentPark.parkCode}`).toggleClass('hidden');      
    });
}


//toggle showing the weather again after initial show-hide sequence without regenerating code
function showWeather(currentPark){   
    $(`#show-weather-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-weather-item-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#show-weather-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-weather-${currentPark.parkCode}`).toggleClass('hidden');      
    });  
}


function weatherPoints(currentPark){  
    let weatherLatLong = currentPark.latLong;
    console.log(`line 86 weatherLat is ${weatherLatLong}`);
    if(weatherLatLong == ""){
        $('#weather-loading').replaceWith('There is an error getting the data you want');
    } else {
    let weatherData = weatherLatLong.split(' ');
    console.log(`weatherData is ${weatherData}`)
    if(weatherData[1].slice(0,4) == 'lng:'){
        let lat = weatherData[0].slice(5,13);
        let latDot = lat.indexOf('.');
        let latSpacing = latDot + 3;
        let latitude = lat.slice(0,latSpacing);
        let long = weatherData[1].slice(4,15);
        let longDot = long.indexOf('.');
        let longSpacing = longDot + 3;
        let longitude = long.slice(0,longSpacing);
        getForecast(currentPark, latitude, longitude);
        console.log(`Cg Data: latitude is ${latitude} longitude is ${longitude}`)
    } else {
    let lat = weatherData[0].slice(4,14);
    let latDot = lat.indexOf('.');
    let latSpacing = latDot + 3;
    let latitude = lat.slice(0,latSpacing);
    let long = weatherData[1].slice(5,15);
    let longDot = long.indexOf('.');
    let longSpacing = longDot + 3;
    let longitude = long.slice(0,longSpacing);
    getForecast(currentPark, latitude, longitude);
    console.log(`Park Data: latitude is ${latitude}. longitude is ${longitude}`)
    }
}}

//fetch the forecast from api.weather.gov data
function getForecast(currentPark, latitude, longitude){
    let weatherPoints = `${latitude},${longitude}`
    let weatherUrl = `https://api.weather.gov/points/${weatherPoints}/forecast`
    fetch(weatherUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('response.status');
    })
    .then(responseJson => displayWeather(currentPark, responseJson))
    .catch(error => {
        $('#loading-weather').replaceAll(`It appears that we cannot get the weather data you requested.`)
    })
}


function displayWeather(currentPark, responseJson){
    
    let fullWeatherPrediction = responseJson.properties; 
    $(`#js-park-item-${currentPark.parkCode}`).append(
        `<li id="js-park-weather-item-${currentPark.parkCode}"><h3>${currentPark.name} Weather </h3>
        </li>`
        ); 
    $('#loading-weather').empty();       
    for(let k=0; k< 14; k++){
        let isoDate = `${fullWeatherPrediction.periods[k].startTime}`;
        let dateStr = Date.parse(isoDate);
        let newDate = new Date(dateStr);
        let finalDate = newDate.toDateString();
        let shortenedDate = finalDate.slice(4,15);  
        $(`#js-park-weather-item-${currentPark.parkCode}`).append(     
        `<li id="js-weather-details-${fullWeatherPrediction.periods[k].name}" class="weather-flex-row">
        <section class="weather-aside stack-items">
        <div class="forecastName">${fullWeatherPrediction.periods[k].name} </div>
        <div class="temp">${fullWeatherPrediction.periods[k].temperature}F</div>
        </section>
        <section class="weather-main stack-items">
        <div class="forecastDate">${shortenedDate}</div>
        <div class="forecastDesc">${fullWeatherPrediction.periods[k].shortForecast}</div>
        <div class="forecastWind">Wind: ${fullWeatherPrediction.periods[k].windDirection} ${fullWeatherPrediction.periods[k].windSpeed}</div>
        </section>
        </li>`
        )};
        
    }       


    function getHikes(currentPark){
        $(`#get-nearbyHikes-${currentPark.parkCode}`).click(event => {
            event.preventDefault();
            $(`#get-nearbyHikes-${currentPark.parkCode}`).toggleClass('hidden');
            $(`#hide-nearbyHikes-${currentPark.parkCode}`).toggleClass('hidden');  
            nearByHikesPoints(currentPark);
            hideNearByHikes(currentPark); 
            showNearByHikes(currentPark);
            $(event.target).closest('li').append('<div id="loading-hikes">Loading hiking data</div>');
        });
}


function nearByHikesPoints(currentPark){  
    let hikesLatLong = currentPark.latLong;
    
    if(hikesLatLong == ""){
        $('#loading-hikes').replaceWith('<div id="loading-hikes">The data for this site does not include location information needed to find nearby hikes.</div>');
    } else {
        console.log(`hikesLatLong is ${hikesLatLong}`);
        let hikesData = hikesLatLong.split(' ');
        console.log(`hikesData is ${hikesData}`)
        if(hikesData[1].slice(0,4) == 'lng:'){
        let latitude = hikesData[0].slice(5,13)
        let longitude = hikesData[1].slice(4,13)
        getHikeList(currentPark, latitude, longitude);
        console.log(`Cg Data for Hikes: latitude is ${latitude}. longitude is ${longitude}`)
        } else {
        let latitude = hikesData[0].slice(4,14);
        let longitude = hikesData[1].slice(5,15);
        
        console.log(`Park Data for Hikes: latitude is ${latitude}. longitude is ${longitude}`)
        
        getHikeList(currentPark, latitude, longitude);
        }
    }   
}


function getHikeList(currentPark, latitude, longitude){
    let hikesUrl = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=50&key=200541410-46ce70ac245acda68d01e51b436b7326`
    console.log(hikesUrl);
    fetch(hikesUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('response.statusText');
    })
    .then(responseJson => displayHikes(currentPark, responseJson))
    .catch(error => {
        $('#loading-hikes').replaceWith(`Error loading hiking data. Please try a different location.`)
    })
}


function displayHikes(currentPark, responseJson){
    $('#loading-hikes').empty();
    let hikeTrails= responseJson.trails;  
    $(`#js-park-item-${currentPark.parkCode}`).append(
        `<li id="js-park-hike-item-${currentPark.parkCode}"><h3>${currentPark.name} Nearby Hikes </h3>
        </li>`
        );
        console.log(`the hike Trails object length is ${hikeTrails.length}`);
        for(let h=0; h < hikeTrails.length; h++){
        $(`#js-park-hike-item-${currentPark.parkCode}`).append(     
            `<li id="js-park-hike-details-${currentPark.parkCode}">
            <p><div class="hikeName"><h4>${hikeTrails[h].name}</h4></div>
            <div class="hikeType">${hikeTrails[h].type}</div>
            <div class="hikeSummary">${hikeTrails[h].summary}</div>
            <div class="hikeLength"> Length: ${hikeTrails[h].length} Ascent: ${hikeTrails[h].ascent} Descent: ${hikeTrails[h].descent}</div>
            <div class= "hikeUrl" ><a href="${hikeTrails[h].url}" target="_blank">${hikeTrails[h].url}</a></div>
            </p><hr></li>`      
        )};
}


//toggle hide the weather
function hideNearByHikes(currentPark){   
    $(`#hide-nearbyHikes-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-hike-item-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#show-nearbyHikes-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-nearbyHikes-${currentPark.parkCode}`).toggleClass('hidden');      
    });
}


//toggle showing the weather again after initial show-hide sequence without regenerating code
function showNearByHikes(currentPark){   
    $(`#show-nearbyHikes-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-hike-item-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#show-nearbyHikes-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-nearbyHikes-${currentPark.parkCode}`).toggleClass('hidden');      
    });  
}
/*
//national parks with entrance fees
function displayResultsStateParksNoHours(responseJson){
    let parkList = responseJson.data;
    console.log(`parkList length is ${parkList.length}`);
    for(let i = 0; i < parkList.length; i++){ 
        for(let j=0; j < parkList[i].entranceFees.length; j++){ 
        $('.results').append(
            `<li id="js-list-item"><h3>${parkList[i].fullName}</p></h3>
            <p>${parkList[i].description}</p>
            <p><a href="${parkList[i].url}" target="_blank">${parkList[i].url}</a></p>
            <p>${parkList[i].entranceFees[j].title}</p>
            <p>${parkList[i].entranceFees[j].description}</p>
            <p>${parkList[i].entranceFees[j].cost}</p>
        </li><hr>`
        )} 
    }           
    $('.results').removeClass('hidden');
};*/

function displayLoading(){
    $('.results').removeClass('hidden').append(`Loading...`);
}


//use the results to get the parkcode and check on campground status
function grabCampgrounds(stateValue, maxLimit){
    displayLoading();
    const newParams = formatCampgroundUrl(stateValue, maxLimit)
    const newUrl = `https://developer.nps.gov/api/v1/campgrounds?${newParams}`
    console.log(newUrl);
    fetch(newUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('response.statusText');
        })
        .then(responseJson => displayResultsCampgrounds(responseJson))
        .catch(error => {
            $('#js-error-message').text(`There is an issue getting the list of campgrounds you requested. Please change your search and try again.  ${error.message}`)
        });
}

//display the results from the campground API endpoint
function displayResultsCampgrounds(responseJson) {
    let cgList = responseJson.data;
    console.log(`camgroundResults length is ${cgList.length}`);
    if(cgList.length == 0){
        $('.results').append(
            `<li id="js-park-item-no-parks"><h4>We cannot find any national park campgrounds using this search criteria. Please try again.</h4>
            `)
    } else {
    $('.results').empty();   
    for (let i = 0; i < cgList.length; i++) {
        let currentCg = cgList[i];   
        $('.results').append(
            `<li id="js-park-item-${currentCg.parkCode}"><h3>${currentCg.name}</h3>
            <p>${currentCg.description}</p>
            <p>Find reservation and detailed directions here. <a href="${currentCg.directionsUrl}" target="_blank">${currentCg.directionsUrl}</a></p>
            <p>Directions Overview: ${currentCg.directionsoverview}</p>
            `)
        if(currentCg.latLong == ""){
            $(`#js-park-item-${currentCg.parkCode}`).append(`
            <div id="buttons-no-go">Weather and Hikes are not available for this site</div>
                `)
            } else {
            $(`#js-park-item-${currentCg.parkCode}`).append(`
            <button type="submit" id="get-accessibility-${currentCg.parkCode}" class="">Get Accessibilty Info</button>
            <button type="submit" id="hide-accessibility-${currentCg.parkCode}" class="hidden">Hide Accessibility Info</button>
            <button type="submit" id="show-accessibility-${currentCg.parkCode}" class="hidden">Show Accessibility Info</button>
            <p>Weather Overview: ${currentCg.weatheroverview}</p>
            <div> 7 day Weather Forecaset: <button type="submit" id="get-weather-${currentCg.parkCode}" class="">Get Weather</button>
            <button type="submit" id="hide-weather-${currentCg.parkCode}" class="hidden">Hide Weather</button>
            <button type="submit" id="show-weather-${currentCg.parkCode}" class="hidden">Show Weather</button>
            <button type="submit" id="get-nearbyHikes-${currentCg.parkCode}" class="">Get Nearby Hikes</button>
            <button type="submit" id="hide-nearbyHikes-${currentCg.parkCode}" class="hidden">Hide Nearby Hikes</button>
            <button type="submit" id="show-nearbyHikes-${currentCg.parkCode}" class="hidden">Show Nearby Hikes</button>
            `)}
        getAccessibility(currentCg);
        getWeather(currentCg);
        getHikes(currentCg);
    }}   
};

////list accessibility features available at the campsite
function getAccessibility(currentCg){  
    console.log(`currentCg function was called ${currentCg.parkCode}`)
    $(`#get-accessibility-${currentCg.parkCode}`).click(event => {
        event.preventDefault();
        $(`#get-accessibility-${currentCg.parkCode}`).toggleClass('hidden');
        $(`#hide-accessibility-${currentCg.parkCode}`).toggleClass('hidden');    
        let thisAccess = Object.keys(currentCg);
        console.log(`the keys returned on click are ${thisAccess}`)
        console.log(`the name for this Campground is ${currentCg.name}`)
        $(`#js-park-item-${currentCg.parkCode}`).append(
            `<li id="js-park-accessibility-item-${currentCg.parkCode}" class=""><h3>${currentCg.name} - Accessibility Information</h3>
            <p>Wheelchair Access: ${currentCg.accessibility.wheelchairaccess}</p>
            <p>Ada Info: ${currentCg.accessibility.adainfo}</p>
            <p>Toilets: ${currentCg.amenities.toilets}</p>
            <p>Water: ${currentCg.amenities.potablewater}</p></li>
        <hr>`     
                )
    hideAccessibility(currentCg); 
    showAccessibility(currentCg);
    });   
}

function hideAccessibility(currentCg){   
    $(`#hide-accessibility-${currentCg.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-accessibility-item-${currentCg.parkCode}`).toggleClass('hidden');
        $(`#show-accessibility-${currentCg.parkCode}`).toggleClass('hidden');
        $(`#hide-accessibility-${currentCg.parkCode}`).toggleClass('hidden');      
    });
}

//toggle showing the weather again after initial show-hide sequence without regenerating code
function showAccessibility(currentCg){   
    $(`#show-accessibility-${currentCg.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-accessibility-item-${currentCg.parkCode}`).toggleClass('hidden');
        $(`#show-accessibility-${currentCg.parkCode}`).toggleClass('hidden');
        $(`#hide-accessibility-${currentCg.parkCode}`).toggleClass('hidden');      
    });  
}

//then run check on all or campground only endpoint, then combine fields and submit to correct endpoint
function localeSearch(){
    $('.initial-button').attr('disable',true);
    let all = document.querySelector('input[value="allParks"]');
    let only = document.querySelector('input[value="yesCampgrounds"]');   
    $('#second-container').submit(event => {
            event.preventDefault();
            $('.results').empty();
            $('#js-error-message').empty();
            let stateValue = $('#userStateSelection').val();
            let maxLimit = $('#maxLimitInput').val();
            let fields = ['operatingHours','entranceFees'];
    
            if(all.checked){
             stateSearch(stateValue, maxLimit, fields);
            }
            else if(only.checked){
             grabCampgrounds(stateValue, maxLimit);
            }else {
                $('.results').append('Please select a State to begin your search.')}
            }
     ); 
}

//initial listener removes opening screen and checks to find which search screen to show. 
function readyListener() {
    $('#container').submit(event => {
        event.preventDefault();
        console.log('detected click');
        $('.results').empty();
        $('#js-error-message').empty();
        $('.landing-page').addClass("hidden");
        //$('.initial-fieldset').addClass("hidden");
        $('header').addClass("hidden");
        //$('#container').addClass("hidden");
        //$('.discover-call-to-action').addClass("hidden");
        $('#NAIF-title').removeClass("hidden");
        $('#form-label').removeClass("hidden");
        $('#second-container').removeClass("hidden");
        $('#locale-search').removeClass("hidden");
       $('.campgrounds').addClass("stack-items");
       $('#second-container').addClass("find-parks-layout");

        /*if ($(window).width() > 980) {  
        document.body.style.background = "url('images_naif/naturelaptop.png') no-repeat";
        document.body.style.backgroundSize = "contain";   
        } else if (($(window).width() > 500) && ($(window).width() < 980)) {
            document.body.style.background = "url('images_naif/natureipad.png') no-repeat";
            document.body.style.backgroundSize = "contain";
        }*/
        localeSearch();
    });
}

//start up the initial click listener
readyListener();