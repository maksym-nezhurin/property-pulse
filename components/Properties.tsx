'use client'

import {useState, useEffect} from "react";
import {IProperty} from "@/interfaces/IProperty";
import {PropertyCard} from "@/components/PropertyCard";
import {fetchProperties} from "@/utils/requests";
import Spinner from "@/components/Spinner";
import {Pagination} from "@/components/Pagination";

export const Properties = () => {
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(2);
    const [pageSize, setPageSize] = useState(3);
    const [totalItems, setTotalItems] = useState(0);

    const handlePageChange = (page: number) => {
        setPage(page);
    }

    useEffect(() => {
        try {
            fetchProperties({ page, pageSize }).then((data) => {
                const { properties, total} = data;
                console.log(data)
                // @ts-ignore
                properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setProperties(properties);
                setTotalItems(total)
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [page, pageSize]);

    return loading ? (<Spinner loading={loading} />) : (
        <section className="px-4 py-6">
            <div className="container-xl lg:container m-auto px-4 py-6">
                {properties.length === 0 ? (
                    <p>No props found</p>) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <PropertyCard key={property._id} {...property} />
                        ))}
                    </div>
                )}
                <Pagination page={page} pageSize={pageSize} totalItems={totalItems} onPageChange={handlePageChange} />
            </div>
        </section>
    )
}