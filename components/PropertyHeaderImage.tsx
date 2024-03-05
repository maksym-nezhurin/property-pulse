import Image from "next/image";

export const PropertyHeaderImage = (props: { image: string }) => {
    const { image } = props;

    return (
        <section>
            <div className="container-xl m-auto">
                <div className="grid grid-cols-1">
                    <Image src={`/images/properties/${image}`}
                           alt={''}
                           className='object-cover h-[400px] w-full'
                           height={0}
                           width={0}
                           sizes='100vw'
                           priority={true}/>
                </div>
            </div>
        </section>
    )
}