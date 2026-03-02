import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    image?: string;
    role: 'user' | 'edit' | 'admin';
    status: 'pending' | 'active' | 'inactive';
    birthDate?: Date;
    lastLoginAt: Date;
    createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'edit', 'admin'],
        default: 'user', // Everyone gets basic user permissions by default
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending', // New users start as pending and need approval
    },
    birthDate: {
        type: Date,
    },
    lastLoginAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
