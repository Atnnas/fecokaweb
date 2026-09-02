import { Schema, model, models } from 'mongoose';

const RankingBackupSchema = new Schema({
    description: { type: String, default: 'Respaldo automático previo a importación' },
    createdAt: { type: Date, default: Date.now },
    rankings: { type: [Schema.Types.Mixed], default: [] },
    itemsCount: { type: Number, default: 0 },
    importedTournament: { type: String },
});

const RankingBackup = models.RankingBackup || model('RankingBackup', RankingBackupSchema);

export default RankingBackup;
