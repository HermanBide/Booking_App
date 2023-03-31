const { Schema, model } = require ("mongoose")
const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true, validate: {validator: (newEmail) => /@/.test(newEmail), message: ()=> "This email is not valid" }, },
        password: { type: String, required: true },
    },
    {timestamps: true}
);
module.exports = model("User", userSchema);