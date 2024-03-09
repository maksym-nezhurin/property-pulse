import {IProperty} from "@/interfaces/IProperty";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
interface IPropertyResponse {
    properties: IProperty[]
    total: number
}
// fetch all properties
async function fetchProperties({ page = 1, pageSize = 3}): Promise<IPropertyResponse> {
    try {
        if(!apiDomain) {
            return {
                properties: [],
                total: 0
            }
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/properties?page=${page}&pagesize=${pageSize}`,{ cache:"no-store" });

        if (!res.ok) {
            throw new Error('Failed to fetch data!')
        }

        const data = await res.json()

        return {
            properties: data.properties,
            total: data.total
        };
    } catch (error) {
        console.log(error);
        return {
            properties: [],
            total: 0
        }
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