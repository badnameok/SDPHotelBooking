const DiscountCode = require('../models/discountCode');
const User = require('../models/User');
const Booking = require('../models/booking');
const Util = require('../util');

// @desc    Get all discount codes
// @route   GET /api/v1/discountCodes
// @access  Private
exports.getDiscountCodes = async (req, res, next) => {
    try {
        const discountCodes = req.user.role === "admin" ? await DiscountCode.find() : await DiscountCode.find({userID: req.user.id});
        res.status(200).json({ success: true, data: discountCodes });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Get single discount code
// @route   GET /api/v1/discountCodes/id/:id
// @access  Private
exports.getDiscountCode = async (req, res, next) => {
    try {
        const discountCode = await DiscountCode.findById(req.params.id);
        if (!discountCode) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: discountCode });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Get single discount code
// @route   GET /api/v1/discountCodes/:code
// @access  Private
exports.getDiscountCodeByCode = async (req, res, next) => {
    try {
        const discountCode = await DiscountCode.findOne({code: req.params.code});
        if (!discountCode) {
            return res.status(400).json({ success: false });
        }
        if(req.user.role !== "admin" && discountCode.userID !== req.user.id){
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: discountCode });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Generate a discount code
// @route   POST /api/v1/discountCodes/:userID
// @access  Private
exports.generateDiscountCode = async (req, res, next) => {
    try {
        var newDiscountCode = req.body;
        newDiscountCode.userID = req.params.userID;
        const user = await User.findById(req.params.userID);
        if (!user) {
            return res.status(400).json({ success: false });
        }
        // generate a random code, 8 characters long
        newDiscountCode.discountCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        console.log(newDiscountCode);
        const discountCode = await DiscountCode.create(newDiscountCode);
        if(user.discountCodes === undefined)
            user.discountCodes = [];
        user.discountCodes.push(discountCode._id);
        res.status(201).json({ success: true, data: discountCode });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Delete a discount code
// @route   DELETE /api/v1/discountCodes/:id
// @access  Private
exports.deleteDiscountCode = async (req, res, next) => {
    try {
        const discountCode = await DiscountCode.findById(req.params.id);
        if (!discountCode) {
            return res.status(400).json({ success: false });
        }
        await discountCode.remove();
        res.status(200).json({ success: true, data: {} });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

// @desc    Update a discount code
// @route   PUT /api/v1/discountCodes/:id
// @access  Private
exports.updateDiscountCode = async (req, res, next) => {
    try {
        const discountCode = await DiscountCode.findById(req.params.id);
        if (!discountCode) {
            return res.status(400).json({ success: false });
        }
        discountCode.set(req.body);
        const booking = Booking.findOne({discountCode: discountCode._id});
        if(booking){
            booking.discountCode = undefined;
            booking.finalPrice = await Util.recalculateFinalPrice(booking);
            booking.save();
        }
        await discountCode.save();
        res.status(200).json({ success: true, data: discountCode });
    }
    catch (err) {
        res.status(400).json({ success: false , error: "Server Error"});
    }
}

module.exports = exports;