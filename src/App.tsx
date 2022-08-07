import React, { useEffect, useState } from 'react';

import ChatListItem from './components/ChatListItem';
import ChatWindow from './components/ChatWindow';
import ChatIntro from './components/ChatIntro';
import NewChat from './components/NewChat';

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';

import { ChatType } from './types/chat';
import { UserType } from './types/user';

import './App.css';
import Login from './components/Login';
import { User } from 'firebase/auth';
import Api from './Api';

export default () => {

    const [chatList, setChatList] = useState<ChatType[]>([]);
    const [activeChat, setActiveChat] = useState<ChatType|undefined>(undefined);
    const [user, setUser] = useState<UserType|null>(null);

    useEffect(() => {
        if(user !== null) {
            let unsub = Api.onChatList(user.id, setChatList);
            return unsub;
        }
    }, [user])

    const [showNewChat, setShowNewChat] = useState<boolean>(false);

    const handleLoginData = async (u: User) => {
        let newUser = {
            id: u.uid,
            name: u.displayName,
            avatar: u.photoURL
        };
        await Api.addUser(newUser, setUser);
    }

    if(user === null) {
        return (<Login onReceive={handleLoginData}/>);
    }

    return (
        <div className='app-window'>
            <div className='sidebar'>
                <NewChat
                    user={user}
                    chatList={chatList}
                    show={showNewChat}
                    setShow={setShowNewChat}
                />
                
                <header>
                    <img className='header--avatar' src={user.avatar ? user.avatar : ''} alt={user.name ? user.name : ''} />
                    <div className='header--buttons'>
                        <div className='header--btn'>
                            <DonutLargeIcon style={{color: '#919191'}}/>
                        </div>
                        <div
                            className='header--btn'
                            onClick={()=>setShowNewChat(true)}
                        >
                            <ChatIcon style={{color: '#919191'}}/>
                        </div>
                        <div className='header--btn'>
                            <MoreVertIcon style={{color: '#919191'}}/>
                        </div>
                    </div>
                </header>

                <div className='search'>
                    <div className='search--input'>
                        <SearchIcon fontSize='small' style={{color: '#919191'}}/>
                        <input
                            type='search'
                            placeholder='Procurar o começar uma nova conversa'
                        />
                    </div>
                </div>

                <div className='chatlist'>
                    {chatList.map((item, index) => (
                        <ChatListItem
                            key={index}
                            data={item}
                            active={activeChat?.chatId === chatList[index].chatId}
                            onClick={() => setActiveChat(chatList[index])}
                        />
                    ))}
                </div>

            </div>
            <div className='contentarea'>
                {activeChat?.chatId !== undefined &&
                    <ChatWindow
                        user={user}
                        data={activeChat}
                    />
                }
                {activeChat?.chatId === undefined &&
                    <ChatIntro />
                }
            </div>
        </div>
    )
}