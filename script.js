const timeElement = document.getElementById("clock");
const dateElement = document.getElementById("date");

function getNumberImage(num) {
    return `<img src="images/digit-${num}.png" alt="${num}" class="clock">`;
}

function updateTime() {
    var months = {
        "01": "January", 
        "02": "February", 
        "03": "March",
        "04": "April", 
        "05": "May", 
        "06": "June",
        "07": "July", 
        "08": "August", 
        "09": "September",
        "10": "October", 
        "11": "November", 
        "12": "December"
    };

    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const currDate = date.getDate().toString().padStart(2, '0');

    const clock = 
        getNumberImage(hours[0]) + getNumberImage(hours[1]) +
        getNumberImage("colon") +
        getNumberImage(minutes[0]) + getNumberImage(minutes[1]) +
        getNumberImage("colon") +
        getNumberImage(seconds[0]) + getNumberImage(seconds[1]);

    const currentDate = `${currDate} ${months[month]} ${year}`;

    timeElement.innerHTML = clock;
    dateElement.innerText = currentDate;
}

updateTime();
setInterval(updateTime, 1000);


let alarmHour, alarmMinute, alarmInterval;
let isAlarmSet = false;
let enableSound = true, enableVibration = true;

function toggleAlarm() {
    if (isAlarmSet) {
        clearAlarm();
    } else {
        setAlarm();
    }
}

function setAlarm() {
    alarmHour = prompt("Enter the alarm hour (0-23):");
    alarmMinute = prompt("Enter the alarm minutes (0-59):");

    if (alarmHour === null || alarmMinute === null) return; 

    if (alarmHour === "" || alarmMinute === "" || isNaN(alarmHour) || isNaN(alarmMinute)) {
        alert("Input isn't a number!");
        return;
    }

    alarmHour = parseInt(alarmHour);
    alarmMinute = parseInt(alarmMinute);

    if (alarmHour < 0 || alarmHour > 23) {
        alert("Invalid hour!");
        return;
    }
    if (alarmMinute < 0 || alarmMinute > 59) {
        alert("Invalid minutes!");
        return;
    }

    const formattedTime = `${alarmHour.toString().padStart(2, '0')}:${alarmMinute.toString().padStart(2, '0')}`;

    document.getElementById("alarmDisplay").innerText = `Alarm set for ${formattedTime}`;

    document.getElementById("alarmBtn").innerText = "Clear Alarm";

    isAlarmSet = true;

    checkAlarm();
}

function checkAlarm() {
    enableSound = document.getElementById("soundCheckbox").checked;
    enableVibration = document.getElementById("vibrateCheckbox").checked;

    const alarmSound = new Audio("sounds/alarm.mp3");
    
    const alarmInterval = setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (currentHour === alarmHour && currentMinute === alarmMinute) {
            if(enableSound){
                alarmSound.play();
            }
            if (enableVibration && "vibrate" in navigator) {
                navigator.vibrate([500, 500, 500]); 
            }

            alert("Alarm is ringing!");

            alarmSound.pause();
            alarmSound.currentTime = 0; 

            clearInterval(alarmInterval);
        }
    }, 1000);
}

function clearAlarm() {
    alarmHour = null;
    alarmMinute = null;
    clearInterval(alarmInterval);
    alarmInterval = null;

    document.getElementById("alarmDisplay").innerText = "";

    document.getElementById("alarmBtn").innerText = "Set Alarm";

    isAlarmSet = false;
}