interface IRates {
    weekly?: number;
    monthly?: number;
    nightly?: number
}

interface ILocation {
    street: string;
    city: string;
    state: string;
    zipcode: string;
}

interface ISeller {
    name: string;
    email: string;
    phone: string;
}

export interface IProperty {
    _id: string;
    owner: string;
    name: string;
    type: string;
    description: string;
    location: ILocation;
    beds: number;
    baths: number;
    square_feet: number;
    amenities: string[];
    rates: IRates;
    seller_info: ISeller;
    images: string[];
    is_featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPropertyState {
    type: string;
    name: string;
    description: string;
    amenities: string[];
    location: {
        street: string
        city: string
        state: string
        zipcode: string,
    },
    images: string[],
    beds: number,
    baths: number,
    square_feet: number,
    rates: {
        weekly: string,
        monthly: string,
        nightly: string
    },
    seller_info: {
        name: string,
        email: string,
        phone: string
    }
}
