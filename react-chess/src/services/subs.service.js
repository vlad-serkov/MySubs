import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL_V1_SUB;

const addSub = (name, namePlan, cost, date, paymentMethods, email) => {
	return axios.post(
		API_URL,
		{
			name,
			namePlan,
			cost,
			date,
			paymentMethods,
			email: email,
		},
		{ headers: authHeader() },
	);
};
const getSubs = email => {
	return fetch(API_URL + '?email=vladuss_1337@list.ru', {
		headers: authHeader(),
	}).then(res => {
		return res.json();
	});
};

const getSubsFromMail = () => {
	window.open(
		'https://accounts.google.com/o/oauth2/auth?client_id=413098332076-3c80ls4tdcp4df26qquhjjqnmf5p0gud.apps.googleusercontent.com&redirect_uri=http://localhost:8888/Callback&response_type=code&scope=https://mail.google.com/',
	);
	return axios.get(
		'https://09ab-176-59-54-153.ngrok-free.app/api/test/message',
		{
			headers: authHeader(),
		},
	);
};

const SubsService = {
	addSub,
	getSubs,
	getSubsFromMail,
	deleteSub: subId => {
		return axios
			.delete(API_URL + `${subId}`, {
				headers: authHeader(),
			})
			.then(response => {
				console.log(response.data); // успешный ответ
			})
			.catch(error => {
				console.error(error); // обработка ошибки
			});
	},
};

export default SubsService;
