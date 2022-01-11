const express = require('express')
const router  = express.Router()
const multer = require('multer')
const fs = require('fs')
const fileUpload = require('./fileUpload')
const csvUpload = require('./csvUpload')
const path = require('path')
const csv=require('csvtojson')
//https://stackoverflow.com/questions/28474558/updating-2-mongoose-schemas-in-an-api-call

const Subscriber = require('../models/subInfo')

async function dataToinsert(req, res, jsonObj) {
	let subscriber
	try {
		subscriber = await Subscriber.insertMany(jsonObj)
		if (subscriber == null) {
			return res.status(404).json({message: "Can't find subscriber"})
		}
	} catch (e) {
		return res.status(500).json({message: e.message})
	}
	return subscriber
	next()
}

//get all info of specific doc by ID Middalware
async function getSubscriber(req, res, next) {
	let subscriber
	try {
		subscriber = await Subscriber.findById(req.params.id)
		if (subscriber == null) {
			return res.status(404).json({message: "Can't find subscriber"})
		}

	} catch (e) {
		return res.status(500).json({message: e.message})
	}
	res.subscriber = subscriber
	next()
}

//Get ALL 1
router.get('/', async (req, res) => {
	try {
		// Subscriber.find()
		// 				.populate('subImg') // only works if we pushed refs to submg
		// 				.exec(function(err, person) { 
		// 					//console.log(person)
		// 					res.status(201).json({
		// 						//data: arr 
		// 						data: person
		// 					})
		// 					//res.subscriber = person
		// 					//next()
		// 				})
		let i = 0
		let arr = []
		const subs = await Subscriber.find().limit(100)

		//const subs = await Subscriber.find().limit(1).skip(1)
		while(i < subs.length) {
			const dd = "" + subs[i]._id + ""
			arr.push(dd)
			i++
		}
		let dataSend = JSON.stringify({deleteManyById: arr}, null, 2) 
		fs.writeFile('deleteId.json', dataSend, finished)
		function finished(err) {
			console.log('all set.')
		}
		res.status(201).json({
			//data: arr 
			data: subs
		})
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

//Get One 2
router.get('/:id', getSubscriber, async (req, res) => {
	res.json(res.subscriber)
})

//Create One 3
router.post('/', async (req, res) => {
	console.log(req.body)
	try {
		const subscribers = new Subscriber({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			username: req.body.username
		})
		const newSubscriber = await subscribers.save()
		res.status(201).json(newSubscriber)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

//Create Many 4
router.post('/multi', async (req, res) => {
	try {

		const newSubscriber = await Subscriber.insertMany(req.body.multi)
		res.status(201).json(newSubscriber)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

//Update One 5
router.post('/update', async (req, res) => {
	const updateId = req.body._id;
	const name  = req.body.name
	const email = req.body.email
	const phone = req.body.phone
	const username = req.body.username
	try{
	   await Subscriber.updateOne({_id:`${updateId}`}, {$set: {
			name,
			email,
			phone,
			username
	   }});
	   res.send("Data is Updated");
	}catch(err){
		console.log(err);
	}
})

//Delete One 6
router.delete('/:id', getSubscriber, async (req, res) => {
	try {
		const DeletedSubscriber = await res.subscriber.remove()
		res.json({
			message: "Deleted Subscriber",
			data: DeletedSubscriber
		})
	} catch (e) {
		res.status(404).json({message: "Id Not Found"})
	}
})

//delete Many By Parameters 7
router.post('/deleteManyById', async (req, res) => {
	const id = req.body.deleteManyById
	console.log(id)
	try {
		const newSubscriber = await Subscriber.deleteMany({
														    "_id": {
														        "$in": id
														        }
														 }) 
		res.status(201).json(newSubscriber)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})


//find by channel and name (Search) 8 fully completed
router.post('/find', async (req, res) => {
	try {
			const subscriber = await Subscriber.find({$text: { $search: req.body.find }})	
			if (subscriber.length == 0) {
				const subscriber =  Subscriber.find({$or: [{ name: { $regex: req.body.find, $options: "i" } }, { subscriberChannel: { $regex: req.body.find, $options: "i" } }]}).then((val, index) => {
					if (val.length === 0) {
						return res.status(404).json({message: "Can't find user"})
					} else {
						return res.status(201).json({data: val})
					}
				})
			} else {
				  res.status(201).json({data: subscriber})
			}
	} catch (e) {
		 res.status(500).json({message: e.message})
	}
})
//upload.single('csvFile'), 
router.post('/csvFile', csvUpload.single('csvFile'), async (req, res) => {
	const pathChange = __dirname
	const PathOfCsv = pathChange.toString().replace('routes','') + 'upload\\csv\\' + req.file.filename
	console.log(PathOfCsv)
	csv()
	.fromFile(PathOfCsv)
	.then( async (jsonObj)=>{
	   console.log(jsonObj)
	   const Check = await dataToinsert(req, res, jsonObj) 
	   if(Check) {
	   	fs.unlink(PathOfCsv, (err) => {
	   		  if (err) {
	   		  	console.log(err);
			 } else {
			    console.log(`\nDeleted file: ${req.file.filename}`);
			  }
	   	})
	   	res.status(201).json({inseredData: Check})
	   }else {
	   	res.status(500).json({message: "UnScessful"})
	   }
	})
})


module.exports= router