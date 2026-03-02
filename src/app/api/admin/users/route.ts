import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/auth';

// GET all users (Admin only)
export async function GET() {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }
}

// PATCH update user role or status (Admin only)
export async function PATCH(req: Request) {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    try {
        const { userId, name, email, birthDate, role, status } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (birthDate) updateData.birthDate = birthDate;
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: 'Error updating user' }, { status: 400 });
    }
}

// DELETE user (Admin only)
export async function DELETE(req: Request) {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await dbConnect();
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
}
