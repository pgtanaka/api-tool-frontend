import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import {
	Box,
	Grid,
	TextField,
	Button,
	Stack,
	OutlinedInput,
	InputLabel,
	InputAdornment,
	FormControl,
	FormHelperText,
	IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type Inputs = {
	id: string;
	password: string;
};

function Login() {
	const fetchUrl = `http://localhost:8080/login`;
	const fetchHeader = { "Content-Type": "application/json" };
	const { control, handleSubmit, getValues } = useForm<Inputs>();
	// const [,setCookie,] = useCookies(['token', 'role']);
	const [,setCookie,] = useCookies(['role']);

	const navigate = useNavigate();
	const onSubmit: SubmitHandler<Inputs> = () => {
		fetch(fetchUrl, {
			method: 'POST',
			headers: fetchHeader,
			body: JSON.stringify({'email':getValues('id'), 'password':getValues('password')})
		})
		.then(res => {
			if (!res.ok)return res.json().then(err => { throw err; });
			return res.json();
		})
		.then(data => {
			// setCookie('token', data.token, { path: '/' })
			setCookie('role', data.role, { path: '/' })
			navigate('/api');
		})
		.catch(err => { alert(err.error); });
	}

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};
	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
		<Stack spacing={1} display="flex" alignItems="center" justifyContent="center" sx={{height: { xs:'600px', sm:'250px', md:'400px', lg:'500px', xl:'600px' }}}>
		<Box sx={{p:5, border:1, borderRadius:1}}
		//display="flex" // flexboxを使用
		//alignItems="center" // 縦方向の中央揃え				//justifyContent="center" // 横方向の中央揃え
		>
			<Grid container width="35ch" rowSpacing={1} columnSpacing={1} columns={1}>
				<Grid size={1}>
					<Controller
						name="id"
						control={control}
						defaultValue=""
						rules={{ required: "This field is required" }}
						render={({ field, fieldState }) => (
							<TextField
								fullWidth
								id="id"
								label="ID"
								error={ fieldState.invalid }
								helperText={ fieldState.error?.message }
								{...field}
							/>
						)}
					/>
				</Grid>
				<Grid size={1}>
					<Controller
						name="password"
						control={control}
						defaultValue=""
						rules={{ required: "This field is required", minLength: {value:10, message:'10 or more characters'}}}
						render={({ field, fieldState }) => (
							<FormControl fullWidth variant="outlined" error={ fieldState.invalid }>
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
					<Button fullWidth type="submit" variant="contained">Login</Button>
				</Grid>
			</Grid>
		</Box>
		</Stack>
		</form>
	);
};

export default Login;
