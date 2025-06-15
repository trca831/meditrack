const express = require('express')
const router = express.Router()

const {
    getAllMed, 
    getMed,
    createMed,
    updateMed,
    deleteMed,
} = require('../controllers/jobs')

router.route('/').post(createMed).get(getAllMed)
router.route('/:id').get(getMed).delete(deleteMed).patch(updateMed)

module.exports = router