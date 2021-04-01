const express = require('express');
const mongoose = require('mongoose');
const appointments = require('./routes/appointments');
const keys = require('./config/keys');
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

app.use('/appointments', appointments);
