const express = require('express');
const PostMessage = require('./models/postMessages.js');
const uuid = require('uuid');
const smartPlanning = require('./smartPlanning');
const mongoose = require('mongoose');
const app = express();
const CONNECT_URL = 'mongodb+srv://kolpl:kolpl1997@memoryproject.vss6e.mongodb.net/<dbname>?retryWrites=true&w=majority'
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(CONNECT_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`)))
    .catch((error) => console.log(error.message))

mongoose.set('useFindAndModify', false)

// Get all appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const postMessages = await PostMessage.find()
        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
});

// Get a single appointment by id
app.get('/api/appointments/:id', async (req, res) => {
    const id = req.params.id
    try {
        const appointment = await PostMessage.findOne({ id: id })
        // const appointment = await PostMessage.findById(id)
        res.status(200).json(appointment)
        // console.log(appointment);
    } catch (error) {
        console.log("error")
        res.status(404).json({ message: error.message })
    }
});

// Appointment creation
app.post('/api/appointments', async (req, res) => {
    const newAppointment = {
        id: uuid.v4(),
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
    };
    const newPostMessage = new PostMessage(newAppointment)
    try {
        await newPostMessage.save();
        console.log("Sucess for post/api/appointments")
        res.status(201).json(newPostMessage);
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
    const appointments = await PostMessage.find();
    suggestions = smartPlanning(appointment, appointments);
    if (suggestions) {
        try {
            await suggestions.forEach(suggestion => {
                const newPostMessage = new PostMessage(suggestion)
                newPostMessage.save();
            });
            console.log("Successfully created appointments with Smart Planning");
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    } else {
        res.json({ message: "no solution available" })
    }
});

// Edit appointment by id
app.put('/api/appointments/:id', async (req, res) => {
    console.log(req.body)
    const paraid = req.params.id
    const { id, title, startDate, endDate, description } = req.body;
    const updatedPost = { id, title, startDate, endDate, description };
    try {
        await PostMessage.findOneAndUpdate({ id: paraid }, updatedPost);
        console.log("Updated successfully")
        res.status(201).json(updatedPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    const paraid = req.params.id
    console.log(`The id is ${paraid}`)
    try {
        await PostMessage.findOneAndRemove({ id: paraid })
        console.log("The item has removed")
        res.status(201).send("Delete Sucessfully")
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

