const rotateMin = (date) => {
  const minuteHand = document.getElementById("minute");
  let secVal = date.getSeconds(),
    degFromSeconds = 0.1 * secVal,
    minuteVal = date.getMinutes();
  console.log(
    "secVal:",
    secVal,
    "\ndegFromSeconds:",
    degFromSeconds,
    "mminuteVal:",
    minuteVal
  );
  minuteHand.style.transform = `rotate(${minuteVal * 6 + degFromSeconds}deg)`;

  rotateHour(date, minuteVal);
};

const rotateHour = (date, minuteVal) => {
  const hourHand = document.getElementById("hour");
  let degFromMin = 0.5 * minuteVal,
    hourVal = date.getHours();

  hourHand.style.transform = `rotate(${hourVal * 30 + degFromMin}deg)`;
};

const weekDay = (date) => {
  const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    dateIndex = date.getDay();
  return weekDays[dateIndex];
};

const monthName = (date) => {
  const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthIndex = date.getMonth();
  return monthNames[monthIndex];
};

const displayDate = (date) => {
  const dateOutput = document.getElementById("date-text"),
    dayNumber = date.getDate();

  dateOutput.innerHTML = `${weekDay(date)},<br/>${monthName(
    date
  )} ${dayNumber}`;
};

const getUserLocation = async () => {
  let connection = await fetch("https://ipapi.co/json/");
  if (connection.ok) {
    let response = await connection.json(),
      location = `${response.city}, ${response.country}`;
    return location;
  } else {
    return false;
  }
};

const getWeatherInfo = () => {
  return getUserLocation().then(async (location) => {
    if (!location) {
      return false;
    }
    document.getElementById("location").innerHTML = location;
    let connection = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=38a5051e7ce6493f86c50549200212&q=${location}&units=imperial`,
      { cache: "no-cache" }
    );

    if (connection.ok) {
      let response = await connection.json(),
        info = response.current;
      return info;
    } else {
      return false;
    }
  });
};

const printTempInfo = (scale) => {
  getWeatherInfo().then((info) => {
    if (!info) {
      return false;
    }
    const temp = document.getElementById("weather-temp");
    switch (scale) {
      case "c":
        temp.innerHTML = `${info.temp_c}°c`;
        temp.title = "Celsius";
        break;
      case "f":
        temp.innerHTML = `${info.temp_f}°f`;
        temp.title = "Fahrenheit";
        break;
    }
  });
};

const printWeatherInfo = () => {
  getWeatherInfo().then((info) => {
    if (!info) {
      return false;
    }
    const icon = document.getElementById("weather-icon"),
      temp = document.getElementById("weather-temp"),
      parent = document.getElementById("weather");
    const lastmodified = document.getElementById("last-modified");
    var datetime = new Date(info.last_updated_epoch * 1000);
    lastmodified.innerHTML = `Last updated: ${datetime.toLocaleString()}`;

    icon.src = info.condition.icon;
    icon.alt = info.condition.text;
    icon.title = info.condition.text;
    printTempInfo("f");

    icon.addEventListener("load", () => (parent.style.display = "flex"));
    temp.addEventListener("click", switchTempScale);
  });
};

const switchTempScale = () => {
  const temp = document.getElementById("weather-temp");
  temp.title[0] = "F" ? printTempInfo("c") : printTempInfo("f");
};

window.addEventListener("load", () => {
  setInterval(() => {
    let dd = new Date();
    rotateMin(dd);
  }, 1);
  let dd = new Date();
  displayDate(dd);
  printWeatherInfo();
});
