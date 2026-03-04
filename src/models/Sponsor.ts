import mongoose, { Schema, model, models } from 'mongoose';

const SponsorSchema = new Schema({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    websiteUrl: { type: String },
    tier: { type: String, enum: ['gold', 'silver', 'bronze'], default: 'silver' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    contractStart: { type: Date },
    contractEnd: { type: Date },
}, { timestamps: true });

const Sponsor = models.Sponsor || model('Sponsor', SponsorSchema);

export default Sponsor;
