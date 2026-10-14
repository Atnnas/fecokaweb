import { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String },
    poster: { type: String },
    invitationPdf: { type: String },
    registrationUrl: { type: String },
    externalUrl: { type: String },
    type: { type: String, enum: ['Tournament', 'Seminar', 'Meeting'], default: 'Tournament' },
    scope: { type: String, enum: ['Nacional', 'Internacional'], default: 'Nacional' },
});

// Compound indexes for event filtering and chronological ordering
EventSchema.index({ startDate: 1, type: 1 });
EventSchema.index({ scope: 1, startDate: 1 });

if (models.Event) {
    delete models.Event;
}
const Event = models.Event || model('Event', EventSchema);

export default Event;
