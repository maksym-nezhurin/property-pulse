import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon
} from 'react-share';
import {IProperty} from "@/interfaces/IProperty";

interface ISharedProps {
    property: IProperty
}
export const ShareButtons = ({property}: ISharedProps) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`

    return (
        <>
            <h3 className={'text-xl font-bold text-center pt-2'}>Share this property</h3>
            
            <div className="flex gap-3 justify-center pb-5">
                <FacebookShareButton
                    url={shareUrl}
                    quote={property.name}
                    hashtag={`${property?.type?.replace(/\s/g, '')}ForRent`}
                ><FacebookIcon size={40} round={true} /></FacebookShareButton>

                <TwitterShareButton
                    url={shareUrl}
                    quote={property.name}
                    hashtag={`${property?.type?.replace(/\s/g, '')}ForRent`}
                ><TwitterIcon size={40} round={true} /></TwitterShareButton>

                <WhatsappShareButton
                    url={shareUrl}
                    quote={property.name}
                    separator={':: '}
                ><WhatsappIcon size={40} round={true} /></WhatsappShareButton>
                <EmailShareButton
                    url={shareUrl}
                    subject={property.name}
                    body={`check out this property listed: ${shareUrl}`}
                ><EmailIcon size={40} round={true} /></EmailShareButton>
            </div>
        </>
    )
}