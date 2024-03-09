import React, {useState} from "react";
import {FaPaperPlane} from "react-icons/fa";
import {toast} from "react-toastify";
import {useSession} from "next-auth/react";
import {IProperty} from "@/interfaces/IProperty";

export const PropertyContactForm = ({ property }: { property: IProperty}) => {
    const {data: session} = useSession();
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            name,
            email,
            message,
            phone,
            recipient: property.owner,
            property: property._id
        }
        try {
            const res = await fetch(`/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (res.status === 200) {
                toast.success('Message sent successfully!');
                setWasSubmitted(true)
            } else if (res.status === 400 || res.status === 401) {
                console.log('data', res.body)
                toast.error(res.statusText)
            } else {
                toast.error('Error sending form');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error sending form');
        } finally {
            setName('');
            setEmail('');
            setMessage('');
            setPhone('');
            setWasSubmitted(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6">Contact Property Manager</h3>

            {!session ? (<p>You must be login for send a message</p>) : (
                wasSubmitted ? (<p className='text-green-700 mb-4'>
                    Your message has been sent successfully
                </p>) : (
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label
                                className='block text-gray-700 text-sm font-bold mb-2'
                                htmlFor='name'
                            >
                                Name:
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='name'
                                type='text'
                                placeholder='Enter your name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="email"
                            >
                                Email:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mb-4'>
                            <label
                                className='block text-gray-700 text-sm font-bold mb-2'
                                htmlFor='phone'
                            >
                                Phone:
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='phone'
                                type='text'
                                placeholder='Enter your phone number'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}

                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="message"
                            >
                                Message:
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
                                id="message"
                                placeholder="Enter your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}

                            ></textarea>
                        </div>
                        <div>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center"
                                type="submit"
                            >
                                <FaPaperPlane className='mr-2'/> Send Message
                            </button>
                        </div>
                    </form>
                )
            )}
        </div>

    )
}