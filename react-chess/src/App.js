import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import logo1 from './common/logo1.png';

import AuthService from './services/auth.service';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import BoardUser from './components/BoardUser';
import BoardModerator from './components/BoardModerator';
import BoardAdmin from './components/BoardAdmin';
import AddSubsForm from './components/AddSubsForm';
import EventBus from './common/EventBus';
import EventCalendar from './components/EventCalendar';

const App = () => {
	const [showModeratorBoard, setShowModeratorBoard] = useState(false);
	const [showAdminBoard, setShowAdminBoard] = useState(false);
	const [currentUser, setCurrentUser] = useState(undefined);

	useEffect(() => {
		const user = AuthService.getCurrentUser();

		if (user) {
			setCurrentUser(user);
			console.log(user);
			setShowModeratorBoard(user.roles.includes('ROLE_MODERATOR'));
			setShowAdminBoard(user.roles.includes('ROLE_ADMIN'));
		}

		EventBus.on('logout', () => {
			logOut();
		});

		return () => {
			EventBus.remove('logout');
		};
	}, []);

	const logOut = () => {
		AuthService.logout();
		setShowModeratorBoard(false);
		setShowAdminBoard(false);
		setCurrentUser(undefined);
	};

	return (
		<div>
			<nav className='navbar navbar-expand navbar-dark bg-dark'>
				<div>
					<img
						style={{ marginRight: '10px' }}
						src={logo1}
						alt='logo1'
						width='50'
						height='51'
					/>
				</div>
				<Link to={'/'} className='navbar-brand'>
					MySubs
				</Link>

				<div className='navbar-nav mr-auto'>
					<li className='nav-item'>
						<Link to={'/home'} className='nav-link'>
							Домашняя страница
						</Link>
					</li>

					{showModeratorBoard && (
						<li className='nav-item'>
							<Link to={'/mod'} className='nav-link'>
								Страница модератора
							</Link>
						</li>
					)}

					{showAdminBoard && (
						<li className='nav-item'>
							<Link to={'/admin'} className='nav-link'>
								Страница админа
							</Link>
						</li>
					)}

					{currentUser && (
						<li className='nav-item'>
							<Link to={'/user'} className='nav-link'>
								Ваши подписки
							</Link>
						</li>
					)}
					{currentUser && (
						<li className='nav-item'>
							<Link to={'/addsub'} className='nav-link'>
								Добавить подписку
							</Link>
						</li>
					)}
					{currentUser && (
						<li className='nav-item'>
							<Link to={'/calendar'} className='nav-link'>
								Календарь
							</Link>
						</li>
					)}
					{currentUser && (
						<li className='nav-item'>
							<Link to={'/mail-search'} className='nav-link'>
								Найти по mail
							</Link>
						</li>
					)}
				</div>

				{currentUser ? (
					<div className='navbar-nav ml-auto'>
						<li className='nav-item'>
							<Link to={'/profile'} className='nav-link'>
								{currentUser.username}
							</Link>
						</li>
						<li className='nav-item'>
							<a href='/login' className='nav-link' onClick={logOut}>
								Выйти
							</a>
						</li>
					</div>
				) : (
					<div className='navbar-nav ml-auto'>
						<li className='nav-item'>
							<Link to={'/login'} className='nav-link'>
								Войти
							</Link>
						</li>

						<li className='nav-item'>
							<Link to={'/register'} className='nav-link'>
								Зарегистрироваться
							</Link>
						</li>
					</div>
				)}
			</nav>
			<div className='container mt-3'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/home' element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/profile' element={<Profile />} />
					<Route path='/user' element={<BoardUser />} />
					<Route path='/addsub' element={<AddSubsForm />} />
					<Route path='/calendar' element={<EventCalendar />} />
					<Route path='/mod' element={<BoardModerator />} />
					<Route path='/admin' element={<BoardAdmin />} />
				</Routes>
			</div>
		</div>
	);
};

export default App;
