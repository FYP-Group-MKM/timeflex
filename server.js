const express = require('express');
const uuid = require('uuid');
const appointments = require('./appointments');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
    const newAppointment = {
        id: uuid.v4(),
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
    };
    appointments.push(newAppointment);
});

app.delete('/api/appointments/:id', (req, res) => {
    const delAppointment = appointments.find(appointment => {
        return appointment.id === req.params.id;
    });
    appointments.splice(appointments.indexOf(delAppointment), 1);
    res.json(appointments);
});

const PORT = 5000;

app.listen(PORT, () => `Server running on port ${PORT}`);