import { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String },
    registrationUrl: { type: String },
    type: { type: String, enum: ['Tournament', 'Seminar', 'Meeting'], default: 'Tournament' },
});

const Event = models.Event || model('Event', EventSchema);

export default Event;
