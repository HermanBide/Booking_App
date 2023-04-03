const { Schema, model } = require ("mongoose")
const placeSchema = new Schema(
    {
        owner: { type: String, required: true },
        title: { type: String, unique: true, required: true, validate: {validator: (newEmail) => /@/.test(newEmail), message: ()=> "This email is not valid" }, },
        address: { type: String, required: true },
        photo: { type: String, required: true},
        description: { type: String, required: true},
        perks: { type: String, required: true},
        extraInfo:{ type: String, required: true},
        checkIn: { type: String, required: true},
        checkOut: { type: String, required: true},
        maxGuest: { type: String, required: true},
        prices: { type: String, required: true},
    },
    {timestamps: true}
);

module.exports = model("Place", placeSchema);