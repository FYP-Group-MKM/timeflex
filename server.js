const express = require('express');
const uuid = require('uuid');
const appointments = require('./appointments');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const idFilter = req => appointment => appointment.id === req.params.id;

// Get all appointments
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// Get a single appointment by id
app.get('/api/appointments/:id', (req, res) => {
    const found = appointments.some(idFilter(req));

    if (found) {
        res.json(appointments.find(idFilter(req)));
    } else {
        res.status(400).json({ msg: `No appointment with the id of ${req.params.id}` });
    }
});

app.post('/api/appointments', (req, res) => {
    const newAppointment = {
        id: uuid.v4(),
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
    };
    delete newAppointment.type;
    appointments.push(newAppointment);
});

app.post('/api/smartplanning', (req, res) => {
    appointment = {
        ...req.body,
        deadline: new Date(req.body.deadline)
    };
    delete appointment.type;
    res.json(appointment);
    console.log(appointment);
});

// Edit appointment by id
app.put('/api/appointments/:id', (req, res) => {
    console.log(req.body)
    const found = appointments.some(idFilter(req));

    if (found) {
        appointments.forEach((appointment, i) => {
            if (idFilter(req)(appointment)) {
                const editAppointment = { ...req.body };
                appointments[i] = editAppointment;
                res.json({ msg: 'Member updated', editAppointment });
            }
        });
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
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