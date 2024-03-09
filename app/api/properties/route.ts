import connectDB from "@/config/database";
import Property from "@/models/Property";
import {getSessionUser} from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import {NextRequest} from "next/server";

// GET /api/properties
export const GET = async (request: NextRequest) => {
    try {
        await connectDB();

        // @ts-ignore
        const page: number = request.nextUrl.searchParams.get('page') || 1;
        // @ts-ignore
        const pageSize: number = request.nextUrl.searchParams.get('pagesize') || 3;

        const skip = (page - 1) * pageSize;
        const totalProperties = await Property.countDocuments({});

        const properties = await Property.find({}).skip(skip).limit(pageSize);
        const result = {
            total: totalProperties,
            properties
        }

        return new Response(JSON.stringify(result), {status: 200})
    } catch (error) {
        console.log(error);
        return new Response('Something Went Wrong', {status: 500})
    }
}

export const POST = async (request: NextRequest) => {
    try {
        await connectDB();

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.userId) {
            return new Response('User ID is required', { status: 401 });
        }

        const { userId } = sessionUser;
        const formData = await request.formData();
        const amenities = formData.getAll('amenities');
        const images = formData.getAll('images') as File[];
        const filteredImages = images.filter((image) => image.name !== '');

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
            images: [],
            owner: userId
        }

        // Upload image(s) to Cloudinary
        const uploadedImages = [];
        for (const image of filteredImages) {
            const imageBuffer = await image.arrayBuffer();
            const imageArray = Array.from(new Uint8Array(imageBuffer));
            const imageData = Buffer.from(imageArray);

            // Convert the image dat to base64
            const imageBase64 = imageData.toString('base64');
            const result = await cloudinary.uploader.upload(
                `data:image/png;base64,${imageBase64}`, {
                    folder: 'propertypulse'
                }
            )

            uploadedImages.push(result.secure_url);
        }

        // @ts-ignore
        propertyData.images = uploadedImages;

        const newProperty = new Property(propertyData);
        await newProperty.save();

        return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`)
    } catch (error) {
        console.log(error);
        return new Response('Failed to add property', {status: 500})
    }
}
