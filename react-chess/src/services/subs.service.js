import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://a954-90-154-91-217.ngrok-free.app/api/v1/';

const addSub = (name, namePlan, cost, date, paymentMethods, email) => {
	return axios.post(
		API_URL + 'sub',
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
// .get(
// 			'https://a954-90-154-91-217.ngrok-free.app/api/test/all',
// 			{ params: { email: email } },
// 			{ headers: authHeader() },
// 		)
const getSubs = email => {
	return fetch(
		'https://a954-90-154-91-217.ngrok-free.app/api/v1/sub?email=vladuss_1337@list.ru',
		{
			headers: authHeader(),
		},
	).then(res => {
		return res.json();
	});
};
const SubsService = {
	addSub,
	getSubs,
};

export default SubsService;
