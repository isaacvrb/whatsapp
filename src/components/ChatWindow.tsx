import { useEffect, useState, useRef, KeyboardEventHandler, KeyboardEvent } from 'react';
import EmojiPicker, { IEmojiData, SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react';

import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

import MessageItem from './MessageItem';

import { MessageType } from '../types/message';
import { UserType } from '../types/user';

import './ChatWindow.css';
import { ChatType } from '../types/chat';
import Api from '../Api';

type Props = {
    user: UserType,
    data: ChatType
}

export default ({ user, data }: Props) => {
    const body: React.LegacyRef<HTMLDivElement> = useRef(null);

    const [text, setText] = useState<string>('');
    const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
    const [list, setList] = useState<MessageType[]>([]);
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        setList([]);
        let unsub = Api.onChatContent(data.chatId, setList, setUsers);
        return unsub;
    }, [data.chatId]);

    useEffect(() => {
        if(body.current && (body.current.scrollHeight > body.current.offsetHeight)) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list]);

    const handleEmojiClick = (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => {
        setText(text+data.emoji);
    }

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            handleSendClick()
        }
    }
    const handleSendClick = () => {
        if(text !== '') {
            Api.sendMessage(data, user.id, 'text', text, users);
            setText('');
            setEmojiOpen(false);
        }
    }

    return (
        <div className='chatWindow'>
            <div className='chatWindow--header'>

                <div className='chatWindow--headerinfo'>
                    <img className='chatWindow--avatar' src={data.image} alt={data.title} />
                    <div className='chatWindow--name'>{data.title}</div>
                </div>

                <div className='chatWindow--headerbuttons'>

                    <div className='chatWindow--btn'>
                        <SearchIcon style={{ color: '#919191' }} />
                    </div>
                    <div className='chatWindow--btn'>
                        <AttachFileIcon style={{ color: '#919191' }} />
                    </div>
                    <div className='chatWindow--btn'>
                        <MoreVertIcon style={{ color: '#919191' }} />
                    </div>

                </div>

            </div>

            <div ref={body} className='chatWindow--body'>
                {list.map((item, index)=>(
                    <MessageItem
                        key={index}
                        data={item}
                        user={user}
                    />
                ))}
            </div>

            <div
                className='chatWindow--emojiarea'
                style={{height: emojiOpen ? '200px' : '0px'}}
            >
                <EmojiPicker
                    disableSearchBar
                    disableSkinTonePicker
                    onEmojiClick={handleEmojiClick}
                    skinTone={SKIN_TONE_MEDIUM_LIGHT}
                />
            </div>

            <div className='chatWindow--footer'>

                <div className='chatWindow--pre'>
                    <div
                        className='chatWindow--btn'
                        onClick={()=>setEmojiOpen(false)}
                        style={{width: emojiOpen ? 40 : 0}}
                    >
                        <CloseIcon style={{ color: '#919191' }} />
                    </div>
                    <div
                        className='chatWindow--btn'
                        onClick={()=>setEmojiOpen(true)}
                    >
                        <InsertEmoticonIcon style={{ color: emojiOpen ? '#009688' : '#919191' }} />
                    </div>
                </div>

                <div className='chatWindow--inputarea'>
                    <input
                        className='chatWindow--input'
                        type='text'
                        placeholder='Digite uma mensagem'
                        value={text}
                        onChange={e=>setText(e.target.value)}
                        onKeyUp={e => handleKeyUp(e)}
                    />
                </div>

                <div className='chatWindow--pos'>
                    {text === '' &&
                        <div
                            className='chatWindow--btn'
                        >
                            <MicIcon style={{ color: '#919191' }} />
                        </div>
                    }
                    {text !== '' &&
                        <div
                            className='chatWindow--btn'
                            onClick={handleSendClick}
                        >
                            <SendIcon style={{ color: '#919191' }} />
                        </div>
                    }
                </div>

            </div>
        </div>
    )
}