import {IProperty} from "@/interfaces/IProperty";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// fetch all properties
async function fetchProperties(): Promise<IProperty[] | []> {
    try {
        if(!apiDomain) {
            return []
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/properties`,{cache:"no-store"});

        if (!res.ok) {
            throw new Error('Failed to fetch data!')
        }

        return await res.json();
    } catch (error) {
        console.log(error);
        return []
    }
}

// fetch property by ID
async function fetchProperty(id: string):Promise<IProperty | null> {
    try {
        if(!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/properties/${id}`);

        if(!res.ok) {
            throw new Error('Failed to fetch data!');
        }
        return await res.json();
    } catch (error) {
        console.log(error);
        return null
    }
}

export { fetchProperties, fetchProperty }