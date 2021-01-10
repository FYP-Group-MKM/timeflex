const express = require('express');
const uuid = require('uuid');
const appointments = require('./appointments');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const idFilter = req => appointment => appointment.id === parseInt(req.params.id);

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

app.put('/api/appointments/:id', (req, res) => {
    const found = appointments.some(idFilter(req));

    if (found) {
        appointments.forEach((appointment, i) => {
            if (idFilter(req)(appointment)) {

                const editAppointment = { ...appointment, ...req.body };
                appointment[i] = editAppointment;
                res.json({ msg: 'Member updated', updMember });
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