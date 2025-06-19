const Med = require('../models/Medication')
//need to make a http-status-codes
const { StatusCodes } = require('http-status-codes')
//need to create errors folder with these middlewares
const { BadRequestError, NotFoundError } = require('../errors')

//need to connect to Postman and Mongoose
const getAllMed = async(req, res) => {
    // res.send('Hello, this is a route for medication')
    const med = await Med.find({createdBy: req.user.userId}).sort('createdAt')
    res.render('medications/index', { med }); // This view must exist!
    res.status(StatusCodes.OK).json({ med, count: med.length })
}

const getMed = async (req, res) => {
    const {
        user: { userId },
        //params is ...
        params: { id: medId }
    } = req

    const med = await Med.findOne({
        _id: medId,
        createdBy: userId,
    })
    if (!med) {
        throw new NotFoundError(`No medication with id ${medId}`)
    }
    res.status(StatusCodes.OK).json({ med })
}

const createMed = async (req, res ) => {
    // req.body.createdBy = req.user.userId
    // const med = await Med.create(req.body)
    // res.status(StatusCodes.CREATED).json({ med })
    try {
        const med = await Med.create({
          ...req.body,
          createdBy: req.user._id,
        });
        res.redirect('/medications');
      } catch (err) {
        req.flash('error', 'Failed to add medication.');
        res.redirect('/medications/new');
      }
}

const updateMed = async (req, res) => {
    const {
        body: { name, dosage },
        user: { userId },
        params: { id: medId }
    } = req

    if (name === '' || dosage === ''){
        throw new BadRequestError('Name or Dosage fields cannot be empty')
    }
    const med = await Med.findByIdAndUpdate(
        { _id: medId, createdBy: userId },
        req.body,
        { new: true, runValidators: true})
    if (!med) {
        throw new NotFoundError(`No medication with id ${medId}`)
    }
    res.status(StatusCodes.OK).json({ med })
}

const deleteMed = async (req, res) => {
    const {
        user: { userId },
        params: { id: medId }
    } = req

    const med = await Med.findByIdAndDelete({
        _id:medId, 
        createdBy:userId,
    })

    if (!med){
        throw new NotFoundError(`No medication with id ${medId}`)
    }
    res.status(StatusCodes.OK).json({ msg: "The medication entry was deleted."});
}

module.exports = {
    getAllMed,
    getMed, 
    createMed, 
    updateMed,
    deleteMed,
}