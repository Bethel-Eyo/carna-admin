import React, { useState, useEffect } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Table from 'components/Table/Table.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import axios from 'axios';
import Domain from 'Constants/Keys';
import { getAccessToken } from 'helpers/Utils';
import moment from 'moment';
import Button from 'components/CustomButtons/Button.js';
import { Modal } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const styles = {
	cardCategoryWhite: {
		'&,& a,& a:hover,& a:focus': {
			color: 'rgba(255,255,255,.62)',
			margin: '0',
			fontSize: '14px',
			marginTop: '0',
			marginBottom: '0',
		},
		'& a,& a:hover,& a:focus': {
			color: '#FFFFFF',
		},
	},
	cardTitleWhite: {
		color: '#FFFFFF',
		marginTop: '0px',
		minHeight: 'auto',
		fontWeight: '300',
		fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
		marginBottom: '3px',
		textDecoration: 'none',
		'& small': {
			color: '#777',
			fontSize: '65%',
			fontWeight: '400',
			lineHeight: '1',
		},
	},
};

const useStyles = makeStyles(styles);

export default function Users() {
	const classes = useStyles();
	const [users, setUsers] = useState([]);
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [password, setPassword] = useState('');
	const [searchText, setSearchText] = useState('');
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [userId, setUserId] = useState(null);

	const [show, setShow] = useState(false);
	const [showCreate, setShowCreate] = useState(false);
	const [showDel, setShowDel] = useState(false);

	const handleClose = () => setShow(false);
	const handleCloseCreate = () => setShowCreate(false);
	const handleCloseDel = () => setShowDel(false);
	const handleShow = () => setShow(true);
	const handleShowDel = (user) => {
		setUserId(user.user_id);
		setName(user.name);
		setShowDel(true);
	};
	const handleShowCreate = () => setShowCreate(true);

	// once the page load, you call the function to get the list of users
	useEffect(() => {
		getAllUsers();
	}, []);

	// function to get the list of users
	const getAllUsers = () => {
		// get access token is in the utils function, it gets the token, check if it is
		// still valid, if the token has expired, it logs the user out.
		const headers = {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getAccessToken(),
		};

		axios
			.get(Domain + '/admin/get-all-users', { headers })
			.then((res) => {
				// alert("Succes");
				setUsers(res.data);
			})
			.catch((err) => {
				alert(err.message);
				console.log(err.message);
			});
	};

	// Admin action to update a user
	const updateUser = () => {
		if (password == '') {
			alert('Please you must set a new password');
		} else {
			const headers = {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getAccessToken(),
			};

			let data = {
				name,
				username,
				city,
				country,
				password,
				user_id: userId,
			};

			axios
				.put(Domain + '/admin/update-user', data, { headers })
				.then((res) => {
					alert('User Updated Successfuly');
					console.log(res.data);
					handleClose();
					window.location.reload();
				})
				.catch((err) => {
					alert(err.message);
					console.log(err.message);
					handleClose();
				});
		}
	};

	// on edit user clicked, you pass the single user object and set the properties accordingly
	const editUser = (user) => {
		setName(user.name);
		setUsername(user.username);
		setCity(user.city);
		setCountry(user.country);
		setUserId(user.user_id);
		handleShow();
	};

	// this handles the onchange in the input fields
	const handleChange = (text) => ({ target: { value } }) => {
		if (text == 'name') {
			setName(value);
		} else if (text == 'password') {
			setPassword(value);
		} else if (text == 'username') {
			setUsername(value);
		} else if (text == 'city') {
			setCity(value);
		} else if (text == 'country') {
			setCountry(value);
		} else if (text == 'searchText') {
			setSearchText(value);
		}
	};

	// function called to delete the user
	const deleteUser = () => {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getAccessToken(),
		};

		axios
			.delete(Domain + `/admin/delete-user/${userId}`, { headers })
			.then((res) => {
				alert('User Deleted Successfuly');
				console.log(res.data);
				handleCloseDel();
				window.location.reload();
			})
			.catch((err) => {
				alert(err.message);
				console.log(err.message);
				handleCloseDel();
			});
	};

	// function to create a new user
	const createUser = () => {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getAccessToken(),
		};

		let data = {
			name,
			username,
			city,
			country,
			password,
		};

		axios
			.post(Domain + '/register-user', data, { headers })
			.then((res) => {
				alert('User Created Successfuly');
				console.log(res.data);
				handleCloseCreate();
				window.location.reload();
			})
			.catch((err) => {
				alert(err.message);
				console.log(err.message);
				handleCloseCreate();
			});
	};

	const exportPDF = () => {
		const unit = 'pt';
		const size = 'A4'; // Use A1, A2, A3 or A4
		const orientation = 'portrait'; // portrait or landscape

		const marginLeft = 40;
		const doc = new jsPDF(orientation, unit, size);

		doc.setFontSize(15);

		const title = 'My Awesome Report';
		const headers = [['Name', 'Username', 'Country', 'City', 'Date Created']];

		const data = users.map((user) => [
			user.name,
			user.username,
			user.country,
			user.city,
			moment(user.createdat).format('MMM Do YY'),
		]);

		let content = {
			startY: 50,
			head: headers,
			body: data,
		};

		doc.text(title, marginLeft, 40);
		doc.autoTable(content);
		doc.save('report.pdf');
	};

	return (
		<GridContainer>
			<GridItem xs={12} sm={12} md={12}>
				<TextField
					id="searchText"
					label="Search by name, city or country"
					variant="outlined"
					style={{ width: '30%', marginRight: '5%' }}
					onChange={handleChange('searchText')}
					value={searchText}
				/>
				<Button color="primary" onClick={exportPDF}>
					Export to PDF
				</Button>
				<Card>
					<CardHeader color="primary">
						<h4 className={classes.cardTitleWhite}>Carna users</h4>
						<p className={classes.cardCategoryWhite}>This table shows the list of users on carna</p>
					</CardHeader>
					<CardBody>
						<Table
							tableHeaderColor="primary"
							tableHead={['Name', 'Username', 'Country', 'City', 'Date Created', 'Actions']}
							tableData={users
								.filter(
									(user) =>
										user.name.toLowerCase().includes(searchText.toLowerCase()) ||
										user.city.toLowerCase().includes(searchText.toLowerCase()) ||
										user.country.toLowerCase().includes(searchText.toLowerCase())
								)
								.map((user, index) => [
									user.name,
									user.username,
									user.country,
									user.city,
									moment(user.createdat).format('MMM Do YY'),
									<div key={index}>
										<Button color="primary" onClick={() => editUser(user)}>
											Edit
										</Button>
										<Button color="danger" onClick={() => handleShowDel(user)}>
											Delete
										</Button>
									</div>,
								])}
						/>
						<Button color="primary" onClick={handleShowCreate}>
							Create New user
						</Button>

						{/* Modal for the Edit Functionality */}
						<Modal show={show} size="lg" onHide={handleClose}>
							<Modal.Header closeButton>
								<Modal.Title>Edit {name + "'"}s details</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								{/* <GridContainer>
                  <GridItem xs={12} sm={12} md={3}> */}
								<TextField
									id="name"
									label="Name"
									variant="outlined"
									style={{ width: '30%', marginRight: '5%' }}
									onChange={handleChange('name')}
									value={name}
								/>
								<TextField
									id="username"
									label="Username"
									variant="outlined"
									style={{ width: '30%', marginRight: '5%' }}
									onChange={handleChange('username')}
									value={username}
								/>
								<TextField
									id="city"
									label="City"
									variant="outlined"
									style={{ width: '30%' }}
									onChange={handleChange('city')}
									value={city}
								/>
								<TextField
									id="country"
									label="Country"
									variant="outlined"
									style={{ width: '30%', marginRight: '5%', marginTop: '5%' }}
									onChange={handleChange('country')}
									value={country}
								/>
								<TextField
									id="password"
									label="Password"
									variant="outlined"
									style={{ width: '30%', marginTop: '5%' }}
									onChange={handleChange('password')}
									value={password}
								/>
								{/* </GridItem>
                </GridContainer> */}
							</Modal.Body>
							<Modal.Footer>
								<Button color="danger" variant="secondary" onClick={handleClose}>
									Close
								</Button>
								<Button color="primary" variant="primary" onClick={updateUser}>
									Save Changes
								</Button>
							</Modal.Footer>
						</Modal>

						{/* Modal for the Create Functionality */}
						<Modal show={showCreate} size="lg" onHide={handleCloseCreate}>
							<Modal.Header closeButton>
								<Modal.Title>Create new User</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								{/* <GridContainer>
                  <GridItem xs={12} sm={12} md={3}> */}
								<TextField
									id="name"
									label="Name"
									variant="outlined"
									style={{ width: '30%', marginRight: '5%' }}
									onChange={handleChange('name')}
									value={name}
								/>
								<TextField
									id="username"
									label="Username"
									variant="outlined"
									style={{ width: '30%', marginRight: '5%' }}
									onChange={handleChange('username')}
									value={username}
								/>
								<TextField
									id="city"
									label="City"
									variant="outlined"
									style={{ width: '30%' }}
									onChange={handleChange('city')}
									value={city}
								/>
								<TextField
									id="country"
									label="Country"
									variant="outlined"
									style={{ width: '30%', marginRight: '5%', marginTop: '5%' }}
									onChange={handleChange('country')}
									value={country}
								/>
								<TextField
									id="password"
									label="Password"
									variant="outlined"
									style={{ width: '30%', marginTop: '5%' }}
									onChange={handleChange('password')}
									value={password}
								/>
								{/* </GridItem>
                </GridContainer> */}
							</Modal.Body>
							<Modal.Footer>
								<Button color="danger" variant="secondary" onClick={handleCloseCreate}>
									Close
								</Button>
								<Button color="primary" variant="primary" onClick={createUser}>
									Save Changes
								</Button>
							</Modal.Footer>
						</Modal>

						{/* Modal for the Delete Functionality */}
						<Modal show={showDel} onHide={handleCloseDel}>
							<Modal.Header closeButton>
								<Modal.Title>Delete User</Modal.Title>
							</Modal.Header>
							<Modal.Body>Are you sure you want to delete {name}?</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={handleCloseDel}>
									Close
								</Button>
								<Button variant="primary" onClick={deleteUser}>
									Save Changes
								</Button>
							</Modal.Footer>
						</Modal>
					</CardBody>
				</Card>
			</GridItem>
		</GridContainer>
	);
}
