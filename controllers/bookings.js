const Booking = require('../models/booking');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({ success: true, data: bookings });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: booking });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc Get all bookings for a user
// @route GET /api/v1/bookings/user/:id
// @access Private
exports.getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userID: req.params.id });
        res.status(200).json({ success: true, data: bookings });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Create a booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    // the request body should contain:
    // startDate, endDate, hotelID, finalPrice
    try {
        const newBooking = req.body;
        console.log(req.user)
        newBooking.userID = req.user.id;
        const booking = await Booking.create(req.body);
        res.status(201).json({ success: true, data: booking });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Update a booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
    // the request body should contain:
    // startDate, endDate, hotelID, finalPrice
    try {
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(400).json({ success: false , error: "No booking found"});
        }
        if(booking.userID != req.user.id && req.user.role != "admin"){
            return res.status(400).json({ success: false , error: "Unauthorized"});
        }
        const ret = await Booking.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ success: true, data: ret });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Delete a booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(400).json({ success: false , error: "No booking found"});
        }
        if(booking.userID != req.user.id && req.user.role != "admin"){
            return res.status(400).json({ success: false , error: "Unauthorized"});
        }
        await booking.remove();
        console.log("Deleted booking");
        res.status(200).json({ success: true, data: {} });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}