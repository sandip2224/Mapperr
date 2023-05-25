import RoomIcon from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useState } from 'react';

import './login.css';

const Login = ({ setShowLogin, setCurrentUsername, myStorage }) => {
	const [error, setError] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = {
			username,
			password,
		};
		try {
			const res = await axios.post('/users/login', user);
			setCurrentUsername(res.data.user?.username);
			myStorage.setItem('user', res.data.user?.username);
			setShowLogin(false);
		} catch (err) {
			setError(true);
		}
	};

	return (
		<div className='loginContainer'>
			<div className='logo'>
				<RoomIcon className='logoIcon' />
				<span>Mapperr</span>
			</div>
			<form onSubmit={handleSubmit}>
				<input
					autoFocus
					placeholder='username'
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type='password'
					min='6'
					placeholder='password'
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className='loginBtn' type='submit'>
					Login
				</button>
				{error && <span className='failure'>Something went wrong!</span>}
			</form>
			<CancelIcon className='loginCancel' onClick={() => setShowLogin(false)} />
		</div>
	);
};

export default Login;
