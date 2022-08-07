import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, getDoc, query, addDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { getAuth, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import { UserPayloadType, UserType } from './types/user';
import { ChatType } from './types/chat';
import { MessageType, ChatItemType } from './types/message';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const Api = {
    fpPopup: async () => {
        const provider = new FacebookAuthProvider();
        return await signInWithPopup(auth, provider);
    },
    loginWithEmail: async (email: string, password: string) => {
        return await signInWithEmailAndPassword(auth, email, password).catch(()=>{});
    },
    addUser: async (u: UserType, setUser: React.Dispatch<React.SetStateAction<UserType | null>>) => {
        await setDoc(doc(db, 'users', u.id), {
            name: u.name ? u.name : 'Teste',
            avatar: u.avatar ? u.avatar : 'https://graph.facebook.com/398076802322201/picture'
        }, { merge: true });

        let req = await getDoc(doc(db, `users/${u.id}`));
        let user = {...req.data(), id: req.id} as UserType;

        setUser(user);        
    },
    getContactList: async (userId: string) => {
        let list: UserType[] = [];

        let results = await getDocs(query(collection(db, 'users')));
        results.docs.forEach(result => {
            let data = result.data() as UserType;

            if(result.id !== userId) {
                list.push({
                    id: result.id,
                    name: data.name,
                    avatar: data.avatar,
                    chats: []
                });
            }
        })


        return list;
    },
    chatExists: async (user: UserType, user2: UserType) => {
        let users = await getDocs(query(collection(db, 'users')));

        users.forEach(u => {
            if(u.id === user.id) {
                let data = u.data() as UserType;
    
                if(data.chats) {
                    const filter = data.chats.find(item => item.with === user2.id);
                    if(filter === undefined) {
                        const handleFunction = async () => {
                            await Api.addNewChat(user, user2);
                        }
                        return handleFunction();
                    }
                } else {
                    const handleFunction = async () => {
                        await Api.addNewChat(user, user2);
                    }
                    return handleFunction();
                }

            }
        })
    },
    addNewChat: async (user: UserType, user2: UserType) => {
        let newChat = await addDoc(collection(db, 'chats'), {
            messages: [],
            users: [ user.id, user2.id ]
        });

        await updateDoc(doc(db, 'users', user.id), {
            chats: arrayUnion({
                chatId: newChat.id,
                title: user2.name,
                image: user2.avatar,
                with: user2.id
            })
        });

        await updateDoc(doc(db, 'users', user2.id), {
            chats: arrayUnion({
                chatId: newChat.id,
                title: user.name,
                image: user.avatar,
                with: user.id
            })
        });

    },
    onChatList: (userId: string, setChatList: React.Dispatch<React.SetStateAction<ChatType[]>>) => {
        return onSnapshot(doc(db, `users/${userId}`), ((doc) => {
            if(doc.exists()) {
                let data = doc.data() as UserType;
                if(data.chats) {
                    let chats = [...data.chats];

                    chats.sort((a, b) => {
                        if(a.lastMessageDate === undefined) {
                            return -1;
                        }
                        if(b.lastMessageDate === undefined) {
                            return -1;
                        }
                        if(a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
                            return 1;
                        } else {
                            return -1;
                        }
                    })

                    setChatList(chats);
                }
            }
        }))
    },
    onChatContent: (
        chatId: string,
        setList: React.Dispatch<React.SetStateAction<MessageType[]>>,
        setUsers: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        return onSnapshot(doc(db, `chats/${chatId}`), ((doc) => {
            if(doc.exists()) {
                let data = doc.data() as ChatItemType;
                setList(data.messages);
                setUsers(data.users);
            }
        }))
    },
    sendMessage: async (chatData: ChatType, userId: string, type: string, body: string, users: string[]) => {
        let now = new Date();

        await updateDoc(doc(db, 'chats', chatData.chatId), {
            messages: arrayUnion({
                type,
                author: userId,
                body,
                date: now
            })
        });

        for(let i in users) {
            let u = await getDoc(doc(db, `users/${users[i]}`));
            let uData = u.data() as UserPayloadType;

            if(uData.chats) {
                let chats = [...uData.chats];

                for(let e in chats) {
                    if(chats[e].chatId === chatData.chatId) {
                        chats[e].lastMessage = body;
                        chats[e].lastMessageDate = now;
                    }
                }

                await updateDoc(doc(db, `users/${users[i]}`), {
                    chats
                })
            }
        }
    }
}

export default Api;