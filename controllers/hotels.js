const Hotel = require('../models/hotels');
const Booking = require('../models/booking');
const Util = require('../util');

// @desc    Get all hotels
// @route   GET /api/v1/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
    try{
        const hotels = await Hotel.find();
        return res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Get single hotel
// @route   GET /api/v1/hotels/:id
// @access  Public
exports.getHotel = async (req, res, next) => {
    try{
        const hotel = await Hotel.findById(req.params.id);
        if(!hotel){
            return res.status(404).json({
                success: false,
                error: 'No hotel found'
            });
        }
        return res.status(200).json({
            success: true,
            data: hotel
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Create a hotel
// @route   POST /api/v1/hotels
// @access  Private
exports.createHotel = async (req, res, next) => {
    try{
        console.log("Create");
        const hotel = await Hotel.create(req.body);
        return res.status(201).json({
            success: true,
            data: hotel
        });
    }
    catch(err){
        if(err.name === 'ValidationError'){
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        else{
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
}

// @desc    Update a hotel
// @route   PUT /api/v1/hotels/:id
// @access  Private
exports.updateHotel = async (req, res, next) => {
    try{
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!hotel) {
            return res.status(400).json({ success: false });
        }
        // for all bookings with this hotel, recalculate the final price
        const bookings = await Booking.find({hotel: req.params.id});
        for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i];
            booking.finalPrice = await Util.recalculateFinalPrice(booking);
            await booking.save();
        }
        res.status(200).json({
            success: true,
            data: hotel
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
    }
}

// @desc    Delete a hotel
// @route   DELETE /api/v1/hotels/:id
// @access  Private
exports.deleteHotel = async (req, res, next) => {
    try{
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(400).json({ success: false });
        }
        await hotel.remove();
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
    }
}

module.exports = exports;