export default function authHeader() {
	const user = JSON.parse(localStorage.getItem('user'));

	if (user && user.accessToken) {
		return {
			Authorization: 'Bearer ' + user.accessToken,
			'ngrok-skip-browser-warning': 'true',
		}; // for Spring Boot back-end
		// return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
	} else {
		return {};
	}
}
