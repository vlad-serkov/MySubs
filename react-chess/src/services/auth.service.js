import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_BASE;

const register = (firstName, lastName, email, password) => {
	return axios.post(API_URL + 'api/v1/registration', {
		firstName,
		lastName,
		email,
		password,
	});
};

const login = (username, password) => {
	return axios
		.post(API_URL + 'login', {
			username,
			password,
		})
		.then(response => {
			console.log(response);
			if (response.data.accessToken) {
				localStorage.setItem('user', JSON.stringify(response.data));
			}
			console.log(response.data);
			return response.data;
		});
};

const logout = () => {
	localStorage.removeItem('user');
};

const getCurrentUser = () => {
	return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
	register,
	login,
	logout,
	getCurrentUser,
};

export default AuthService;
