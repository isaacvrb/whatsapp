import { Timestamp } from "firebase/firestore"

export type ChatItemType = {
    messages: MessageType[],
    users: string[]
}

export type MessageType = {
    author: string,
    body: string,
    type: string,
    date: Timestamp
}