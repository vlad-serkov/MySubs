import { useState } from 'react';
import './addSubsForm.css';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/lara-light-amber/theme.css';
import { Button } from 'primereact/button';
import SubsService from '../services/subs.service';
import AuthService from '../services/auth.service';

function AddSubsForm() {
	const paymentMethods = [
		{
			name: 'MirPay',
		},
		{ name: 'SberPay' },
		{ name: 'Банковковской картой' },
	];
	const initialState = {
		name: '',
		namePlan: '',
		cost: 0,
		date: {},
		dateEnd: {},
		paymentMethods: '',
	};
	const [formData, setFormData] = useState(initialState);
	const getDateEnd = startDate => {
		if (formData.date) {
			let date = new Date(startDate.year, startDate.month - 1, startDate.day);

			// Добавляем месяц
			date.setMonth(date.getMonth() + 1);
			setFormData(formData => {
				return {
					...formData,
					dateEnd: {
						day: date.getDate() + 30,
						month: date.getMonth(),
						year: date.getFullYear(),
					},
				};
			});
			return;
		}
	};
	const handlerSubmit = e => {
		e.preventDefault();

		const user = AuthService.getCurrentUser();

		const dataStartString = `${formData.date.year}-${
			formData.date.month < 10 ? '0' + formData.date.month : formData.date.month
		}-${
			formData.date.day < 10 ? '0' + formData.date.day : formData.date.day
		} 12:00`;

		SubsService.addSub(
			formData.name,
			formData.namePlan,
			formData.cost,
			dataStartString,

			formData.paymentMethods.name,
			user.email,
		)
			.then(res => {
				alert('Подписка успешно добавлена!');
			})
			.catch(err => {
				alert(err.message);
				console.log(err);
			});
	};
	return (
		<div className='form-container'>
		<form onSubmit={handlerSubmit} className='form-add'>
			<div className='first-block'>
				<div>
					<div className='add-icon'>image</div>
					<input
						className='form-add__input input-name'
						value={formData.name}
						onChange={e => setFormData({ ...formData, name: e.target.value })}
						type='text'
						placeholder='Имя подписки'
					/>
				</div>
				<input
					className='form-add__input input-namePlan'
					value={formData.namePlan}
					onChange={e => setFormData({ ...formData, namePlan: e.target.value })}
					type='text'
					placeholder='Имя плана'
				/>
				<div
					style={{
						display: 'flex',
					}}
				>
					<input
						className='input-cost'
						value={formData.cost}
						onChange={e => setFormData({ ...formData, cost: e.target.value })}
						type='number'
						placeholder='2.99'
					/>
					<div className='form__valute'>RUB</div>
				</div>
			</div>
			<div className='second-block '>
				<div className='payment under-border'>
					<p className='payment__text'>Дата первой оплаты</p>
					<Calendar
						value={
							Object.keys(formData.date).length !== 0
								? new Date(
										formData.date.year,
										formData.date.month - 1,
										formData.date.day,
								  )
								: null
						}
						onChange={e => {
							const date = {
								day: e.target.value.getDate(),
								month: e.target.value.getMonth() + 1,
								year: e.target.value.getFullYear(),
							};
							setFormData(formData => {
								return { ...formData, date: date };
							});
							getDateEnd(date);
						}}
						minDate={new Date()}
						showIcon
					/>
				</div>

				<div className='payment-end under-border'>
					<p className='payment-end__text'>Дата следующей оплаты</p>
					{Object.keys(formData.dateEnd).length !== 0
						? `${
								formData.dateEnd.month < 10
									? '0' + formData.dateEnd.month
									: formData.dateEnd.month
						  }/${
								formData.dateEnd.day < 10
									? '0' + formData.dateEnd.day
									: formData.dateEnd.day
						  }/${formData.dateEnd.year}`
						: 'xx/xx/xxxx'}
				</div>
				<div className=' under-border methods-payment'>
					<p>Метод оплаты</p>
					<Dropdown
						value={formData.paymentMethods}
						onChange={e =>
							setFormData({ ...formData, paymentMethods: e.target.value })
						}
						placeholder='Выбрать..'
						inputId='dd-city'
						options={paymentMethods}
						optionLabel='name'
						className=' dropdown'
					/>
				</div>
			</div>
			<Button className='btn-submit'>Создать подписку</Button>
		</form>
		</div>
	);
}

export default AddSubsForm;
