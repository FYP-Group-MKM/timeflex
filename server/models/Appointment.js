const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    user: String,
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