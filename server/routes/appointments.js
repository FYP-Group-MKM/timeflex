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
        res.json({ message: error.message });
    }
});

// Get a single appointment by id
router.get('/:googleId/:appointmentId', async (req, res) => {
    const appointmentId = req.params.appointmentId
    let startingTimestamp = Date.now();
    console.log(`fetching appointment with appointmentId: ${appointmentId}...`);
    try {
        const appointment = await Appointment.findOne({ appointmentId: appointmentId });
        res.status(200).json(appointment);
        console.log(`fetched appointment with appointmentId:${appointmentId} successfully in ${Date.now() - startingTimestamp}ms`);
    } catch (error) {
        console.log("error");
        res.json({ message: error.message });
    }
});

// Appointment creation
router.post('/', async (req, res) => {
    console.log("inserting appointment...");

    const type = req.body.type;
    const appointment = { ...req.body.appointment };

    if (type !== "simple" && type !== "smart") {
        console.log("appointment type must be either \"simple\" or \"smart\"")
        res.json({ message: "appointment type must be either \"simple\" or \"smart\"" });
    }

    if (type === "simple") {
        const newAppointment = new Appointment({
            ...appointment,
            appointmentId: uuid.v4(),
        });
        try {
            await newAppointment.save();
            res.status(200).json({ message: `created appointment "${appointment.title}" successfully` });
            console.log(`created appointment "${appointment.title}" successfully`)
        } catch (error) {
            res.json({ message: error.message });
            console.log(error);
        }
    }

    if (type === "smart") {
        appointment.deadline = new Date(appointment.deadline);
        const appointments = await Appointment.find({ googleId: appointment.googleId }).lean();
        console.log(typeof (appointment.deadline))
        const suggestions = smartPlanning(appointment, appointments);
        if (suggestions) {
            try {
                await suggestions.forEach(suggestion => {
                    const newAppointment = new Appointment(suggestion);
                    newAppointment.save();
                });
                res.status(200).json({ message: `created appointment "${appointment.title}" with Smart Planning successfully` });
                console.log(`created appointment "${appointment.title}" with Smart Planning successfully`);
            } catch (error) {
                console.log(error);
                res.json({ message: error.message });
            }
        } else {
            console.log("no solution available");
            res.json({ message: "NO_SOLUTION_AVAILABLE" });
        }
    }
    res.status(404);
});

// Edit appointment by id
router.put('/:googleId/:appointmentId', async (req, res) => {
    let startingTimestamp = Date.now();
    const googleId = req.params.googleId;
    const appointmentId = req.params.appointmentId;
    console.log(`editing appointment with appointmentId: ${appointmentId}...`);
    const updatedAppointment = { ...req.body };
    try {
        await Appointment.findOneAndUpdate({
            googleId: googleId,
            appointmentId: appointmentId
        }, updatedAppointment);
        res.status(200).send("updated appointment successfully");
        console.log(`updated appointment with appointmentId: ${appointmentId} successfully in ${Date.now() - startingTimestamp}ms`);
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
        res.json({ message: error.message });
    }
});

module.exports = router;