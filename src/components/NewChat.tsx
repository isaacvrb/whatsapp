import { useState, useEffect } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { UserType } from '../types/user';
import { ChatType } from '../types/chat';

import './NewChat.css';
import Api from '../Api';

type Props = {
    show: boolean
    user: UserType
    chatList: ChatType[]
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export default ({ user, chatList, show, setShow }: Props) => {
    const [list, setList] = useState<UserType[]>([]);

    useEffect(() => {
        const getList = async () => {
            if(user !== null) {
                let results = await Api.getContactList(user.id);
                setList(results);
            }
        }
        getList();
    }, [user]);

    const addNewChat = async (user2: UserType) => {
        await Api.chatExists(user, user2);
        setShow(false);
    }

    return (
        <div
            className='newChat'
            style={{
                left: show ? 0 : -415
            }}
        >
            <div className='newChat--head'>

                <div
                    className='newChat--backbutton'
                    onClick={()=>setShow(false)}
                >
                    <ArrowBackIcon style={{ color: '#fff' }}/>
                </div>

                <div className='newChat--headtitle'>Nova Conversa</div>
            </div>
            <div className='newChat--list'>
                {list.map((item, index)=>(
                    <div onClick={()=>addNewChat(item)} className='newChat--item' key={index}>
                        <img className='newChat--itemavatar' src={item.avatar ? item.avatar : ''} alt={item.name ? item.name : ''} />
                        <div className='newChat--itemname'>{item.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}