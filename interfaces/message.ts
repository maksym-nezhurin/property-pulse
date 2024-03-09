export interface IMessage {
    _id: string | number;
    sender: {
        username: string
    },
    property: {
        name: string
    },
    email: string,
    phone: string,
    body: string,
    createdAt: string,
    read: boolean
}