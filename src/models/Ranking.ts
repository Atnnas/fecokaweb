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

const Ranking = models.Ranking || model('Ranking', RankingSchema);

export default Ranking;
