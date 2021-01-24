const PostMessage = require('./models/postMessages.js')
const express = require('express');
const uuid = require('uuid');
const smartPlanning = require('./smartPlanning');
const appointments = require('./appointments');
const mongoose = require('mongoose')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const CONNECT_URL = 'mongodb+srv://kolpl:kolpl1997@memoryproject.vss6e.mongodb.net/<dbname>?retryWrites=true&w=majority'
const idFilter = req => appointment => appointment.id === req.params.id;
const PORT = 5000;

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

//Post is for the creation of the appointment
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
    let appointment = {
        ...req.body,
        deadline: new Date(req.body.deadline)
    };
    // delete appointment.type;
    suggestions = smartPlanning(appointment, appointments);
    appointments.push(...suggestions);
    const newPostMessage = new PostMessage(suggestions)
    try {
        await newPostMessage.save();
        console.log("The success of creating by smart planning /api/smartplanning")
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
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
        // await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
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

