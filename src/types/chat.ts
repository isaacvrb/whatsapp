import { Timestamp } from "firebase/firestore";

export type ChatType = {
    chatId: string,
    image: string,
    lastMessage: string,
    lastMessageDate: Timestamp,
    title: string,
    with: string
}

export type ChatPayloadType = {
    chatId: string,
    image: string,
    lastMessage: string,
    lastMessageDate: Date,
    title: string,
    with: string
}