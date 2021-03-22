const express = require('express');
const uuid = require('uuid');
const PostMessage = require('../models/postMessages');
const smartPlanning = require('../smartPlanning');

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const postMessages = await PostMessage.find()
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
        const appointment = await PostMessage.findOne({ id: id })
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
        const newPostMessage = new PostMessage(appointment);
        try {
            await newPostMessage.save();
            const postMessages = await PostMessage.find();
            res.status(200).json(postMessages);
            console.log(`created appointment "${appointment.title}" successfully`)
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    } else if (req.body.type === "smart") {
        const appointment = {
            ...req.body.appointment,
        };
        appointment.deadline = new Date(appointment.deadline);
        const appointments = await PostMessage.find().lean();
        suggestions = smartPlanning(appointment, appointments);
        if (suggestions) {
            try {
                await suggestions.forEach(suggestion => {
                    const newPostMessage = new PostMessage(suggestion);
                    newPostMessage.save();
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
    const paramId = req.params.id
    const { id, title, startDate, endDate, description } = req.body;
    const updatedPost = { id, title, startDate, endDate, description };
    try {
        await PostMessage.findOneAndUpdate({ id: paramId }, updatedPost);
        console.log("Updated successfully")
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});


// Delete appointment id
router.delete('/:id', async (req, res) => {
    const paramId = req.params.id
    try {
        await PostMessage.findOneAndRemove({ id: paramId });
        res.status(200).json({ message: "deleted appointment successully" });
        console.log(`deleted appointment successfully`);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

module.exports = router;