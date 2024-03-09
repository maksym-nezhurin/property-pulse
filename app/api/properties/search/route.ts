import connectDB from "@/config/database";
import Property from "@/models/Property";
import {NextRequest} from "next/server";

interface IQuery {
    $or: {
        [key: string]: any;
    }[];
    type?: RegExp
}

export const GET = async (request: NextRequest) => {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location') || '';
        const propertyType = searchParams.get('propertyType');

        const locationPattern = new RegExp(location, 'i');
        let query: IQuery = {
            $or: [
                {name: locationPattern },
                {description: locationPattern },
                {'location.street': locationPattern },
                {'location.city': locationPattern },
                {'location.state': locationPattern },
                {'location.zipcode': locationPattern },
            ]
        }

        // only check the property if its not all
        if (propertyType && propertyType !== 'all') {
            query.type = new RegExp(propertyType, 'i');
        }

        const properties = await Property.find(query);

        return new Response(JSON.stringify(properties), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify('' +
            'something went wrong'), { status: 500 })
    }
}