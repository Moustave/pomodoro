const timer = document.getElementById("timer");
const bottle = document.getElementById("bottle");
const play = document.getElementById("play");
const sauces = document.getElementsByClassName("sauce");
const message = document.getElementById("message");
const mainBg = document.getElementById("main");
const workTimeSlider = document.getElementById("workTimeSlider");
const workTimeLabel = document.getElementById("workTimeLabel");
const pauseTimeSlider = document.getElementById("pauseTimeSlider");
const pauseTimeLabel = document.getElementById("pauseTimeLabel");
//possibleTimes = every possible time for the sliders
const possibleTimes = [
  5,
  60,
  60 * 5,
  60 * 10,
  60 * 15,
  60 * 20,
  60 * 25,
  60 * 30,
  60 * 45,
  60 * 60,
  60 * 90,
  60 * 120,
];
//default values of the timer are 25mins and 5mins
let workTime = 25 * 60;
let pauseTime = 5 * 60;

//currentInterval will store the Interval used to update the timer every second, so that we can easely kill it
let currentInterval;

//remaining is the remaining time / total time. it is used by wave() to easely know the height of them 
let remaining = 1;

//booleans used to know the state we are in
let isGoing;
let isWorking;

//the time remaining
let time;

//clycle() is used at the end of a cycle
function cycle() {
  isWorking = !isWorking;
  if (isWorking) {
    time = workTime;
  } else {
    time = pauseTime;
  }
  update();
}

//updateColor() updates the colors of : the sauces & the background behind the bottle
function updateColor() {
  if (!isGoing) mainBg.style.backgroundColor = "var(--glass-color)";
  if (isWorking) {
    Array.from(sauces).forEach((box) => {
      box.style.backgroundColor = "var(--tomato-color)";
    });
    if (isGoing) mainBg.style.backgroundColor = "var(--tomato-color)";
  } else {
    Array.from(sauces).forEach((box) => {
      box.style.backgroundColor = "var(--pause-color)";
    });
    if (isGoing) mainBg.style.backgroundColor = "var(--pause-color)";
  }
}

//updateMessage() changes the text at the bottom of the bottle
function updateMessage() {
  let txt = "click to start";
  if (isGoing) {
    txt = "REST";
    if (isWorking) {
      txt = "WORK";
    }
  }

  message.textContent = txt;
}

//time2text(t) takes a positive time in seconds and returns a string that looks like "min:sec"
function time2text(t) {
  return `${Math.floor(t / 60)}:${t % 60 < 10 ? "0" : ""}${t % 60}`;
}

//updateDisplay() changes the time remaining displayed and calls updateMessage() + updateColor()
function updateDisplay() {
  timer.textContent = time2text(time);
  updateMessage();
  updateColor();
}

//update() calculate 'remaining', checks if we need to cycle and calls updateDisplay()
function update() {
  if (isWorking) {
    remaining = time / workTime;
  } else {
    remaining = time / pauseTime;
  }
  if (time <= 0) {
    cycle();
  }
  updateDisplay();
}

//reset() is pretty obvious imo.. used to go back to the initial state (called by buttonPressed() and at the beginning)
function reset() {
  isGoing = false;
  isWorking = true;
  //change the reset button to a play button
  play.classList.remove("fa-circle-xmark");
  play.classList.add("fa-circle-xplay");
  clearInterval(currentInterval);
  time = workTime;
}

//start() is called by buttonPressed() when the user wanna start the timer
function start() {
  time -= 1;
  isGoing = true;
  //change the play button to a reset button
  play.classList.remove("fa-circle-xplay");
  play.classList.add("fa-circle-xmark");
  //this interval decrements time and calls update() every single second until the user stops the timer
  currentInterval = setInterval(() => {
    time -= 1;
    update();
  }, 1000);
}

//function called by the bottle when it is pressed
function buttonPressed() {
  if (isGoing) {
    reset();
  } else {
    start();
  }
  update();
}

//ugly method, uses sins and a svg clip path to makes waves
//Even though I initialy wanted to use curves (like Bézier curves) on the clip, everything are polygons now
  //res is the resolution. = how many points are gonna be computed to draw the waves
  //amp is the amplitude of the waves.
  //temporalPeriod is how fast each point is moving up and down
  //wavePeriod is how much the X position of a point influences the phase
function wave(res, amp, temporalPeriod, wavePeriod) {
  let tick = Date.now() / 15;
  let maxHeight = bottle.offsetHeight;
  let width = bottle.offsetWidth;
  //incr is the X distance between each points
  let incr = width / res;
  //iterates through every sauce (3 for the moment)
  for (let i = 0; i < sauces.length; i++) {
    //relativeMaxHeight makes it so that waves are fully visible even when the bottle is full (or empty)
    relativeMaxHeight = maxHeight - 4 * amp;
    //the height of the sauce
    let height = relativeMaxHeight - Math.floor(remaining * relativeMaxHeight);
    //make the waves fully visible even when full
    height += 2 * amp;
    //path is a svg path, using to mask the sauce.
    let path = `M`;
    //iterates through the upper points of the wave
    for (let j = 0; j <= res; j++) {
      let y = height;
      let sauceOffset = i / sauces.length;
      //TODO : something cleaner
      y +=
        amp *
        Math.sin(
          sauceOffset +
            wavePeriod * j +
            (Math.cos(1 + 10.2 * (sauceOffset - 0.5)) * temporalPeriod * tick) /
              1000
        );

      path += `${Math.round(j * incr)},${y} L`;
    }
    //end the clip shape (bottom-right; then bottom-left; then close)
    path += "500,500 L0,500 Z";
    let sauce = sauces[i];
    sauce.style.clipPath = `path('${path}')`;
  }
}

//SETTINGS

//saves the settings on the local storage
function saveSettings() {
  localStorage.setItem("pomodoroWorkTime", workTime);
  localStorage.setItem("pomodoroPauseTime", pauseTime);
}

//load the settings from the local storage, only called at the beginning
function loadSettings() {
  let res;
  res = localStorage.getItem("pomodoroWorkTime");
  workTime = res == null ? workTime : parseInt(res);
  res = localStorage.getItem("pomodoroPauseTime");
  pauseTime = res == null ? pauseTime : parseInt(res);
  saveSettings();
  workTimeSlider.value = possibleTimes.indexOf(workTime);

  pauseTimeSlider.value = possibleTimes.indexOf(pauseTime);
}

//updates the settings, called when the sliders are being changed
function updateSettings() {
  //tells the user the selected settings (very important !)
  workTimeLabel.textContent = time2text(workTime) + " work";
  pauseTimeLabel.textContent = time2text(pauseTime) + " pause";
  reset();
  update();
  saveSettings();
}

//Listeners of the sliders
workTimeSlider.addEventListener("input", (event) => {
  workTime = possibleTimes[event.target.value];
  updateSettings();
});
pauseTimeSlider.addEventListener("input", (event) => {
  pauseTime = possibleTimes[event.target.value];
  updateSettings();
});

reset();
update();

loadSettings();
updateSettings();

//interval that calls wave() every 40ms (25fps, but it's interpolated by the css)
//I'm sure there are way better ways but it's ok for now
//some computers, to save battery, will make it look like it's called every second... 
setInterval(() => wave(50, 20, 54, 0.2), 40);
