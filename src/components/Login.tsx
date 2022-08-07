import './Login.css';
import Api from '../Api';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

type Props = {
    onReceive: (u: User) => Promise<void>
}

export default ({ onReceive }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        (email !== '' && password !== '') ? setDisabled(false) : setDisabled(true);
    }, [email, password])

    const handleFacebookLogin = async () => {
        let result = await Api.fpPopup();

        result ? onReceive(result.user) : alert('Error!')
    }

    const handleLoginWithEmail = async () => {
        setDisabled(true);
        let result = await Api.loginWithEmail(email, password);

        result ? onReceive(result.user) : alert('Error!');
    }

    return (
        <div className='login'>
            <button onClick={handleFacebookLogin}>Logar com Facebook</button>
            <div className='loginWithEmail'>
                <input
                    type='text'
                    placeholder='Digite seu email'
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Digite sua senha'
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                />
                <button
                    onClick={handleLoginWithEmail}
                    disabled={disabled}
                >Entrar</button>
            </div>
        </div>
    );
}