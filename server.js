const express = require('express');
const mongoose = require('mongoose');
const uuid = require('uuid');
const smartPlanning = require('./smartPlanning');
const Appointment = require('./models/Appointment.js');
const keys = require('./config/key');

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

// Get all appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get a single appointment by id
app.get('/api/appointments/:id', async (req, res) => {
    const id = req.params.id
    try {
        const appointment = await Appointment.findOne({ id: id });
        res.status(200).json(appointment);
    } catch (error) {
        console.log("error")
        res.status(404).json({ message: error.message })
    }
});

// Appointment creation
app.post('/api/appointments', async (req, res) => {
    const newAppointment = new Appointment({
        id: uuid.v4(),
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
    });
    try {
        await newAppointment.save();
        console.log("Successfully created appointments");
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

// Smart planning
app.post('/api/smartplanning', async (req, res) => {
    const appointment = {
        ...req.body,
        deadline: new Date(req.body.deadline)
    };
    const appointments = await Appointment.find().lean();
    suggestions = smartPlanning(appointment, appointments);
    if (suggestions) {
        try {
            await suggestions.forEach(suggestion => {
                const newAppointment = new Appointment(suggestion);
                newAppointment.save();
            });
            console.log("Successfully created appointments with Smart Planning");
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    } else {
        res.json({ message: "no solution available" });
    }
});

// Edit appointment by id
app.put('/api/appointments/:id', async (req, res) => {
    console.log(req.body);
    const paramId = req.params.id;
    const { id, title, startDate, endDate, description } = req.body;
    const updatedPost = { id, title, startDate, endDate, description };
    try {
        await Appointment.findOneAndUpdate({ id: paramId }, updatedPost);
        console.log("Updated successfully")
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    const paramId = req.params.id
    try {
        await Appointment.findOneAndRemove({ id: paramId })
        console.log(`Deleted appointment with ID ${paramId} successfully`);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

