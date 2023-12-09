import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/v1/';

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
		'http://localhost:8080/api/v1/sub?email=vladuss_1337@list.ru',
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
	deleteSub: (subId) => {
		return axios.delete(`http://localhost:8080/api/v1/sub/${subId}`, { headers: authHeader() })
			.then(response => {
				console.log(response.data); // успешный ответ
			})
			.catch(error => {
				console.error(error); // обработка ошибки
			});

	},
};



export default SubsService;
