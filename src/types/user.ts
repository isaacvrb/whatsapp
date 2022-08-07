import { ChatType, ChatPayloadType } from "./chat"

export type UserType = {
    id: string,
    name: string|null,
    avatar: string|null,
    chats?: ChatType[]
}

export type UserPayloadType = {
    id: string,
    name: string|null,
    avatar: string|null,
    chats: ChatPayloadType[]
}