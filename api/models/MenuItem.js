const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    imageType: { type: String, enum: ['url', 'upload'], required: true }, // Add imageType property
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
