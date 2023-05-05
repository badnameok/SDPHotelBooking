const mongoose = require('mongoose');
const Util = require('../util');

const DiscountCodeSchema = new mongoose.Schema({
    // contains:
    // discountRate : the discount rate of the code (100 = 100% discount)
    // discountCode : the code itself
    // bookingID (optional) : the booking ID that the code is associated with
    discountRate: {
        type: Number,
        required: [true, 'Please add a discount rate'],
        min: [0, 'Discount rate cannot be less than 0'],
        max: [100, 'Discount rate cannot be more than 100'],
    },
    discountCode: {
        type: String,
        required: [true, 'Please add a discount code'],
        trim: true,
        unique: true,
        maxlength: [50, 'Discount code cannot be more than 50 characters'],
    },
    bookingID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking',
    },
    
});

DiscountCodeSchema.pre('remove', async function(next) {
    console.log(`Discount code ${this._id} being removed`);
    const bookings = await this.model('Booking').find({ discountCodeID: this._id });
    bookings.forEach(async (booking) => {
        booking.discountCodeID = undefined;
        booking.finalPrice = Util.recalculateFinalPrice(booking);
        await booking.save();
    });
    next();
});

module.exports = mongoose.model('DiscountCode', DiscountCodeSchema);