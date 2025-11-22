import mongoose  from "mongoose";

const listingSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Farmer ID is required']
    },
    produceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'produce',
        required: [true, 'Produce ID is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: [true, 'Available quantity is required'],
        min: [0, 'Available quantity cannot be negative']
    },
    harvestDate: {
        type: Date,
        required: [true, 'Harvest date is required']
    },
    status: {
        type: String,
        enum: ['available', 'out of stock', 'expired'],
        default: 'available',
        required: true
    },
    images : [{
        type: String,
        required: [true, 'Image URL is required']
    }]

},{timestamps: true});

const Listing = mongoose.model('listing', listingSchema);

export default Listing;