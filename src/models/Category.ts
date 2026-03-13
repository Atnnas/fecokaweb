import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Kata', 'Kumite'], required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Mixed'], required: true },
    ageGroup: { type: String, required: true },
    minAge: { type: Number },
    maxAge: { type: Number },
    weightLimit: { type: String }, // e.g., "-60kg", "+84kg"
    description: { type: String },
}, { timestamps: true });

// Prevent mongoose error: "Cannot overwrite `Category` model once compiled."
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;
