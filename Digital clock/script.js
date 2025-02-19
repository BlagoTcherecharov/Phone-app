const timeElement = document.getElementById("clock");

function updateTime(){

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
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds= date.getSeconds();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const currDate = date.getDate().toString().padStart(2, '0');

    const clock = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const currentDate = `${currDate} ${months[month]} ${year}`;
    timeElement.innerText = `${clock}\n${currentDate}`;
}
updateTime();
setInterval(updateTime, 1000);
