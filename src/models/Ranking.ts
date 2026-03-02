import { Schema, model, models } from 'mongoose';

const RankingSchema = new Schema({
    athleteName: { type: String, required: true },
    category: { type: String, required: true },
    modality: { type: String, enum: ['Kata', 'Kumite'], required: true },
    points: { type: Number, default: 0 },
    position: { type: Number },
    academy: { type: String },
    updatedAt: { type: Date, default: Date.now },
});

const Ranking = models.Ranking || model('Ranking', RankingSchema);

export default Ranking;
