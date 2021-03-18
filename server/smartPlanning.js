const uuid = require('uuid');

function getFirstDay() {
    let firstDay = new Date();
    if (firstDay.getHours() >= 9) {
        firstDay = new Date(firstDay.setDate(firstDay.getDate() + 1));
    }
    firstDay = new Date(firstDay).setHours(0);
    firstDay = new Date(firstDay).setMinutes(0);
    firstDay = new Date(firstDay);
    return firstDay;
}

function duplicateRecurringAppointments(input, appointments) {
    const recurAppointments = [...appointments];
    appointments.forEach(appointment => {
        if (appointment.rRule) {
            let recurStartDate = new Date(appointment.startDate);
            let recurEndDate = new Date(appointment.endDate);
            if (appointment.rRule.includes("FREQ=MONTHLY")) {
                while (new Date(recurStartDate) <= new Date(input.deadline)) {
                    recurStartDate = new Date(
                        recurStartDate.setMonth(
                            new Date(recurStartDate).getMonth() + daysToAdd
                        )
                    );
                    recurEndDate = new Date(
                        recurEndDate.setMonth(
                            new Date(recurEndDate).getMonth() + daysToAdd
                        )
                    );
                    const recurAppointment = { ...appointment };
                    recurAppointment.startDate = new Date(recurStartDate);
                    recurAppointment.endDate = new Date(recurEndDate);
                    recurAppointments.push(recurAppointment);
                }
            } else {
                let daysToAdd = 0;
                if (appointment.rRule === "FREQ=DAILY;INTERVAL=1") {
                    daysToAdd = 1;
                }
                if (appointment.rRule.includes("FREQ=WEEKLY")) {
                    daysToAdd = 7;
                }
                while (new Date(recurStartDate) <= new Date(input.deadline)) {
                    recurStartDate = new Date(
                        recurStartDate.setDate(
                            new Date(recurStartDate).getDate() + daysToAdd
                        )
                    );
                    recurEndDate = new Date(
                        recurEndDate.setDate(
                            new Date(recurEndDate).getDate() + daysToAdd
                        )
                    );
                    const recurAppointment = { ...appointment };
                    recurAppointment.startDate = new Date(recurStartDate);
                    recurAppointment.endDate = new Date(recurEndDate);
                    recurAppointments.push(recurAppointment);
                }
            }
        }
    });
    return recurAppointments;
}

function getArrayCalendar(input, appointments) {
    let firstDay = getFirstDay();
    let deadlineDate = new Date(input.deadline).getDate();
    const arrayCalendar = [];
    let availDays = deadlineDate - firstDay.getDate();

    for (let i = 0; i < availDays; i++) {
        const day = [];
        for (j = 0; j < 48; j++) {
            day.push("free");
        }
        arrayCalendar.push(day);
    }

    // This alogrithm does not consider cross-day case e.g. 23:30 15/1 ~ 01:30 16/1
    appointments.forEach(appointment => {
        let dayNum = new Date(appointment.startDate).getDate() - firstDay.getDate();
        if (dayNum >= 0 && dayNum < arrayCalendar.length) {
            let startDate = new Date(appointment.startDate);
            let endDate = new Date(appointment.endDate);
            let startMark = 0;
            let endMark = 0;

            let lowerTimePointer = new Date(appointment.startDate);
            lowerTimePointer = new Date(lowerTimePointer).setHours(0);
            lowerTimePointer = new Date(lowerTimePointer).setMinutes(0);
            lowerTimePointer = new Date(lowerTimePointer);

            let upperTimePointer = new Date(appointment.startDate);
            upperTimePointer = new Date(upperTimePointer).setHours(0);
            upperTimePointer = new Date(upperTimePointer).setMinutes(30);
            upperTimePointer = new Date(upperTimePointer);

            for (let i = 0; i < 48; i++) {
                if (startDate >= lowerTimePointer && startDate < upperTimePointer) {
                    startMark = i;
                }
                if (endDate > lowerTimePointer && endDate <= upperTimePointer) {
                    endMark = i;
                    break;
                }
                lowerTimePointer = new Date(new Date(lowerTimePointer).setMinutes(new Date(lowerTimePointer).getMinutes() + 30));
                upperTimePointer = new Date(new Date(upperTimePointer).setMinutes(new Date(upperTimePointer).getMinutes() + 30));
            }

            for (let i = startMark; i <= endMark; i++) {
                arrayCalendar[dayNum][i] = "occupied";
            }
        }
    });
    return arrayCalendar;
}

function allocate(input, arrayCalendar) {
    const solution = [...arrayCalendar];
    let remaining = input.exDuration * 2;
    let minSlots = input.divisible ? input.minSession * 2 : remaining;
    let maxSlots = input.divisible ? input.maxSession * 2 : remaining;

    for (let i = 0; i < solution.length; i++) {
        day:
        for (let k = maxSlots; k >= minSlots; k--) {
            for (let j = 18; j < 48 - k; j++) {
                if (solution[i].slice(j, j + k).every((slot) => { return slot === "occupied" ? false : true })) {
                    for (let m = j; m < j + k; m++) {
                        solution[i][m] = "picked";
                        remaining -= 1;
                        if (remaining < maxSlots)
                            maxSlots = remaining;
                        if (remaining === 0) {
                            return solution;
                        }
                    }
                    break day;
                }
            }
        }
    }
    return false;
}

function convertToJSON(input, solution) {
    const result = [];
    let firstDay = getFirstDay();

    let lowerTimePointer = new Date(firstDay);
    lowerTimePointer = new Date(lowerTimePointer).setHours(0);
    lowerTimePointer = new Date(lowerTimePointer).setMinutes(0);
    lowerTimePointer = new Date(lowerTimePointer);

    let upperTimePointer = new Date(firstDay);
    upperTimePointer = new Date(upperTimePointer).setHours(0);
    upperTimePointer = new Date(upperTimePointer).setMinutes(30);
    upperTimePointer = new Date(upperTimePointer);

    for (let i = 0; i < solution.length; i++) {
        let startDate = null;
        let endDate = null;
        for (let j = 0; j < 48; j++) {
            if (solution[i][j] === "picked") {
                if (!startDate)
                    startDate = lowerTimePointer;
                endDate = upperTimePointer;
                if (solution[i][j + 1] !== "picked") {
                    const appointment = {
                        id: uuid.v4(),
                        title: input.title,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        description: input.description
                    }
                    result.push(appointment);
                }
            }
            lowerTimePointer = new Date(new Date(lowerTimePointer).setMinutes(new Date(lowerTimePointer).getMinutes() + 30));
            upperTimePointer = new Date(new Date(upperTimePointer).setMinutes(new Date(upperTimePointer).getMinutes() + 30));
        }
    }
    return result;
}

function smartPlanning(input, appointments) {
    const recurringAppointments = duplicateRecurringAppointments(input, appointments);
    const arrayCalendar = getArrayCalendar(input, recurringAppointments);
    const solution = allocate(input, arrayCalendar);
    return solution ? convertToJSON(input, solution) : false;
}

module.exports = smartPlanning;