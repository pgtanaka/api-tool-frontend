// npm install react-hook-form
// npm install react-router-dom
// npm install react-cookie
// npm install react-error-boundary
// npm install @mui/material @emotion/react @emotion/styled
// npm install @mui/icons-material
// npm install @mui/x-data-grid
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Box, Grid, Button, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
	DataGrid ,
	GridActionsCellItem,
	GridRowEditStopReasons,
	GridRowModes,
	Toolbar as GridToolbar,
	ToolbarButton
} from '@mui/x-data-grid';
import type {
	GridRowsProp,
	GridColDef,
	GridEventListener,
	GridRenderCellParams,
	GridRowModesModel,
	GridRowId,
	GridRowModel,
	GridSlotProps
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';

import ApiNavigation from './ApiNavigation';
import SelectionModal from './SelectionModal';
import StatusNotification from './StatusNotification';
import FormTextField from './FormTextField';
import FormSelectField from './FormSelectField';
import GenericAutocompleteEditCell from './GenericAutocompleteEditCell';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: '1px solid #555555',
	borderRadius:1,
	boxShadow: 24,
	p: 2
};

const Item = styled(Paper)(() => ({
	margin: '1px',
}));

function EditToolbar(props: GridSlotProps['toolbar']) {
	const { setRowsHeader, setRowModesModel } = props;

	const handleClick = () => {
		// const id = randomId();
		const id = Math.floor(Math.random() * 9999999);
		setRowsHeader((oldRows) => [
			...oldRows,
			{ id, name: '', value: '', isNew: true },
		]);
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
		}));
	};

	return (
		<GridToolbar>
		<Tooltip title="Add record">
		<ToolbarButton onClick={handleClick}>
		<AddIcon fontSize="small" />
		</ToolbarButton>
		</Tooltip>
		</GridToolbar>
	);
};

type Inputs = {
	type: string;
	url: string;
	header: string;
	posts: string;
	result: string;
	title: string;
	id: number;
};

function GetAPI() {
	const fetchUrl = `http://localhost:8080/fetch-api/f`;
	const { handleSubmit, control, getValues, setValue, reset } = useForm<Inputs>({
		defaultValues: {
			type: "",
			url: "",
			header: "",
			posts: "",
			result: "",
			title: "",
			id: 0, // 数値の場合は 0
		}
  });
	const [massage, setMassage] = useState<string>("");
	const [open, setOpen] = useState(false);
	const [openSnack, setSnackOpen] = useState(false);
	const [rows, setRows] = useState<GridRowsProp>([]);
	const [rowsHeader, setRowsHeader] = useState<GridRowsProp>([]);
	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
	// const [cookie,,removeCookie] = useCookies(['token','role']);
	const [,,removeCookie] = useCookies(['role']);
	const [drawerState, setDrawerState] = useState(false);

	// const fetchHeader = { "Authorization": "Bearer " + cookie.token, "Content-Type": "application/json" };
	const fetchHeader = { "Content-Type": "application/json" };
	// credentials: 'include'
	const navigate = useNavigate();
	const handleProfile = () => {
		navigate('/profile');
	};

	const handleLogout = () => {
		fetch('/logout');
		// removeCookie('token', { path: '/' });
		removeCookie('role', { path: '/' });
		navigate('/');
	};

	const handleError = (error: any) => {
		console.log(error);
		fetch('/logout');
		// removeCookie('token', { path: '/' });
		removeCookie('role', { path: '/' });
		navigate('/');
	};

	const handleReset = () => {
		reset({ type:"", id:0 });
		setRowsHeader([]);
	};

	useEffect(() => {
		fetch(`http://localhost:8080/user-api/user/`, { 
			method: 'GET',
			headers: fetchHeader,
		})
		.then(res => {
			if (!res.ok) throw new Error('Invlid');
			return res.json();
		})
		.catch(error => { handleError(error) });
	},);

	// HTTPリクエスト
	const handleSendClick = () => {
		// DataGridからヘッダ生成
		const headers = new Headers();
		rowsHeader.map((row) => headers.append(row.name, row.value));

		// Preview用のヘッダ欄に生成したヘッダを表示
		setValue('header', JSON.stringify(Object.fromEntries([...headers]), null, 2));

		switch(getValues('type')) {
			case "GET":
			case "DELETE":
				fetch(getValues('url'), { method: getValues('type'), headers: headers })
				.then(res => res.json())
				.then(data => {
					setValue('result', JSON.stringify(data, null, 2));
					setSnackOpen(true);
					setMassage('The request was sent successfully.');
				})
				.catch(error => { alert(error) });
			break;
			case "POST":
			case "PUT":
				fetch(getValues('url'), {
					method: getValues('type'),
					headers: headers,
					body: getValues('posts')
				})
				.then(res => res.json())
				.then(data => {
					setValue('result', JSON.stringify(data, null, 2));
					setSnackOpen(true);
					setMassage('The request was sent successfully.');
				})
				.catch(error => { alert(error) });
			break;
		};
	};

	// データ保存処理
	const handleSaveDataClick = () => {
		if(confirm('Do you really want to save?')) {
			fetch(fetchUrl, {
				method: 'POST',
				headers: fetchHeader,
				body: JSON.stringify({'title':getValues('title'),
														 'methodtype':getValues('type'),
														 'url':getValues('url'),
														 'header':JSON.stringify(rowsHeader),
														 'bodyjson':getValues('posts'),
				})

			})
			.then(res => {
				if (!res.ok) throw new Error('Invlid');
				return res.json();
			})
			.then(data => {
				setValue('result', JSON.stringify(data, null, 2));
				setSnackOpen(true);
				setMassage('Data was saved.');
			})
			.catch(error => { handleError(error); });
		};
	};

	// データ保存処理(Update)
	const handleUpdateDataClick = () => {
		if(confirm('Do you really want to update?')) {
			fetch(fetchUrl, {
				method: 'PUT',
				headers: fetchHeader,
				body: JSON.stringify({'id':getValues('id'),
														 'title':getValues('title'),
														 'methodtype':getValues('type'),
														 'url':getValues('url'),
														 'header':JSON.stringify(rowsHeader),
														 'bodyjson':getValues('posts'),
				})

			})
			.then(res => {
				if (!res.ok) throw new Error('Invlid');
				return res.json();
			})
			.then(data => {
				setValue('result', JSON.stringify(data, null, 2));
				setSnackOpen(true);
				setMassage('Profile was updated.');
			})
			.catch(error => { handleError(error); });
		};
	};

	// 保存データ表示用のDataGridカラムの定義
	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', width: 60 },
		{ field: 'title', headerName: 'Title', width: 200 },
		{ field: 'methodtype', headerName: 'Type', width: 60 },
		{ field: 'url', headerName: 'Url', width: 300 },
		{ field: 'header', headerName: 'Header', width: 200 },
		{ field: 'bodyjson', headerName: 'Body', width: 400 },
		{ field: 'delete', headerName: 'DEL',
			renderCell: (params) => {
				return <RenderCellComponent {...params} />
			}
		}
	];

	// 保存データ表示用のDataGridに配置するカスタム削除ボタン
	const RenderCellComponent = (params: GridRenderCellParams) => {
		const handleDeleteClick = () => {
			if(confirm('Do you really want to delete?')) {
				fetch(fetchUrl + '/' + params.row.id, { method: 'DELETE', headers: fetchHeader, })
				.then(res => {
					if (!res.ok) throw new Error('Invlid');
					return res.json();
				})
				.then(data => {
					setSnackOpen(true);
					setMassage(JSON.stringify(data));
				})
				.catch(error => { handleError(error); });
				setOpen(false);
			};
		};
		return (
			<Button variant="contained" onClick={handleDeleteClick}>DEL</Button>
		);
	};

	//保存データ表示Rowクリック時のイベント
	const handleRowClick: GridEventListener<'rowClick'> = (params) => {
		setValue('type', params.row.methodtype);
		setValue('url', params.row.url);
		setRowsHeader(JSON.parse(params.row.header));
		setValue('posts', params.row.bodyjson);
		setValue('title', params.row.title);
		setValue('id', params.row.id);
		setOpen(false);
	};

	// ヘッダ情報表示用のDataGridのカラム定義
	const HEADER_OPTIONS = ['Accept' ,'Authorization' ,'Connection' ,'Content-Length' ,'Content-Type' ,'Cookie' ,'Host' ,'User-Agent', 'X-Cybozu-API-Token'];
	const VALUE_OPTIONS = ['application/json', 'text/plain', 'keep-alive'];
	const columnsHeader: GridColDef[] = [
		{ field: 'name', headerName: 'Name',width: 200, editable: true,
			renderEditCell: (params) => <GenericAutocompleteEditCell {...params} options={HEADER_OPTIONS} />
		},
		{ field: 'value', headerName: 'Value', width: 300, editable: true,
			renderEditCell: (params) => <GenericAutocompleteEditCell {...params} options={VALUE_OPTIONS} />
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 100,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label="Save"
							material={{
								sx: {
									color: 'primary.main',
								},
							}}
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label="Cancel"
							className="textPrimary"
							onClick={handleCancelClick(id)}
							color="inherit"
						/>,
					];
				};

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
	];

	const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		};
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		setRowsHeader(rowsHeader.filter((row) => row.id !== id));
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

	const editedRow = rowsHeader.find((row) => row.id === id);
		if (editedRow!.isNew) {
			setRowsHeader(rowsHeader.filter((row) => row.id !== id));
		};
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		const updatedRow = { ...newRow, isNew: false };
		setRowsHeader(rowsHeader.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	// 保存データ一覧表示
	const handleOpen = () => {
		setOpen(true);
		fetch(fetchUrl, {
			method: 'GET',
			headers: fetchHeader
		})
		.then(res => {
			if (!res.ok) throw new Error('Invlid');
			return res.json();
		})
		.then(data => {
			setRows(data);
		})
		.catch(error => { handleError(error); });
	};

	// 保存データ一覧を閉じる
	const handleClose = () => {
		setOpen(false);
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

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')){
			return;
		}
		setDrawerState(open);
	};

	// コンポーネント内部
	const onFormSubmit = async (_: Inputs, event?: React.BaseSyntheticEvent) => {
		// ボタンのIDを取得
		const submitter = (event?.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement;
		const action = submitter?.id;

		// アクションに応じた関数を実行
		switch (action) {
			case 'handleSendClick':
				await handleSendClick();
			break;
			case 'handleSaveDataClick':
				await handleSaveDataClick();
			break;
			case 'handleUpdateDataClick':
				await handleUpdateDataClick();
			break;
			default:
				console.warn("Unknown action:", action);
		}
	};

	return (<>
		{ //cookie.role === 'admin' &&
			<Box>
			{/* ナビゲーション系 */}
			<ApiNavigation
				drawerOpen={drawerState}
				onToggleDrawer={toggleDrawer}
				onOpenModal={handleOpen}
				onLogout={handleLogout}
				onProfile={handleProfile}
			/>
			<form onSubmit={handleSubmit(onFormSubmit)}>
			<Grid container rowSpacing={1} columnSpacing={1} columns={5} alignItems="center" sx={{mt:5}}> 
				{/* Type選択 */}
				<Grid size={1}>
					<Item>
						<FormSelectField
							name="type"
							control={control}
							label="Type"
							options={["GET", "POST", "PUT", "DELETE"]}
							rules={{ required: "This field is required" }}
						/>
					</Item>
				</Grid>

				<Grid size={1}>
					<Item>
						<Button
							fullWidth
							type="submit"
							variant="contained"
							id="handleSendClick"
							sx={{ bgcolor: 'green' }}
						>Send</Button>
					</Item>
				</Grid>
				<Grid size={1}>
					<Item>
						<Button
							fullWidth
							type="submit"
							variant="contained"
							id="handleSaveDataClick"
						>Save</Button>
					</Item>
				</Grid>
				<Grid size={1}>
					<Item>
						<Button
							fullWidth
							type="submit"
							variant="contained"
							id="handleUpdateDataClick"
							disabled={ getValues('id') !==0 ? false : true }
						>Upd</Button>
					</Item>
				</Grid>
				<Grid size={1}>
					<Item>
						<Button
							fullWidth
							type="reset"
							variant="contained"
							sx={{ bgcolor: 'white' }}
							onClick={handleReset}
						>Reset</Button>
					</Item>
				</Grid>

				{/* URL入力 */}
				<Grid size={5}>
					<Item>
						<FormTextField
							fullWidth
							name="url"
							control={control}
							label="URL"
							required
							rules={{ required: "This field is required" }}
						/>
					</Item>
				</Grid>

				<Grid size={5}>
					<Item>
						<Box
							sx={{
								height: 400,
								width: '100%',
								'& .actions': {
									color: 'text.secondary',
								},
								'& .textPrimary': {
									color: 'text.primary',
								},
							}}
						>
						<DataGrid
							rows={rowsHeader}
							columns={columnsHeader}
							editMode="row"
							rowModesModel={rowModesModel}
							onRowModesModelChange={handleRowModesModelChange}
							onRowEditStop={handleRowEditStop}
							processRowUpdate={processRowUpdate}
							slots={{ toolbar: EditToolbar }}
							slotProps={{
								toolbar: { setRowsHeader, setRowModesModel },
							}}
							showToolbar
						/>
						</Box>
					</Item>
				</Grid>

				{/* Body入力 */}
				<Grid size={5}>
					<Item>
						<FormTextField
							fullWidth
							name="posts"
							control={control}
							label="Body input"
							multiline
							rows={10}
						/>
					</Item>
				</Grid>

				{/* Title入力 */}
				<Grid size={4}>
					<Item>
						<FormTextField
							fullWidth
							name="title"
							control={control}
							label="Title"
							required
							rules={{ required: "This field is required" }}
						/>
					</Item>
				</Grid>

				{/* ID入力 (中央揃えのカスタムスタイル付き) */}
				<Grid size={1}>
					<Item>
						<FormTextField
							fullWidth
							name="id"
							control={control}
							label="ID"
							sx={{ '& input': { textAlign: 'center' } }}
					/>
					</Item>
				</Grid>

				{/* header表示 */}
				<Grid size={5}>
					<Item>
						<FormTextField
							fullWidth
							InputProps={{ readOnly: true }}
							sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
							name="header"
							control={control}
							label="Preview the sent header"
							multiline rows={4}
						/>
					</Item>
				</Grid>

				{/* Result表示 */}
				<Grid size={5}>
					<Item>
						<FormTextField
							fullWidth
							InputProps={{ readOnly: true }}
							sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
							name="result"
							control={control}
							label="Result"
							multiline
							rows={10}
						/>
					</Item>
				</Grid>
			</Grid>
			</form>
			{/* モーダル・通知系 */}
			<SelectionModal
				open={open}
				onClose={handleClose}
				rows={rows}
				columns={columns}
				onRowClick={handleRowClick}
				style={style}
			/>
			<StatusNotification
				open={openSnack}
				message={massage}
				onClose={handleSnackClose}
			/>
			</Box>
		}
		</>
	 );
};

export default GetAPI;
