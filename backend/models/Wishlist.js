import mongoose from "mongoose";

const { Schema } = mongoose;

const WishlistSchema = new Schema({
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Buyer ID is required"],
      index: true,
    },
    
    // Array of produce categories/names the buyer is looking for
    lookingFor: [{
      type: String,
      required: [true, "Produce interest is required"],
      trim: true,
      lowercase: true
    }],

    // Notification preferences
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },

    // Wishlist status
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
      required: true
    },

    // Price range preferences (optional filters)
    priceRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 }
    },
    
    // Last notification sent (to avoid spam)
    lastNotified: {
      type: Date,
      default: null
    },

    // Track which listings have already been notified about
    notifiedListings: [{
      type: Schema.Types.ObjectId,
      ref: "listing"
    }],
  },
  { timestamps: true }
);

// Index for the buyer's wishlist
WishlistSchema.index({ buyer: 1, status: 1 });

// Index for efficient notification queries by produce
WishlistSchema.index({ 
  lookingFor: 1, 
  status: 1, 
  "notifications.email": 1 
});

// Static method to find buyers interested in newly posted produce
WishlistSchema.statics.findInterestedBuyers = async function (produceName, produceCategory, listingId) {
  return this.find({
    status: "active",
    $or: [
      { lookingFor: { $in: [produceName.toLowerCase()] } },
      { lookingFor: { $in: [produceCategory.toLowerCase()] } }
    ],
    notifiedListings: { $ne: listingId }, // Don't notify if already notified about this listing
    $or: [
      { "notifications.email": true },
      { "notifications.push": true },
      { "notifications.sms": true }
    ]
  }).populate('buyer', 'name email phoneNumber');
};

// Static method to check if buyer has specific produce in their wishlist
WishlistSchema.statics.isInWishlist = async function (buyerId, produceName) {
  return this.exists({
    buyer: buyerId,
    lookingFor: { $in: [produceName.toLowerCase()] },
    status: "active"
  });
};

// Method to add produce to wishlist
WishlistSchema.methods.addToWishlist = function (produceName) {
  const lowercaseName = produceName.toLowerCase();
  if (!this.lookingFor.includes(lowercaseName)) {
    this.lookingFor.push(lowercaseName);
  }
  return this.save();
};

// Method to remove produce from wishlist
WishlistSchema.methods.removeFromWishlist = function (produceName) {
  const lowercaseName = produceName.toLowerCase();
  this.lookingFor = this.lookingFor.filter(p => p !== lowercaseName);
  if (this.lookingFor.length === 0) {
    this.status = "cancelled";
  }
  return this.save();
};

// Method to mark listing as notified
WishlistSchema.methods.markAsNotified = function (listingId) {
  if (!this.notifiedListings.includes(listingId)) {
    this.notifiedListings.push(listingId);
    this.lastNotified = new Date();
  }
  return this.save();
};

// Static method to get buyer's active wishlist
WishlistSchema.statics.getBuyerWishlist = async function (buyerId) {
  return this.findOne({
    buyer: buyerId,
    status: "active"
  });
};

const WishList = mongoose.model("wishlist", WishlistSchema);

export default WishList;