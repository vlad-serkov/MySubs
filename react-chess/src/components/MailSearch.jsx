import { Button } from 'primereact/button';
import SubsService from '../services/subs.service';
import {} from 'react-router-dom';
import { useState } from 'react';
import AddSubsForm from './AddSubsForm';
import { Modal } from 'antd';

function MailSearch() {
	const [arraySubs, setArraySubs] = useState([]);
	const [selectedName, setSelectedName] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = item => {
		setSelectedName(item);
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const handleGetData = async () => {
		const subsNames = await SubsService.getSubsFromMail();
		console.log(subsNames.data);
		setArraySubs(subsNames.data);
	};
	const handleAddSubs = () => {
		alert('ADD SUUUUUBS SIUUUUUU');
	};
	return (
		<div>
			{!arraySubs.length ? (
				<Button onClick={handleGetData}>Get data</Button>
			) : (
				arraySubs.map(item => {
					return (
						<>
							<div
								style={{
									display: 'flex',
									marginBottom: 15,
									border: '1px solid grey',
									width: '250px',
									justifyContent: 'space-between',
									padding: 10,
								}}
								key={item}
							>
								<p>{item}</p>
								<Button type='primary' onClick={e => showModal(item)}>
									Add this sub
								</Button>
							</div>
							
						</>
					);
				})
			)}
			<>
			<Modal
								title='Add sub'
								open={isModalOpen}
								onOk={handleOk}
								onCancel={handleCancel}
							>
								<AddSubsForm nameSubs={selectedName} />
							</Modal></>
		</div>
	);
}

export default MailSearch;
