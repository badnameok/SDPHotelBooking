const express = require('express');
const router = express.Router();

const { getBookings, getBooking, createBooking, updateBooking, deleteBooking } = require('../controllers/bookings');
const {protect} = require('../middleware/auth');

router.route('/').get(getBookings).post(protect,createBooking);
router.route('/:id').get(protect,getBooking).put(protect,updateBooking).delete(protect,deleteBooking);


module.exports = router;