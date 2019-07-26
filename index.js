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
    if(fields.includes('operatingHours')){fetch(newUrl)
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
        })
    }

}


//fetch the weather data
function getWeather(weatherLat, weatherLong){
    let weatherPoints = `${weatherLat},${weatherLong}`
    let weatherUrl = `https://api.weather.gov/points/${weatherPoints}/forecast`
    fetch(weatherUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('response.statusText');
    })
    .then(responseJson => formatWeather(responseJson))
    .catch(error => {
        $('#js-error-message').text(`Weather: Oops there it is. ${error.message}`)
    })
}

function formatWeather(responseJson){
    return responseJson.data;
}

//display the basic info on state parks iterating over each park and operating hour sub-objects
function displayResultsStateParksWithHours(responseJson) {
    let parkList = responseJson.data;
    console.log(`parkList length is ${parkList.length}`);
    for (let i = 0; i < parkList.length; i++) { 
        for(let j=0; j < parkList[i].operatingHours.length; j++){
        $('.results').append(
            `<li id="js-list-item-${parkList[i]}"><h3>${parkList[i].fullName}-${parkList[i].operatingHours[j].name}</h3>
            <p>${parkList[i].description}</p>
            <p><a href="${parkList[i].url}" target="_blank">${parkList[i].url}</a></p>
           
            <p>Standard Operating Hours at ${parkList[i].operatingHours[j].name}</p>
            <p>${parkList[i].operatingHours[j].description}</p>
                <p>Monday: ${parkList[i].operatingHours[j].standardHours.monday}</p>
                <p>Tuesday: ${parkList[i].operatingHours[j].standardHours.tuesday}</p>
                <p>Wedesday: ${parkList[i].operatingHours[j].standardHours.wednesday}</p>
                <p>Thursday: ${parkList[i].operatingHours[j].standardHours.thursday}</p>
                <p>Friday: ${parkList[i].operatingHours[j].standardHours.friday}</p>
                <p>Saturday: ${parkList[i].operatingHours[j].standardHours.saturday}</p>
                <p>Sunday: ${parkList[i].operatingHours[j].standardHours.sunday}</p>
        </li>
        <hr>`
        )
        if(parkList[i].latlong != 'undefined'){
            let weatherLat = parkList[i].latLong;
        console.log(`line 86 weatherLat is ${weatherLat}`);
        
        let weatherData = weatherLat.split(' ');
        console.log(`weatherData is ${weatherData}`)
        let latitude = weatherData[0].slice(4,14);
        let longitude = weatherData[1].slice(5,15);
        
        let weatherPrediction  =  getWeather(latitude,longitude);
        console.log(`latitude is ${latitude}. longitude is ${longitude}`)
        let fullWeatherPrediction = weatherPrediction.periods; 
        for(let k=0; k<fullWeatherPrediction.length; k++){
        $('#js-list-item-parkList[i]').append(
            `${fullWeatherPrediction.name}
            ${fullWeatherPrediction.temperature}
            `
        )
        }
    } }
    }           
    $('.results').removeClass('hidden');
};

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
};



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
        })
}

//display the results from the campground API endpoint
function displayResultsCampgrounds(responseJson) {
    let campgroundResults = responseJson.data;
    console.log(`camgroundResults length is ${campgroundResults.length}`);
}


//details search screen, first block action of initial button, 
//then run check on all or campground only endpoint, then combine fields and submit to correct endpoint
function localeSearch() {
    $('.initial-button').attr('disable',true);
    let all = document.querySelector('input[value="allParks"]');
    let only = document.querySelector('input[value="yesCampgrounds"]');
    
    $('.js-campground-question').change(function() {
        
        event.preventDefault();
        $('#addFees-field-options').removeClass('hidden');
        $('#addHours-field-options').removeClass('hidden');
    
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
            let entranceFeesField = document.querySelector('input[value="addFees"]');
            let operatingHoursField = document.querySelector('input[value="addHours"]');
            let accessibilityField= document.querySelector('input[value="addAccessibility"]');
        
            console.log(stateValue, maxLimit, addHours, addFees, addAccessibility);
            let fields = [];
             if(entranceFeesField.checked){
                fields.push('entranceFees');
            }
             if(operatingHoursField.checked){
                fields.push('operatingHours');
            }
             
             console.log(fields);
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
function chooserListener() {
    $('#container').on('submit', event => {
        event.preventDefault();
        console.log('detected click');
        $('.results').empty();
        $('.js-error-message').empty();
        $('.initial-fieldset').addClass("hidden");
        $('.discover-call-to-action').addClass("hidden");
        
        let nextScreen = document.querySelector('input[name="initial-questions"]:checked').value;
        console.log(nextScreen);
        if(nextScreen == "details"){
            $('#detail-search').removeClass("hidden")
        } else if(nextScreen == "timing"){
            $('#weather-search').removeClass("hidden")
        } else $('#locale-search').removeClass("hidden")
        localeSearch();
    });
}



//start up the initial click listener
chooserListener();