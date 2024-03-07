'use client'

import { useState, useEffect } from "react";
import {PropertyCard} from "@/components/PropertyCard";

import {toast} from "react-toastify";
import Spinner from "@/components/Spinner";
// import { Spinner }
export default async function SavedPage()  {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedProperties = async () => {
            try {
                const res = await fetch('/api/bookmarks', { cache:"no-store" });

                if (res.status === 200) {
                    const data = await res.json();
                    setProperties(data)
                } else {
                    console.log(res.statusText);
                    toast.error('Failed to fetch saved properties')
                }
            } catch (error) {
                toast.error('Failed to fetch saved properties')
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchSavedProperties();
    }, []);
    console.log(properties)
    return loading ? <Spinner loading={loading} /> : <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
            <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
                Saved Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.length === 0 ? (<p>No saved properties</p>) : properties.map((property) => (
                    <PropertyCard key={property._id} {...property} />))}
            </div>
        </div>
    </section>
}