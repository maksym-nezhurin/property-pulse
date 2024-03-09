'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { fetchProperty } from "@/utils/requests";
import {IPropertyState} from "@/components/PropertyAddForm";


type IPropertyStateWithoutImages = Omit<IPropertyState, 'images'>

export const PropertyEditForm = () => {
    const { id } = useParams();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [fields, setFields] = useState<IPropertyStateWithoutImages>({
        type: '',
        name: '',
        description: '',
        location: {
            street: '',
            city: '',
            state: '',
            zipcode: ''
        },
        beds: 0,
        baths: 0,
        square_feet: 0,
        amenities: [],
        rates: {
            weekly: '',
            monthly: '',
            nightly: ''
        },
        seller_info: {
            name: '',
            email: '',
            phone: ''
        }
    })

    const [loading, setLoading] = useState(true)
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if ( name.includes('.')) {
            const [outerKey, innerKey] = name.split('.');

            setFields((prevFields) => ({
                ...prevFields,
                [outerKey]: {
                    ...prevFields[outerKey],
                    [innerKey]: value
                }
            }))
        } else {
            setFields((prevFields) => ({
                ...prevFields,
                [name]: value
            }))
        }
    }
    const handleAmenitiesChange = (e: any) => {
        const { value, checked } = e.target;

        const updatedAmenities = [...fields.amenities];

        if (checked) {
            // add value to array
            updatedAmenities.push(value)
        } else {
            // Remove value from array
            const index = updatedAmenities.indexOf(value);

            if (index !== -1) {
                updatedAmenities.splice(index, 1);
            }
        }

        // Update state with updated array
        setFields((prevFields) => ({
            ...prevFields,
            amenities: updatedAmenities
        }))
    }

    useEffect(() => {
        setMounted(true);

        // Fetch property data from
        const fetchPropertyData = async () => {
            try {
                const propertyData = await fetchProperty(id as string);
                // Check rates for null, if so then make empty string

                if(propertyData && propertyData.rates) {
                    const defaultRates = { ...propertyData.rates };

                    for (const rate in defaultRates) {
                        if (defaultRates[rate] === null) {
                            defaultRates[rate] = '';
                        }
                    }
                }

                setFields(propertyData!);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }

        fetchPropertyData();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                body: formData
            })

            if (res.status === 200) {
                router.push(`/properties/${id}`)
            } else if (res.status === 401 || res.status === 403) {
                toast.error('Permission denied')
            } else {
                toast.error('Something went wrong')
            }
        } catch (error) {
            console.log('Error', error)
            toast.error('Something went wrong')
        }
    }

    return (
        mounted && !loading && (
            <form onSubmit={handleSubmit}>
                <h2 className="text-3xl text-center font-semibold mb-6">
                    Edit Property
                </h2>

                <div className="mb-4">
                    <label
                        htmlFor="type"
                        className="block text-gray-700 font-bold mb-2"
                    >Property Type</label
                    >
                    <select
                        id="type"
                        name="type"
                        onChange={handleChange}
                        value={fields.type}
                        className="border rounded w-full py-2 px-3"
                        required
                    >
                        <option value="Apartment">Apartment</option>
                        <option value="Condo">Condo</option>
                        <option value="House">House</option>
                        <option value="Cabin Or Cottage">Cabin or Cottage</option>
                        <option value="Room">Room</option>
                        <option value="Studio">Studio</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2"
                    >Listing Name</label
                    >
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        value={fields.name}
                        className="border rounded w-full py-2 px-3 mb-2"
                        placeholder="eg. Beautiful Apartment In Miami"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-gray-700 font-bold mb-2"
                    >Description</label
                    >
                    <textarea
                        id="description"
                        name="description"
                        onChange={handleChange}
                        value={fields.description}
                        className="border rounded w-full py-2 px-3"
                        rows={4}
                        placeholder="Add an optional description of your property"
                    ></textarea>
                </div>

                <div className="mb-4 bg-blue-50 p-4">
                    <label className="block text-gray-700 font-bold mb-2">Location</label>
                    <input
                        type="text"
                        id="street"
                        name="location.street"
                        onChange={handleChange}
                        value={fields.location.street}
                        className="border rounded w-full py-2 px-3 mb-2"
                        placeholder="Street"
                    />
                    <input
                        type="text"
                        id="city"
                        name="location.city"
                        onChange={handleChange}
                        value={fields.location.city}
                        className="border rounded w-full py-2 px-3 mb-2"
                        placeholder="City"
                        required
                    />
                    <input
                        type="text"
                        id="state"
                        name="location.state"
                        onChange={handleChange}
                        value={fields.location.state}
                        className="border rounded w-full py-2 px-3 mb-2"
                        placeholder="State"
                        required
                    />
                    <input
                        type="text"
                        id="zipcode"
                        onChange={handleChange}
                        value={fields.location.zipcode}
                        name="location.zipcode"
                        className="border rounded w-full py-2 px-3 mb-2"
                        placeholder="Zipcode"
                    />
                </div>

                <div className="mb-4 flex flex-wrap">
                    <div className="w-full sm:w-1/3 pr-2">
                        <label htmlFor="beds" className="block text-gray-700 font-bold mb-2"
                        >Beds</label
                        >
                        <input
                            type="number"
                            id="beds"
                            name="beds"
                            onChange={handleChange}
                            value={fields.beds}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="w-full sm:w-1/3 px-2">
                        <label htmlFor="baths" className="block text-gray-700 font-bold mb-2"
                        >Baths</label
                        >
                        <input
                            type="number"
                            id="baths"
                            name="baths"
                            onChange={handleChange}
                            value={fields.baths}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="w-full sm:w-1/3 pl-2">
                        <label
                            htmlFor="square_feet"
                            className="block text-gray-700 font-bold mb-2"
                        >Square Feet</label
                        >
                        <input
                            type="number"
                            id="square_feet"
                            name="square_feet"
                            onChange={handleChange}
                            value={fields.square_feet}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2"
                    >Amenities</label
                    >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_wifi"
                                name="amenities"
                                value="Wifi"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes('Wifi') }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_wifi">Wifi</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_kitchen"
                                name="amenities"
                                value="Full Kitchen"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes('Full Kitchen') }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_kitchen">Full kitchen</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_washer_dryer"
                                name="amenities"
                                value="Washer & Dryer"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes('Washer & Dryer') }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_washer_dryer">Washer & Dryer</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_free_parking"
                                name="amenities"
                                value="Free Parking"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes('Free Parking') }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_free_parking">Free Parking</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_pool"
                                name="amenities"
                                value="Swimming Pool"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes('Swimming Pool') }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_pool">Swimming Pool</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_hot_tub"
                                name="amenities"
                                value="Hot Tub"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes('Hot Tub') }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_hot_tub">Hot Tub</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_24_7_security"
                                name="amenities"
                                value="24/7 Security"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes('24/7 Security') }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_24_7_security">24/7 Security</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_wheelchair_accessible"
                                name="amenities"
                                value="Wheelchair Accessible"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes('Wheelchair Accessible') }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_wheelchair_accessible"
                            >Wheelchair Accessible</label
                            >
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_elevator_access"
                                name="amenities"
                                value="Elevator Access"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes("Elevator Access") }
                                className="mr-2"
                            />
                            <label htmlFor="amenity_elevator_access">Elevator Access</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_dishwasher"
                                name="amenities"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes("Dishwasher") }
                                value="Dishwasher"
                                className="mr-2"
                            />
                            <label htmlFor="amenity_dishwasher">Dishwasher</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_gym_fitness_center"
                                name="amenities"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes("Gym/Fitness Center") }
                                value="Gym/Fitness Center"
                                className="mr-2"
                            />
                            <label htmlFor="amenity_gym_fitness_center"
                            >Gym/Fitness Center</label
                            >
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_air_conditioning"
                                name="amenities"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes("Air Conditioning") }
                                value="Air Conditioning"
                                className="mr-2"
                            />
                            <label htmlFor="amenity_air_conditioning">Air Conditioning</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_balcony_patio"
                                name="amenities"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes("Balcony/Patio") }
                                value="Balcony/Patio"
                                className="mr-2"
                            />
                            <label htmlFor="amenity_balcony_patio">Balcony/Patio</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_smart_tv"
                                name="amenities"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes("Smart TV") }
                                value="Smart TV"
                                className="mr-2"
                            />
                            <label htmlFor="amenity_smart_tv">Smart TV</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="amenity_coffee_maker"
                                name="amenities"
                                onChange={handleAmenitiesChange}
                                checked={ fields.amenities.includes("Coffee Maker") }
                                value="Coffee Maker"
                                className="mr-2"
                            />
                            <label htmlFor="amenity_coffee_maker">Coffee Maker</label>
                        </div>
                    </div>
                </div>

                <div className="mb-4 bg-blue-50 p-4">
                    <label className="block text-gray-700 font-bold mb-2"
                    >Rates (Leave blank if not applicable)</label
                    >
                    <div
                        className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                        <div className="flex items-center">
                            <label htmlFor="weekly_rate" className="mr-2">Weekly</label>
                            <input
                                type="number"
                                id="weekly_rate"
                                name="rates.weekly"
                                onChange={handleChange}
                                value={fields.rates.weekly}
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="monthly_rate" className="mr-2">Monthly</label>
                            <input
                                type="number"
                                id="monthly_rate"
                                name="rates.monthly"
                                onChange={handleChange}
                                value={fields.rates.monthly}
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="nightly_rate" className="mr-2">Nightly</label>
                            <input
                                type="number"
                                id="nightly_rate"
                                name="rates.nightly"
                                onChange={handleChange}
                                value={fields.rates.nightly}
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="seller_name"
                        className="block text-gray-700 font-bold mb-2"
                    >Seller Name</label
                    >
                    <input
                        type="text"
                        id="seller_name"
                        name="seller_info.name"
                        value={fields.seller_info.name}
                        onChange={handleChange}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Name"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="seller_email"
                        className="block text-gray-700 font-bold mb-2"
                    >Seller Email</label
                    >
                    <input
                        type="email"
                        id="seller_email"
                        name="seller_info.email"
                        value={fields.seller_info.email}
                        onChange={handleChange}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Email address"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="seller_phone"
                        className="block text-gray-700 font-bold mb-2"
                    >Seller Phone</label
                    >
                    <input
                        type="tel"
                        id="seller_phone"
                        name="seller_info.phone"
                        value={fields.seller_info.phone}
                        onChange={handleChange}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Phone"
                    />
                </div>

                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Edit Property
                    </button>
                </div>
            </form>
        )
    )
}