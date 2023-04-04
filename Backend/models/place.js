const { Schema, model, default: mongoose } = require("mongoose");
const placeSchema = new Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
    title: { type: String },
    address: { type: String },
    photo: { type: String },
    description: { type: String },
    perks: { type: String },
    extraInfo: { type: String },
    checkIn: { type: Number },
    checkOut: { type: Number },
    maxGuest: { type: Number },
    prices: { type: Number },
  },
  { timestamps: true }
);

module.exports = model("Place", placeSchema);
