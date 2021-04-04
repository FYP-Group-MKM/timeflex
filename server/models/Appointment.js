const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    googleId: String,
    appointmentId: String,
    title: String,
    allDay: Boolean,
    startDate: Date,
    endDate: Date,
    rRule: String,
    exDate: Date,
    description: String,
});

const Appointment = mongoose.model('appointment', appointmentSchema);

module.exports = Appointment;