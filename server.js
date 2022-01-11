const express = require('express');
const app = express()
const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');
//Initialize
mongoose.plugin(slug);
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', ()=> console.log('connected to database'))

app.use(express.json())
app.use('', express.static('upload/imges'))
app.use('/csv', express.static('upload/csv'))

//import Files
const subRouter = require('./routes/subRoutes')
const imagesRouter = require('./routes/imagesRoutes')

//Use This api
app.use('/users', subRouter)
app.use('/images', imagesRouter)
//server listen
app.listen(3000, ()=> console.log("Server is started!!") )