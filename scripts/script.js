const timer = document.getElementById("timer");
const bottle = document.getElementById("bottle");
const play = document.getElementById("play");
let currentInterval;

let isGoing = false
let isWorking = true
let time = 25*60;

timer.textContent = `${Math.floor(time/60)}:${(time%60)<10?"0":""}${time%60}`;

function updateDisplay()
{
    timer.textContent = `${Math.floor(time/60)}:${(time%60)<10?"0":""}${time%60}`;
    if (isGoing)
    {
        
    }
}

function update()
{
    time -=1;
    updateDisplay();
}

function reset()
{
    isGoing = false;
        play.classList.remove("fa-xmark");
        play.classList.add("fa-xplay");
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
        play.classList.remove("fa-xplay");
        play.classList.add("fa-xmark");
        currentInterval = setInterval(() => update(),1000);
    }
}
