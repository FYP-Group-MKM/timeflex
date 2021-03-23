const express = require('express');
const uuid = require('uuid');
const Appointment = require('../models/Appointment');
const smartPlanning = require('../smartPlanning');

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const postMessages = await Appointment.find()
        res.status(200).json(postMessages)
        console.log("fetched appointments to client-side successfully")
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })
    }
});

// Get a single appointment by id
router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const appointment = await Appointment.findOne({ id: id })
        res.status(200).json(appointment)
    } catch (error) {
        console.log("error")
        res.status(404).json({ message: error.message })
    }
});

// Appointment creation
router.post('/', async (req, res) => {
    if (req.body.type === "simple") {
        const appointment = {
            id: uuid.v4(),
            ...req.body.appointment
        };
        const newAppointment = new Appointment(appointment);
        try {
            await newAppointment.save();
            const appointments = await Appointment.find().lean();
            res.status(200).json(appointments);
            console.log(`created appointment "${appointment.title}" successfully`)
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    } else if (req.body.type === "smart") {
        const appointment = {
            ...req.body.appointment,
            deadline: new Date(req.body.appointment.deadline)
        };
        const appointments = await Appointment.find().lean();
        const suggestions = smartPlanning(appointment, appointments);
        if (suggestions) {
            try {
                await suggestions.forEach(suggestion => {
                    const newAppointment = new Appointment(suggestion);
                    newAppointment.save();
                });
                res.status(200);
                console.log("Successfully created appointments with Smart Planning");
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        } else {
            res.json({ message: "no solution available" })
        }
    } else {
        console.log("incorrect type of appointment request (simple/smart)")
    }
});

// Edit appointment by id
router.put('/:id', async (req, res) => {
    const paramId = req.params.id;
    const { id, title, startDate, endDate, description } = req.body;
    const updatedAppointment = { id, title, startDate, endDate, description };
    try {
        await Appointment.findOneAndUpdate({ id: paramId }, updatedAppointment);
        console.log("Updated successfully");
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});


// Delete appointment id
router.delete('/:id', async (req, res) => {
    const paramId = req.params.id
    try {
        await Appointment.findOneAndRemove({ id: paramId });
        res.status(200).json({ message: "deleted appointment successully" });
        console.log(`deleted appointment successfully`);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

module.exports = router;