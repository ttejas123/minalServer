const express = require('express')
const router  = express.Router()
const multer = require('multer')
require('dotenv').config()
const fs = require('fs')
const fileUpload = require('./fileUpload')
//const csvUpload = require('./csvUpload')
const path = require('path')
//const csv=require('csvtojson')
const Images = require('../models/imagesSchema')


//get all info of specific doc by ID Middalware
async function getImgById(req, res, next) {
	let subscriber
	try {
		let getFullData
		subscriber = await Images.findById(req.params.id)
							.populate('subRef') // only works if we pushed refs to person.eventsAttended
							.exec(function(err, person) {
							    
							    res.subscriber = person
							    next()
							})
		// if (subscriber == null) {
		// 	return res.status(404).json({message: "Can't find subscriber"})
		// }
	} catch (e) {
		return res.status(500).json({message: e.message})
	}
}


//Get ALL
router.get('/', async (req, res) => {
	try {

		const allImg = await Images.find().limit(100)
		let i = 0
		let arr = []
		let urls = []
		while(i < allImg.length) {
					const dd = "" + allImg[i]._id + ""
					urls.push({[`${i}${allImg[i].name}`]  : process.env.BASEURL + allImg[i].url})
					arr.push(dd)
					i++
			}
		let dataSend = JSON.stringify({deleteManyById: arr}, null, 2) 
		fs.writeFile('deleteId.json', dataSend, finished)
		function finished(err) {
			console.log('all set.')
		}
		res.status(201).json({data: allImg, urls})
	} catch (e) {
		res.status(404).json({message: e.message})
	}
})

//Get One 2
router.patch('/:id', getImgById, async (req, res) => {
	res.json(res.subscriber)
})

//Create One fileUpload.array('photoimg[]')
router.post('/', fileUpload.array('photoimg[]'), async (req, res)=> {
	try{
		// const newEntry = new Images({})
		// if (req.file) {
		// 	newEntry.name = req.file.originalname
		// 	newEntry.url = req.file.filename
		// 	newEntry.size = req.file.size
		// 	newEntry.ext = req.file.mimetype
		// }
		let values = []
		if (req.files) {
			let path = []
		 	req.files.map((val, index) => {
		 		path.push({
			 		 name: val.originalname,
					 url: val.filename,
					 size: val.size,
					 ext: val.mimetype
				}) 
			})
			//path = path.substring(0, path.lastIndexOf(","))
			values = path
		}
		console.log(values)
		const newSubscriber = await Images.insertMany(values)
		res.status(201).json(newSubscriber)
	} catch (e) {
		res.status(404).json({message: e.message})
	}

})

//delete Many
router.post('/deleteManyById', async (req, res) => {
	const id = req.body.deleteManyById
	try {
		const manyDelete = await Images.deleteMany({
														    "_id": {
														        "$in": id
														        }
														 }) 
		res.status(201).json(manyDelete)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

module.exports= router