const express = require('express');
const mongoose = require('mongoose');
const appointments = require('./routes/appointments');
const CONNECT_URL = 'mongodb+srv://kolpl:kolpl1997@memoryproject.vss6e.mongodb.net/<dbname>?retryWrites=true&w=majority'
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(CONNECT_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

app.use('/appointments', appointments);

// // Get all appointments
// app.get('/api/appointments', async (req, res) => {
//     try {
//         const postMessages = await PostMessage.find()
//         res.status(200).json(postMessages)
//         console.log("fetched appointments to client-side successfully")
//     } catch (error) {
//         console.log(error);
//         res.status(404).json({ message: error.message })
//     }
// });

// // Get a single appointment by id
// app.get('/api/appointments/:id', async (req, res) => {
//     const id = req.params.id
//     try {
//         const appointment = await PostMessage.findOne({ id: id })
//         res.status(200).json(appointment)
//     } catch (error) {
//         console.log("error")
//         res.status(404).json({ message: error.message })
//     }
// });

// // Appointment creation
// app.post('/api/appointments', async (req, res) => {
//     if (req.body.type === "simple") {
//         const appointment = {
//             id: uuid.v4(),
//             ...req.body.appointment
//         };
//         const newPostMessage = new PostMessage(appointment);
//         try {
//             await newPostMessage.save();
//             const postMessages = await PostMessage.find();
//             res.status(200).json(postMessages);
//             console.log(`created appointment "${appointment.title}" successfully`)
//         } catch (error) {
//             console.log(error);
//             res.status(400).json({ message: error.message });
//         }
//     } else if (req.body.type === "smart") {
//         const appointment = {
//             ...req.body.appointment,
//         };
//         appointment.deadline = new Date(appointment.deadline);
//         const appointments = await PostMessage.find().lean();
//         suggestions = smartPlanning(appointment, appointments);
//         if (suggestions) {
//             try {
//                 await suggestions.forEach(suggestion => {
//                     const newPostMessage = new PostMessage(suggestion);
//                     newPostMessage.save();
//                 });
//                 res.status(200);
//                 console.log("Successfully created appointments with Smart Planning");
//             } catch (error) {
//                 res.status(400).json({ message: error.message });
//             }
//         } else {
//             res.json({ message: "no solution available" })
//         }
//     } else {
//         console.log("incorrect type of appointment request (simple/smart)")
//     }
// });

// // Edit appointment by id
// app.put('/api/appointments/:id', async (req, res) => {
//     const paramId = req.params.id
//     const { id, title, startDate, endDate, description } = req.body;
//     const updatedPost = { id, title, startDate, endDate, description };
//     try {
//         await PostMessage.findOneAndUpdate({ id: paramId }, updatedPost);
//         console.log("Updated successfully")
//     } catch (error) {
//         res.status(409).json({ message: error.message });
//     }
// });


// // Delete appointment id
// app.delete('/api/appointments/:id', async (req, res) => {
//     const paramId = req.params.id
//     try {
//         await PostMessage.findOneAndRemove({ id: paramId });
//         console.log(`deleted appointment successfully`);
//     } catch (error) {
//         res.status(409).json({ message: error.message });
//     }
// });

