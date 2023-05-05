const express = require('express');
const router = express.Router();

const { getHotels, getHotel, createHotel, updateHotel, deleteHotel,test } = require('../controllers/hotels');
const {protect} = require('../middleware/auth');

router.route('/').get(getHotels).post(createHotel);
router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel);


module.exports = router;