const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        unique: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
        trim: true,
        maxlength: [50, 'Address cannot be more than 50 characters']
    },
    telephone: {
        type: String,
        maxlength: [20, 'Telephone number cannot be more than 20 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price cannot be less than 0']
    },
    // a hotel can contain multiple available addons, from the addons collection
    // the addons are stored as an array of ObjectIds
    /*
    availableAddons: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Addon'
        }
    ],
    */
});

HotelSchema.pre('remove', async function(next) {
    console.log(`Bookings being removed from hotel ${this._id}`);
    await this.model('Booking').deleteMany({ hotelID: this._id });
    next();
});

module.exports = mongoose.model('Hotel', HotelSchema);