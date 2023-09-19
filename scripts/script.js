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
const possibleTimes = [5,60,60*5,60*10,60*15,60*20,60*25,60*30,60*45,60*60,60*90,60*120];
let workTime = 5;
let pauseTime = 5;


let currentInterval;
let remaining = 1;

let isGoing;
let isWorking;
let time;
reset();
update();

function cycle()
{
    isWorking = !isWorking;
    if (isWorking)
    {
        time = workTime;
    }
    else
    {
        time = pauseTime;
    }
    update();
}

function updateColor(){
    if (!isGoing) mainBg.style.backgroundColor = "var(--glass-color)";
    if (isWorking)
    {
        Array.from(sauces).forEach(box => {
            box.style.backgroundColor = 'var(--tomato-color)';});
        if (isGoing) mainBg.style.backgroundColor = "var(--tomato-color)";
    }
    else
    {
        Array.from(sauces).forEach(box => {
            box.style.backgroundColor = 'var(--pause-color)';});
        if (isGoing) mainBg.style.backgroundColor = "var(--pause-color)";
    }
}

function updateMessage(){
    let txt = "click to start";
    if (isGoing)
    {
        txt = "REST"
        if (isWorking)
        {
            txt = "WORK"
        }
    }
    
    message.textContent = txt;
    
}

function time2text(t)
{
    return `${Math.floor(t/60)}:${(t%60)<10?"0":""}${t%60}`;
}

function updateDisplay()
{
    timer.textContent = time2text(time);
    updateMessage();
    updateColor();
}

function update()
{
    if (isWorking)
    {
        remaining = time / workTime;
    }
    else
    {
        remaining = time / pauseTime;
    }
    if (time <= 0)
    {
        cycle();
    }
    updateDisplay();
}

function reset()
{
    isGoing = false;
    isWorking = true;
    play.classList.remove("fa-circle-xmark");
    play.classList.add("fa-circle-xplay");
    clearInterval(currentInterval);
    time = workTime;
}

function start()
{
    time -=1;
    isGoing = true;
    play.classList.remove("fa-circle-xplay");
    play.classList.add("fa-circle-xmark");
    currentInterval = setInterval(() => {time -=1;update();},1000);
}

function buttonPressed() {
    if (isGoing)
    {
        reset();
    }
    else
    {
        start();
    }
    update();
}

function wave(res, amp, temporalPeriod, wavePeriod)
{
    //res is the resolution. = how many points are gonna be computed to draw the waves
    //amp is the amplitude of the waves.
    //temporalPeriod is how fast each point is moving up and down
    //wavePeriod is how much the X position of a point influences the phase
    let tick = Date.now()/15;
    let maxHeight = bottle.offsetHeight;
    //even though width must be the same as the height... just in case
    let width = bottle.offsetWidth;
    let incr = width/res;
    for (let i = 0; i < sauces.length; i++)
    {
        //relativeMaxHeight makes it so that waves are fully visible even when the bottle is full (or empty)
        relativeMaxHeight = maxHeight - 4*amp;
        //the height of the sauce
        let height = (relativeMaxHeight - Math.floor(remaining*relativeMaxHeight));
        //make the waves fully visible even when full
        height += 2*amp;
        //path is a csv path, using to mask the sauce. 
        let path = `M`;
        for (let j = 0; j<=res; j++)
        {
            let y = height;
            let sauceOffset = i/sauces.length;
            //im sorry about that, at the beginning I tried my best to do something clean...
            //TODO : something to easely change the phase of waves
            y += amp*Math.sin(sauceOffset + wavePeriod*j + Math.cos(1+10.2*(sauceOffset-0.5))*temporalPeriod * tick/1000);

            path += `${Math.round(j*incr)},${y} L`;
        }
        path += "500,500 L0,500 Z";
        let sauce = sauces[i];
        sauce.style.clipPath = `path('${path}')`;
    }
}


//settings
function updateSettings(){
    workTimeLabel.textContent = time2text(workTime) + " of work";
    pauseTimeLabel.textContent = time2text(pauseTime) + " of pause";
    reset();
    update();
}

workTimeSlider.addEventListener("input", (event) =>
{

    console.log(time2text(possibleTimes[event.target.value]));
    workTime = possibleTimes[event.target.value];
    updateSettings();
    
});
pauseTimeSlider.addEventListener("input", (event) =>
{

    console.log(time2text(possibleTimes[event.target.value]));
    pauseTime = possibleTimes[event.target.value];
    updateSettings();
    
});



setInterval(() => wave(50,20,54,0.2),30);
