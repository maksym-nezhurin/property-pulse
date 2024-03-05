import connectDB from "@/config/database";
import Property from "@/models/Property";

interface IParams {
    params: {
        id: string
    }
}

// GET /api/properties/:id
export const GET = async (request: Request, { params }: IParams) => {
    try {
        await connectDB();

        const property = await Property.findById(params.id);

        if (!property) {
            return new Response('Property Not Found', {
                status: 404
            })
        }
        return new Response(JSON.stringify(property), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response('Something Went Wrong', { status: 500 })
    }
}