import { Schema, model, models } from 'mongoose';

const AcademySchema = new Schema({
    name: { type: String, required: true },
    instructor: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String },
    logo: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Academy = models.Academy || model('Academy', AcademySchema);

export default Academy;
