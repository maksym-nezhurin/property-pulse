import Link from "next/link";
import {useState} from "react";
import {toast} from "react-toastify";
import {useGlobalContext} from "@/context/global";
import {IMessage} from "@/interfaces/message";

export const Message = (props: IMessage) => {

    const {
        _id,
        sender,
        property,
        email,
        phone,
        body,
        createdAt,
        read
    } = props;

    const [isRead, setIsRead] = useState<Boolean>(read);
    const [isDeleted, setIsDeleted] = useState(false);
    const {setUnreadCount} = useGlobalContext();

    const handleReadClick = async () => {
        try {
            const res = await fetch(`/api/messages/${_id}`, {
                method: 'PUT'
            });

            if (res.status === 200) {
                const {read} = await res.json();
                setIsRead(read);
                setUnreadCount((state) => (
                    read ? state - 1 : state + 1
                ));
                if (read) {
                    toast.success('Marked as read!')
                } else {
                    toast.success('Marked as a new!')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteClick = async () => {
        try {
            const res = await fetch(`/api/messages/${_id}`, {
                method: 'DELETE'
            });

            if (res.status === 200) {
                toast.success('Message is deleted!')
                setIsDeleted(true);
                setUnreadCount((state: number) => (state - 1)); // Fix it, if you remove it does not sync with DB
            } else {
                toast.error('Message was not deleted!')
            }
        } catch (error) {
            console.log(error);
            toast.error('Message was not deleted!')
        }
    }

    if (isDeleted) {
        return null;
    }

    return (
        <div
            className="relative bg-white p-4 rounded-md shadow-md border border-gray-200"
        >
            {!isRead && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-blue-50 px-2 py-1 rounded-md">New</div>
            )}
            <h2 className="text-xl mb-4">
                <span className="font-bold">Property Inquiry:</span>
                {property.name}
            </h2>
            <p className="text-gray-700">
                {body}
            </p>

            <ul className="mt-4">
                <li><strong>Name:</strong> {sender.username}</li>

                <li>
                    <strong>Reply Email:</strong>
                    <a href={`mailto:${email}`} className="text-blue-500"
                    >{email}</a
                    >
                </li>
                <li>
                    <strong>Reply Phone:</strong>
                    <Link href="tel:123-456-7890" className="text-blue-500"
                    >{phone}</Link
                    >
                </li>
                <li><strong>Received:</strong>{new Date(createdAt).toLocaleString()}</li>
            </ul>
            <button onClick={handleReadClick}
                    className={`mt-4 mr-3 ${isRead ? 'bg-gray-300' : 'bg-blue-500 text-white'} py-1 px-3 rounded-md`}
            >
                {isRead ? 'Mark As New' : 'Mark As Read'}
            </button>
            <button onClick={handleDeleteClick} className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md">
                Delete
            </button>
        </div>
    )
};