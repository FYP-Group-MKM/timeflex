const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    id: String,
    title: String,
    allDay: Boolean,
    startDate: String,
    endDate: String,
    rRule: String,
    exDate: String,
    description: String,
});

const Appointment = mongoose.model('appointment', appointmentSchema);

module.exports = Appointment;