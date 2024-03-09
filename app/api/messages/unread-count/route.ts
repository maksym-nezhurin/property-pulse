import connectDB from "@/config/database";
import {getSessionUser} from "@/utils/getSessionUser";
import {Message} from "@/models/Message";
import {NextRequest} from "next/server";

export const dynamic = 'force-dynamic';

// GET /api/messages/unread-count
export const GET = async () => {
    try {
        await connectDB();

        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.user) {
            return new Response(JSON.stringify('User ID is required'), { status: 401 });
        }

        const { userId } = sessionUser;

        const unReadMessageCount = await Message.countDocuments({ recipient: userId, read: false })

        return new Response(JSON.stringify({ count: unReadMessageCount }), { status: 200 })
    } catch (error) {
        console.log(error);
    }
}

// POST /api/messages
export const POST = async (request: NextRequest) => {
    try {
        await connectDB();

        const { email, phone, name, message, property, recipient } = await request.json();
        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.user) {
            return new Response(JSON.stringify('You must be logged in'), { status: 401 });
        }

        // @ts-ignore
        const { user }: { user: { id: string }} = sessionUser;

        if(user.id === recipient) {
            return new Response(JSON.stringify({ message: 'Can not send a message to yourself '}), { status: 400 })
        }
        const messageData = {
            sender: user.id,
            recipient,
            property,
            name,
            email,
            phone,
            body: message
        }

        const newMessage = new Message(messageData);

        await newMessage.save();

        return new Response(JSON.stringify({ message: 'Message Sent'}), { status: 200 })
    } catch (error) {
        console.log(error);

        return new Response('Something went wrong', { status: 500 })
    }
}