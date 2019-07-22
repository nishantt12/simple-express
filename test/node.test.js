

var date = new Date();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// for (i = 0; i < 4 * 7; i++) {
//     console.log(date);
//     if (!isWeekend(date)) {
//         console.log(days[date.getDay()]);
//     }

//     date.setDate(date.getDate() + 1);
// }

var weeks = [];
for (var i = 0; i < 4; i++) {
    var date = new Date();
    var week = {};
    date.setDate(date.getDate() + (i* 7));
    week.date = date;
    // week.plan = ;
    weeks.push(week);
    console.log(date);
    console.log(week.date);
    
}

console.log(weeks);
function isWeekend(date) {
    return date.getDay() == 6 || date.getDay() == 0;
}