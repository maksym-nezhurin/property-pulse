import connectDB from "@/config/database";
import Property from "@/models/Property";
import {NextRequest} from "next/server";

// GET /api/properties/user/:userId
export const GET = async (request: NextRequest, { params }: { params: { userId: string}}) => {
    try {
        await connectDB();
        const { userId } = params;

        if (!userId) {
            return new Response('User ID is required', { status: 400 });
        }

        const properties = await Property.find({ owner: userId });

        return new Response(JSON.stringify(properties), {status: 200})
    } catch (error) {
        console.log(error);
        return new Response('Something Went Wrong', {status: 500})
    }
}