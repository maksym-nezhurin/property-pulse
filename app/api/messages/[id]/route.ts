import connectDB from "@/config/database";
import {getSessionUser} from "@/utils/getSessionUser";
import {Message} from "@/models/Message";
import {NextRequest} from "next/server";
import {IParams} from "@/interfaces/api";
export const dynamic = 'force-dynamic';

// PUT /api/messages/:id
export const PUT = async (request: NextRequest, { params }: { params: IParams}) => {
    try {
        await connectDB();

        const { id } = params;

        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.user) {
            return new Response(JSON.stringify('User ID is required'), { status: 401 });
        }

        const { userId } = sessionUser;
        const message = await Message.findById((id));

        if (!message) {
            return new Response('Message ot Found', { status: 404 })
        }

        if (message.recipient.toString() !== userId) {
            return new Response('Unauthorized', { status: 401 })
        }

        message.read = !message.read;

        await message.save();

        return new Response(JSON.stringify(message), { status: 200})
    } catch (error) {
        console.log(error)
    }
}

// DELETE /api/messages/:id
export const DELETE = async (request: NextRequest, { params }: { params: IParams}) => {
    try {
        await connectDB();

        const { id } = params;

        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.user) {
            return new Response(JSON.stringify('User ID is required'), { status: 401 });
        }

        const { userId } = sessionUser;
        const message = await Message.findById((id));

        if (!message) {
            return new Response('Message ot Found', { status: 404 })
        }

        if (message.recipient.toString() !== userId) {
            return new Response('Unauthorized', { status: 401 })
        }

        await message.deleteOne();

        return new Response(JSON.stringify('Message deleted'), { status: 200})
    } catch (error) {
        console.log(error)
    }
}