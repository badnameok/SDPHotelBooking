const mongoose = require('mongoose');
const Booking = require('./booking');
const Hotel = require('./hotels');

const AddonSchema = new mongoose.Schema({
    // contains:
    // description : the description of the addon

    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },

});
  
AddonSchema.pre(['remove'], async function(next) {
    console.log(`Addon ${this._id} being removed`);
    const bookings = await Booking.find({ addons: this._id });
    bookings.forEach(async (booking) => {
        console.log(`Addon ${this._id} being removed from booking ${booking._id}`);
        booking.addons = booking.addons.filter((addon) => {
            return addon != this._id;
        });
    });
    console.log(`Addon ${this._id} removed from ${bookings.length} bookings`);
    const hotels = await Hotel.find({ availableAddons: this._id });
    hotels.forEach(async (hotel) => {
        hotel.availableAddons = hotel.availableAddons.filter((addon) => {
            return addon != this._id;
        });
        await hotel.save();
    });
    console.log(`Addon ${this._id} removed from ${bookings.length} bookings and ${hotels.length} hotels`);
    next();
});

module.exports = mongoose.model('Addon', AddonSchema);