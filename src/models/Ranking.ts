import { Schema, model, models } from 'mongoose';

const HistoryItemSchema = new Schema({
    tournament: { type: String, required: true },
    category: { type: String, required: true },
    modality: { type: String, enum: ['Kata', 'Kumite'], required: true },
    position: { type: Number, required: true },
    points: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
}, { _id: false });

const RankingSchema = new Schema({
    athleteName: { type: String, required: true },
    category: { type: String, required: true },
    modality: { type: String, enum: ['Kata', 'Kumite'], required: true },
    points: { type: Number, default: 0 },
    position: { type: Number },
    academy: { type: String },
    tournament: { type: String },
    division: { type: String },
    gender: { type: String },
    history: { type: [HistoryItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
});

// Compound indexes for optimal search and import performance
RankingSchema.index({ athleteName: 1, category: 1 });
RankingSchema.index({ category: 1, position: 1 });
RankingSchema.index({ position: 1 });
RankingSchema.index({ tournament: 1, category: 1 });

const Ranking = models.Ranking || model('Ranking', RankingSchema);

export default Ranking;
