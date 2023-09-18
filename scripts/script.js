const timer = document.getElementById("timer");
const bottle = document.getElementById("bottle");
const play = document.getElementById("play");
const sauces = document.getElementsByClassName("sauce");
const message = document.getElementById("message");
const workTime = 25*60;
const pauseTime = 5*60;

let tick = 0;
let currentInterval;
let remaining = 1;

let isGoing = false
let isWorking = true
let time = 25*60;

function updateDisplay()
{
    timer.textContent = `${Math.floor(time/60)}:${(time%60)<10?"0":""}${time%60}`;

}

function update()
{
    time -=1;
    
    if (isWorking)
    {
        remaining = time / workTime;
    }
    else
    {
        remaining = time / pauseTime;
    }


    updateDisplay();
}

function reset()
{
    isGoing = false;
        play.classList.remove("fa-circle-xmark");
        play.classList.add("fa-circle-xplay");
        clearInterval(currentInterval);
        time = 25*60;
}

function buttonPressed() {
    if (isGoing)
    {
        reset();
        updateDisplay();
    }
    else
    {
        isGoing = true;
        play.classList.remove("fa-circle-xplay");
        play.classList.add("fa-circle-xmark");
        currentInterval = setInterval(() => update(),10);
    }
}


function wave(res, amp, temporalPeriod, wavePeriod)
{
    //res is the resolution. = how many points are gonna be computed to draw the waves
    //amp is the amplitude of the waves.
    //temporalPeriod is how fast each point is moving
    //wavePeriod is how much the X position of a point influences the 
    console.log(tick)
    tick += 1;
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

setInterval(() => wave(50,20,54,0.2),20)
