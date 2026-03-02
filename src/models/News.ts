import mongoose, { Schema, model, models } from 'mongoose';

const NewsSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    publishedAt: { type: Date, default: Date.now },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    author: { type: String },
}, { timestamps: true });

const News = models.News || model('News', NewsSchema);

export default News;
