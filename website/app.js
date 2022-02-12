/* Global Variables */
const apiKey = "fc440e0d138f5331d180a486a0add07f&units=metric"; // Personal API Key for OpenWeatherMap API (metric units)
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip="; // The base URL
const dateElement = document.getElementById("date"); //  a variable for date element
const tempElement = document.getElementById("temp"); //  a variable for temperature element
const contentElement = document.getElementById("content"); //  a variable for content element

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "-" + d.getDate() + "-" + d.getFullYear();

// call the generateAction function when the user clicks the generate button
document.getElementById("generate").addEventListener("click", generateAction);

// a function to be called when the user clicks the generate button
function generateAction() {
  const zipCode = document.getElementById("zip").value; // the zip code which the user input
  const feeling = document.getElementById("feelings").value; // the feeling which the user input
  // make sure the zipcode has a value
  if (zipCode) {
    // call getData function to fetch the data from API
    getData(baseUrl, zipCode, apiKey)
      // chain another promise to post the weather data and user inputs to local server
      .then((data) => {
        postData("/any", {
          temp: data.main.temp,
          date: newDate,
          content: feeling,
        });
      })
      // chain another promise to update the UI dynamically
      .then(() => updateUI())
      // handle the error
      .catch((error) => {
        console.log(error);
        alert("something went wrong!! , try again with a valid zip code");
      });
  } else {
    alert("Please enter zip code");
  }
}

// an asynchronous function to get the weather data from the API
const getData = async (baseUrl, zipCode, apiKey) => {
  // fetch data from API
  const res = await fetch(baseUrl + zipCode + "&appid=" + apiKey);
  // parses JSON response into native JavaScript object and return it
  const data = await res.json();
  return data;
};

// an asynchronous function to post the data to the local server
const postData = async (url = "", data = {}) => {
  await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    // convert to JSON
    body: JSON.stringify({
      temp: data.temp,
      date: data.date,
      content: data.content,
    }),
  });
};

// an asynchronous function to fetch the data from the server and update the user interface
const updateUI = async () => {
  // fetch the data from local server
  const request = await fetch("/all");
  // parses JSON response into native JavaScript object
  const currentData = await request.json();
  console.log(currentData);
  // update the elements with the new values fetched from the server
  dateElement.innerHTML = currentData.date;
  tempElement.innerHTML = currentData.temp + " &deg;C";
  contentElement.innerHTML = "you feel: " + currentData.content;
};
