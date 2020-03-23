require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const path = require('path');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB , 
                {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true },
                (err, res) => {

    if (err) throw err;

    console.log('base de datos online');

});


app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto: ",process.env.PORT);
})

