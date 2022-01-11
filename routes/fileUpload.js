const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
	destination: './upload/imges',
	// name: (req, file, cb) => {
	// 	console.log()
	// 	const extention = path.extname(file.originalname)
	// 	const fileName = file.originalname.replace(extention, "")
	// 	return cb(null, `${fileName}`)
	// },
	filename: (req, file, cb)=> {
		//console.log(file)
		const extention = path.extname(file.originalname)
		const fileName = file.originalname.replace(extention, "")
		return cb(null, `${fileName}_${Date.now()}${extention}`)
	}
})

const upload = multer({
	storage: storage
})

module.exports = upload