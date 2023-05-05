
const Hotel = require('./models/hotels');
const DiscountCode = require('./models/discountCode');
const Booking = require('./models/booking');

// export the recalculate the final price of the booking function
async function recalculateFinalPrice(booking) {
    console.log(booking.hotelID);
    // get the hotel price
    const hotel = await Hotel.findById(booking.hotelID);
    console.log("HOTEL:",hotel);
    const hotelPrice = hotel ? hotel.price : 0;
    // get the discount code
    const discountCode = await DiscountCode.findById(booking.discountCodeID);
    const discountRate = discountCode ? discountCode.discountRate : 0;
    // amount of days between the start and end date (which are date strings)
    const days = (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24);
    // round the days up
    const roundedDays = Math.ceil(days);
    // calculate the final price
    const finalPrice = (hotelPrice * roundedDays) * (1 - (discountRate / 100));
    return finalPrice;
}

async function codeIsUsed(discountCode) {
    console.log("DISCOUNT CODE:",discountCode);
    const discountID = await getDiscountCodeID(discountCode);
    if(!discountID) return false;
    const booking = await Booking.findOne({ discountCodeID: discountID });
    console.log("BOOKING:",booking);
    return booking ? true : false;
}


async function getDiscountCodeID(discountCode) {
    const discount = await DiscountCode.findOne({ code: discountCode });
    return discount ? discount._id : undefined;
}
    

module.exports = {
    recalculateFinalPrice,
    codeIsUsed,
    getDiscountCodeID,
}