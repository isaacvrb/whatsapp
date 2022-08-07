import { useEffect, useState } from 'react';
import { MessageType } from '../types/message';
import { UserType } from '../types/user';

import './MessageItem.css';

type Props = {
    user: UserType
    data: MessageType
}

export default ({ data, user }: Props) => {

    const [time, setTime] = useState('');

    useEffect(() => {
        if(data.date.seconds > 0) {
            let d = new Date(data.date.seconds * 1000);
            let hours: string|number = d.getHours();
            let minutes: string|number = d.getMinutes();
            hours = hours < 10 ? `0${hours}` : hours;
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            setTime(`${hours}:${minutes}`);
        }
    }, [data]);

    return (
        <div
            className='messageLine'
            style={{
                justifyContent: user.id === data.author ? 'flex-end' : 'flex-start'
            }}
        >
            <div
                className='messageItem'
                style={{
                    backgroundColor: user.id === data.author ? '#dcf8c6' : '#fff'
                }}
            >
                <div className='messageText'>{data.body}</div>
                <div className='messageDate'>{time}</div>
            </div>
        </div>
    )
}