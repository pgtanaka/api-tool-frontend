import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import type { SubmitHandler } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import {
	Box,
	Grid,
	Button,
	Stack,
	Typography,
	OutlinedInput,
	InputLabel,
	InputAdornment,
	FormControl,
	FormHelperText,
	IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import StatusNotification from './StatusNotification';
import FormTextField from './FormTextField';

type Inputs = {
	email: string;
	name: string;
	password: string;
	phone: string;
	address: string;
};

function Profile() {
	const fetchUrl = `http://localhost:8080/user-api/user/`;

	const { control, handleSubmit, setValue } = useForm<Inputs>({
		defaultValues: {
			email: "",
			name: "",
			password: "",
			phone: "",
			address: ""
		}
	});
	// const [cookie,,removeCookie] = useCookies(['token','role']);
	const [,,removeCookie] = useCookies(['role']);
	const [showPassword, setShowPassword] = useState(false);
	const [openSnack, setSnackOpen] = useState(false);
	const [massage, setMassage] = useState<string>("");
	// const fetchHeader = { "Authorization": "Bearer " + cookie.token, "Content-Type": "application/json" };
	const fetchHeader = { "Content-Type": "application/json" };

	const navigate = useNavigate();
	const handleback = () => {
		navigate('/api');
	};

	const handleError = (error: any) => {
		console.log(error);
		fetch('/logout');
		// removeCookie('token', { path: '/' });
		removeCookie('role', { path: '/' });
		navigate('/');
	};

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		if(confirm('Do you really want to update?')) {
			fetch(fetchUrl, {
				method: 'PUT',
				headers: fetchHeader,
				body: JSON.stringify(data)
			})
			.then(res => {
				if (!res.ok) throw new Error('Invlid');
				return res.json();
			})
			.then(() => {
				setSnackOpen(true);
				setMassage('Data was updated.');
			})
			.catch(error => { handleError(error) });
		};
	}

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};
	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	// Snackbarを非表示
	const handleSnackClose = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === 'clickaway') {
			return
		};
		setSnackOpen(false);
		event.preventDefault;
	};

	useEffect(() => {
		fetch(fetchUrl, { 
			method: 'GET',
			headers: fetchHeader,
		})
		.then(res => {
			if (!res.ok) throw new Error('Invlid');
			return res.json();
		})
		.then(data => {
			(Object.keys(data) as (keyof Inputs)[]).map((key)=>{
				setValue(`${key}`, data[key]);
			});
		})
		.catch(error => { handleError(error) });
	},);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
		<IconButton size="small" edge="start" color="inherit" onClick={handleback}>
			<ArrowBackIcon />Back
		</IconButton>
		<Stack spacing={1} display="flex" alignItems="center" justifyContent="center">
		<Typography variant="h6">Profile</Typography>
		<Box sx={{p:5, border:1, borderRadius:1}}>
		<Grid container width="35ch" rowSpacing={1} columnSpacing={1} columns={1}> 
			<Grid size={1}>
				<FormTextField
					fullWidth
					name="email"
					control={control}
					label="Email"
					required
					rules={{ required: "This field is required" }}
				/>
			</Grid>
			<Grid size={1}>
				<FormTextField
					fullWidth
					name="name"
					control={control}
					label="Name"
					required
					rules={{ required: "This field is required" }}
				/>
			</Grid>
			<Grid size={1}>
				<Controller
					name="password"
					control={control}
					rules={{ required: "This field is required",minLength: {value:10, message:'10 or more characters'}}}
					render={({ field, fieldState }) => (
						<FormControl fullWidth  variant="outlined" error={ fieldState.invalid }>
						<InputLabel htmlFor="password">Password</InputLabel>
							<OutlinedInput
								id="password"
								type={showPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label={
												showPassword ? 'hide the password' : 'display the password'
											}
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											onMouseUp={handleMouseUpPassword}
											edge="end"
										>
										{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
								{...field}
							/>
							<FormHelperText>{ fieldState.error?.message }</FormHelperText>
						</FormControl>
					)}
				/>
			</Grid>
			<Grid size={1}>
				<FormTextField
					fullWidth
					name="phone"
					control={control}
					label="Phone"
					required
					rules={{ required: "This field is required" }}
				/>
			</Grid>
			<Grid size={1}>
				<FormTextField
					fullWidth
					name="address"
					control={control}
					label="Address"
					required
					rules={{ required: "This field is required" }}
				/>
			</Grid>
			<Grid size={1}>
				<Button fullWidth type="submit" variant="contained">Update</Button>
			</Grid>
		</Grid>
		</Box>
		</Stack>
		<StatusNotification
			open={openSnack}
			message={massage}
			onClose={handleSnackClose}
		/>
		</form>
	);
};

export default Profile;
