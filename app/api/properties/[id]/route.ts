import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

interface IParams {
    params: {
        id: string
    }
}

// GET /api/properties/:id
export const GET = async (request: Request, { params }: IParams) => {
    try {
        await connectDB();
        const propertyId = params.id;
        const property = await Property.findById(propertyId);

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

export const DELETE = async (request: Request, { params }: IParams) => {
    try {
        const propertyId = params.id;
        const { userId } = (await getSessionUser() || {});

        if (!userId) {
            return new Response('User ID is required', { status: 401 })
        }

        await connectDB();
        const property = await Property.findById(propertyId);

        if (!property) {
            return new Response('Property Not Found', {
                status: 404
            })
        }

        if (property.owner.toString() !== userId) {
            return new Response('Unauthoriszed', { status: 401 })
        }

        await property.deleteOne()

        return new Response('Property deleted', { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response('Something Went Wrong', { status: 500 })
    }
}

export const PUT = async (request: Request, { params }: IParams) => {
    try {
        await connectDB();

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.userId) {
            return new Response('User ID is required', { status: 401 });
        }

        const { userId } = sessionUser;
        const formData = await request.formData();
        const amenities = formData.getAll('amenities');

        const existingProperty  = await Property.findById(params.id);

        if (!existingProperty) {
            return new Response('Property does not exist', { status: 404 })
        }

        // Verify Ownership

        if (existingProperty.owner.toString() !== userId) {
            return new Response('Unauthorized', { status: 401 })
        }

        // Create property data object for database
        const propertyData = {
            type: formData.get('type'),
            name: formData.get('name'),
            description: formData.get('description'),
            location: {
                street: formData.get('location.street'),
                city: formData.get('location.city'),
                state: formData.get('location.state'),
                zipcode: formData.get('location.zipcode'),
            },
            beds: formData.get('beds'),
            baths: formData.get('baths'),
            square_feet: formData.get('square_feet'),
            rates: {
                weekly: formData.get('rates.weekly'),
                monthly: formData.get('rates.monthly'),
                nightly: formData.get('rates.nightly'),
            },
            seller_info: {
                name: formData.get('seller_info.name'),
                email: formData.get('seller_info.email'),
                phone: formData.get('seller_info.phone'),
            },
            amenities,
            owner: userId
        }

        // Update Property in DB

        const updatedProperty = await Property.findByIdAndUpdate(params.id, propertyData);

        return new Response(JSON.stringify(updatedProperty), {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return new Response('Failed to add property', {status: 500})
    }
}