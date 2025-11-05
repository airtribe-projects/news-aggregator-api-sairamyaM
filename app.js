require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const usersRoute = require('./routes/usersRoute');
const newsRoute = require('./routes/newsRoute');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', usersRoute);
app.use('/', newsRoute);

app.get('/', (req, res) => res.send('Server running'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ MongoDB connection failed:', err));

app.listen(port, () => {
   if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;