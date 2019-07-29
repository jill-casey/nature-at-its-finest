'use strict'

const apiKey = 'z5UamSS2tY6wiHIGqaDAN45vz0U1M4VHB55z8U0n';

function formatUrl(stateValue, maxLimit, fields) {
    let params = `stateCode=${stateValue}&limit=${maxLimit}&fields=${fields}&api_key=${apiKey}`
    return params;
}

function stateSearch(stateValue, maxLimit, fields) {
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
        $('#js-error-message').text(`Oops there it is. ${error.message}`)
    })
}
    /*if(fields.includes('operatingHours')){fetch(newUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('response.statusText');
        })
        .then(responseJson => displayResultsStateParksWithHours(responseJson))
        .catch(error => {
            $('#js-error-message').text(`Oops there it is. ${error.message}`)
        })
    } else{fetch(newUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('response.statusText');
        })
        .then(responseJson => displayResultsStateParksNoHours(responseJson))
        .catch(error => {
            $('#js-error-message').text(`Oops there it is. ${error.message}`)
        })*/
    
//simplified function to get the basic data each response can send for more display info
function displayParks(responseJson){
    $('.results').removeClass('hidden');   
    let parkList = responseJson.data;
    console.log(`parkList length is ${parkList.length}`);
    for (let i = 0; i < parkList.length; i++) {
        let currentPark = parkList[i];   
        $('.results').append(
            `<li id="js-park-item-${currentPark.parkCode}"><h3>${currentPark.fullName}</h3>
            <p>${currentPark.description}</p>
            <p><a href="${currentPark.url}" target="_blank">${currentPark.url}</a></p>
            <button type="submit" id="get-hours-${currentPark.parkCode}" class="">Get Hours</button>
            <button type="submit" id="hide-hours-${currentPark.parkCode}" class="hidden">Hide Hours</button>
            <button type="submit" id="show-hours-${currentPark.parkCode}" class="hidden">Show Hours</button>
            <button type="submit" id="get-weather-${currentPark.parkCode}" class="">Get Weather</button>
            <button type="submit" id="hide-weather-${currentPark.parkCode}" class="hidden">Hide Weather</button>
            <button type="submit" id="show-weather-${currentPark.parkCode}" class="hidden">Show Weather</button>
            `
        )
        getHours(currentPark);
        getWeather(currentPark);
        
    }   
}


//param loaded from specific button to select park then toggle button and append operating hours
function getHours(currentPark){   
    $(`#get-hours-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#get-hours-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-hours-${currentPark.parkCode}`).toggleClass('hidden');    
        let thisHours = Object.keys(currentPark);
        console.log(`the keys returned on click are ${thisHours}`)
        console.log(`the name for this park is ${currentPark.name}`)
        for(let j=0; j < currentPark.operatingHours.length; j++){
        $(`#js-park-item-${currentPark.parkCode}`).append(
            `<li id="js-park-hours-item-${currentPark.parkCode}"><h3>${currentPark.fullName}-${currentPark.operatingHours[j].name}</h3>
            <p>Standard Operating Hours at ${currentPark.operatingHours[j].name}</p>
            <p>${currentPark.operatingHours[j].description}</p>
                <p>Monday: ${currentPark.operatingHours[j].standardHours.monday}</p>
                <p>Tuesday: ${currentPark.operatingHours[j].standardHours.tuesday}</p>
                <p>Wedesday: ${currentPark.operatingHours[j].standardHours.wednesday}</p>
                <p>Thursday: ${currentPark.operatingHours[j].standardHours.thursday}</p>
                <p>Friday: ${currentPark.operatingHours[j].standardHours.friday}</p>
                <p>Saturday: ${currentPark.operatingHours[j].standardHours.saturday}</p>
                <p>Sunday: ${currentPark.operatingHours[j].standardHours.sunday}</p>
        </li>
        <hr>`
        )}
        hideHours(currentPark); 
        showHours(currentPark);
    })
}    


//toggle hide the hours
function hideHours(currentPark){   
    $(`#hide-hours-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-hours-item-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#show-hours-${currentPark.parkCode}`).toggleClass('hidden');
        $(`#hide-hours-${currentPark.parkCode}`).toggleClass('hidden');      
    });
}


//toggle showing the hours again after initial show-hide sequence without regenerating code
function showHours(currentPark){   
    $(`#show-hours-${currentPark.parkCode}`).click(event => {
        event.preventDefault();
        $(`#js-park-hours-item-${currentPark.parkCode}`).toggleClass('hidden');
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

    let weatherData = weatherLatLong.split(' ');
    console.log(`weatherData is ${weatherData}`)
    
    let latitude = weatherData[0].slice(4,14);
    let longitude = weatherData[1].slice(5,15);

    getForecast(currentPark, latitude, longitude);
    console.log(`latitude is ${latitude}. longitude is ${longitude}`)
}



//fetch the forecast from api.weather.gov data
function getForecast(currentPark, latitude, longitude){
    let weatherPoints = `${latitude},${longitude}`
    let weatherUrl = `https://api.weather.gov/points/${weatherPoints}/forecast`
    fetch(weatherUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('response.statusText');
    })
    .then(responseJson => displayWeather(currentPark, responseJson))
    .catch(error => {
        $('#js-error-message').text(`Weather: Oops there it is. ${error.message}`)
    })
}


function displayWeather(currentPark, responseJson){
    let fullWeatherPrediction = responseJson.properties;
    
    $(`#js-park-item-${currentPark.parkCode}`).append(
        `<li id="js-park-weather-item-${currentPark.parkCode}"><h3>${currentPark.name} Weather </h3>
        </li>`
        );
        
        
    for(let k=0; k< 14; k++){
        let isoDate = `${fullWeatherPrediction.periods[k].startTime}`;
        let dateStr = Date.parse(isoDate);
        let newDate = new Date(dateStr);
        console.log(`newDate is ${newDate}`);
        let finalDate = newDate.toDateString();
        
        
        $(`#js-park-weather-item-${currentPark.parkCode}`).append(     
        `<li id="js-weather-details-${fullWeatherPrediction.periods[k].name}">
        <p>${fullWeatherPrediction.periods[k].name}</p>
        <div>When: ${finalDate}
        <div class="forecaset">${fullWeatherPrediction.periods[k].shortForecast}</div>
        <div class="temp">${fullWeatherPrediction.periods[k].temperature}F</div>
        <div>Wind: ${fullWeatherPrediction.periods[k].windDirection} ${fullWeatherPrediction.periods[k].windSpeed}</div>
        
        </li>`
        )};
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



//use the results to get the parkcode and check on campground status
function grabCampgrounds(stateValue, maxLimit, fields){
    const newParams = formatUrl(stateValue, maxLimit, fields)
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
            $('#js-error-message').text(`grab campgrounds: Oops there it is. ${error.message}`)
        });
}

//display the results from the campground API endpoint
function displayResultsCampgrounds(responseJson) {
    let campgroundResults = responseJson.data;
    console.log(`camgroundResults length is ${campgroundResults.length}`);
};



//then run check on all or campground only endpoint, then combine fields and submit to correct endpoint
function localeSearch(){
    $('.initial-button').attr('disable',true);
    let all = document.querySelector('input[value="allParks"]');
    let only = document.querySelector('input[value="yesCampgrounds"]'); 
    $('.js-campground-question').change(function() {
        if(only.checked){
        $('#addAccessibility-field-options').removeClass('hidden');
        }
        if(all.checked){
        $('#addAccessibility-field-options').addClass('hidden');
        }  
    });
      
    //identify which values from the locale-search form should be passed through to the API and which API endpoint
    $('#container').submit(event => {
            event.preventDefault();
            $('.results').empty();
            $('.js-error-message').empty();
            let stateValue = $('#userStateSelection').val();
            let maxLimit = $('#maxLimitInput').val();

            let fields = ['operatingHours','entranceFees'];
            let accessibilityField= document.querySelector('input[value="addAccessibility"]');
        
            if(all.checked){
             stateSearch(stateValue, maxLimit, fields);
            }
            else if(only.checked){
                if(accessibilityField.checked){
                    fields.push('accessibility');
                }
             grabCampgrounds(stateValue, maxLimit, fields);
            }
            else {console.log('did not find a value for localeSearch')}
            });
   
}

//initial listener removes opening screen and checks to find which search screen to show. 
function readyListener() {
    $('#container').on('submit', event => {
        event.preventDefault();
        console.log('detected click');
        $('.results').empty();
        $('.js-error-message').empty();
        $('.initial-fieldset').addClass("hidden");
        $('.discover-call-to-action').addClass("hidden");
        $('#locale-search').removeClass("hidden");
        localeSearch();
    });
}



//start up the initial click listener
readyListener();