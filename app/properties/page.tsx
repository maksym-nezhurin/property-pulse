import {PropertyCard} from "@/components/PropertyCard";
import {fetchProperties} from "@/utils/requests";
import {IProperty} from "@/interfaces/IProperty";

export const metadata = {
  title: 'Main page',
  description: 'Main description'
}

export default async function PropertiesPage() {
    // console.log('before call!');
    const properties = await fetchProperties() || [];
    // console.log('properties', properties);
    // console.log('properties2', properties2)

    // @ts-ignore
    properties.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>No props found</p>) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property: IProperty) => (
              <PropertyCard key={property._id} {...property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
