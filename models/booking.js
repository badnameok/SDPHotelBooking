const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    /*
    Contains:
        - userID : the user who made the booking
        - startDate : the date the booking starts
        - endDate : the date the booking ends
        - hotelID : the hotel the user booked
        - discountCodeID (optional) : the discount code the user used
        - finalPrice : the final price of the booking
        - addons : a list of addons the user added to the booking
    */
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please add a user ID'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date'],
    },
    hotelID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hotel',
        required: [true, 'Please add a hotel ID'],
    },
    discountCodeID: {
        type: mongoose.Schema.ObjectId,
        ref: 'DiscountCode',
    },
    finalPrice: {
        type: Number,
        required: [true, 'Please add a final price'],
        min: [0, 'Price cannot be less than 0'],
    },
    addons: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Addon',
        }
    ],


});

module.exports = mongoose.model('Booking', BookingSchema);