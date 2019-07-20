

var date = new Date();
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


for (i = 0; i < 4 * 7; i++) {
    console.log(date);
    if (!isWeekend(date)) {
        console.log(days[date.getDay()]);
    }

    date.setDate(date.getDate() + 1);
}


function isWeekend(date) {
    return date.getDay() == 6 || date.getDay() == 0;
}