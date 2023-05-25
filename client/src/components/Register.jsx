import './register.css';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import RoomIcon from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';

function Register({ setShowRegister }) {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newUser = {
			username,
			email,
			password,
		};

		try {
			await axios.post('/users/register', newUser);
			toast.success('User registered successfully!');
			setSuccess(true);
			setError(false);
		} catch (err) {
			console.log('USER REGISTRATION ERROR:' + err);
			toast.error('Something went wrong!');
			setError(true);
		}
	};

	return (
		<div className='registerContainer'>
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
					type='email'
					placeholder='email'
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type='password'
					min='6'
					placeholder='password'
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className='registerBtn' type='submit'>
					Register
				</button>
				{success && (
					<span className='success'>Successfull. You can login now!</span>
				)}
				{error && <span className='failure'>Something went wrong!</span>}
			</form>
			<CancelIcon
				className='registerCancel'
				onClick={() => setShowRegister(false)}
			/>
		</div>
	);
}

export default Register;
