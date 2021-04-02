const express = require('express');
const uuid = require('uuid');
const Appointment = require('../models/Appointment');
const smartPlanning = require('../smartPlanning');

const router = express.Router();

// Get all appointments
router.get('/:googleId', async (req, res) => {
    console.log("fetching appointments...");
    const googleId = req.params.googleId;
    try {
        const appointments = await Appointment.find({ googleId: googleId });
        res.status(200).json(appointments);
        console.log("fetched appointments successfully");
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
});

// Get a single appointment by id
router.get('/:googleId/:appointmentId', async (req, res) => {
    const appointmentId = req.params.appointmentId
    let startingTimestamp = Date.now();
    console.log(`fetching appointment with appointmentId: ${id}...`);
    try {
        const appointment = await Appointment.findOne({ appointmentId: appointmentId });
        res.status(200).json(appointment);
        console.log(`fetched appointment with appointmentId:${appointmentId} successfully in ${Date.now() - startingTimestamp}ms`);
    } catch (error) {
        console.log("error");
        res.status(404).json({ message: error.message });
    }
});

// Appointment creation
router.post('/', async (req, res) => {
    console.log("inserting appointment...")
    if (req.body.type === "simple") {
        const appointment = {
            appointmentId: uuid.v4(),
            ...req.body.appointment
        };
        const newAppointment = new Appointment(appointment);
        try {
            await newAppointment.save();
            res.status(200).send("inserted appointment successfully");
            console.log(`created appointment "${appointment.title}" successfully`)
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    } else if (req.body.type === "smart") {
        const appointment = {
            deadline: new Date(req.body.appointment.deadline),
            ...req.body.appointment,
        };
        const appointments = await Appointment.find().lean();
        const suggestions = smartPlanning(appointment, appointments);
        if (suggestions) {
            try {
                await suggestions.forEach(suggestion => {
                    const newAppointment = new Appointment(suggestion);
                    newAppointment.save();
                });
                res.status(200).send("inserted appointment successfully");
                console.log(`created appointment "${appointment.title}" with Smart Planning successfully`);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        } else {
            console.log("no solution available")
            res.json({ message: "no solution available" })
        }
    } else {
        console.log("incorrect type of appointment request (simple/smart)")
    }
});

// Edit appointment by id
router.put('/:googleId/:appointmentId', async (req, res) => {
    const googleId = req.params.googleId;
    const appointmentId = req.params.appointmentId;
    let startingTimestamp = Date.now();
    console.log(`editing appointment with appointmentId: ${paramId}...`);
    const updatedAppointment = { ...req.body };
    try {
        await Appointment.findOneAndUpdate({
            googleId: googleId,
            appointmentId: appointmentId
        }, updatedAppointment);
        res.status(200).send("updated appointment successfully");
        console.log(`updated appointment with appointmentId: ${paramId} successfully in ${Date.now() - startingTimestamp}ms`);
    } catch (error) {
        console.log("error", error.message);
        res.json({ message: error.message });
    }
});


// Delete appointment id
router.delete('/:googleId/:appointmentId', async (req, res) => {
    const googleId = req.params.googleId;
    const appointmentId = req.params.appointmentId;
    try {
        await Appointment.findOneAndRemove({
            googleId: googleId,
            appointmentId: appointmentId
        });
        res.status(200).send("deleted appointment succesfully");
        console.log(`deleted appointment successfully`);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

module.exports = router;