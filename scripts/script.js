const timer = document.getElementById("timer")
const bottle = document.getElementById("bottle")
let currentInterval;

let isGoing = false
let isWorking = true
let time = 25*60;

timer.textContent = `${Math.floor(time/60)}:${(time%60)<10?"0":""}${time%60}`;

function updateTimer()
{
    time -=1;
}

function buttonPressed() {
    if (isGoing)
    {
        isGoing = false;
        clearInterval(currentInterval);
    }
    else
    {
        isGoing = true;
        currentInterval = setInterval(updateTimer(),1000);
    }
}
