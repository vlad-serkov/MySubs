import { Calendar } from 'antd';
import { useEffect, useState } from 'react';
import SubsService from '../services/subs.service';
import AuthService from '../services/auth.service';

function EventCalendar() {
	const user = AuthService.getCurrentUser();

	const [subs, setSubs] = useState([]);
	const getSubs = async () => {
		const data = await SubsService.getSubs(user.email);
		console.log(data);
		setSubs(data);
	};

	useEffect(() => {
		getSubs();
	}, []);

	const dateCellRender = value => {
		const date = value.format('YYYY-MM-DD') + ' 12:00';
		return subs.map(item => {
			if (date === item.date) {
				return (
					<div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<div
								style={{
									backgroundColor: 'orange',
									borderRadius: '50%',
									width: '5px',
									height: '5px',
									marginRight: '4px',
								}}
							></div>
							{item.name}
						</div>
						cost: {item.cost}
					</div>
				);
			}
			return null;
		});
	};

	return <Calendar cellRender={dateCellRender} />;
}

export default EventCalendar;
