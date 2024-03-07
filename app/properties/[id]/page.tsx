'use client'
import Link from 'next/link';
import {useState, useEffect} from "react";
import {useParams} from "next/navigation";
import {fetchProperty} from "@/utils/requests";
import {PropertyHeaderImage} from "@/components/PropertyHeaderImage";
import {IProperty} from "@/interfaces/IProperty";
import {FaArrowLeft} from "react-icons/fa";
import {PropertyDetails} from "@/components/PropertyDetails";
import Spinner from "@/components/Spinner";
import {PropertyImages} from "@/components/PropertyImages";
import {BookmarkButton} from "@/components/BookmarkButton";
import {PropertyContactForm} from "@/components/PropertyContactForm";
import {ShareButtons} from "@/components/ShareButtons";

export default function PropertyPage() {
  const {id = ''} = useParams();
  const [property, setProperty] = useState<IProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;

      try {
        const property = await fetchProperty(id as string);
        setProperty(property);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching:', error);
      }
    }

    if (property === null) {
      fetchPropertyData();
    }
  }, [id, property]);

  if (!property && !loading) {
    return (
      <h1 className='text-center text-2xl font-bold mt-10'>
        Property not found
      </h1>
    )
  }

  return <>
    {loading && <Spinner loading={loading}/>}
    {
        property && !loading && (<>
          <PropertyHeaderImage image={property.images[0]}/>
          <section>
            <div className="container m-auto py-6 px-6">
              <Link href={'/properties'} className={'text-blue-500 hover:text-blue-600 flex items-center'}>
                <FaArrowLeft/> &nbsp;
                Back to Properties
              </Link>
            </div>
          </section>
          <section className="bg-blue-50">
            <div className="container m-auto py-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">

                <PropertyDetails property={property}/>

                <aside className="space-y-4">
                  <BookmarkButton property={property} />

                  <ShareButtons property={property} />

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-6">Contact Property Manager</h3>
                    <PropertyContactForm property={property} />
                  </div>
                </aside>
              </div>
            </div>
          </section>
          <PropertyImages images={property.images}/>
        </>)
    }
  </>;
}
