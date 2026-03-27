import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowsProp, GridEventListener } from '@mui/x-data-grid';

// Propsの型定義
interface SelectionModalProps {
  open: boolean;
  onClose: () => void;
  rows: GridRowsProp;
  columns: GridColDef[];
	onRowClick: GridEventListener<'rowClick'>;
  style: SxProps<Theme>; // MUIのスタイルオブジェクト用
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  open,
  onClose,
  rows,
  columns,
  onRowClick,
  style
}) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={{ ...style, width: '80%', height: { xs: '600px', sm: '280px', md: '550px', lg: '650px', xl: '750px' } }}>
      <Typography variant="h6" gutterBottom>Please select</Typography>
      <Box sx={{ height: { xs: '450px', sm: '200px', md: '400px', lg: '500px', xl: '600px' } }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
          onRowClick={onRowClick}
        />
      </Box>
      <Button
        fullWidth
        variant="contained"
        sx={{ display: { xs: 'block', sm: 'none', md: 'block' }, mt: 2 }}
        onClick={onClose}
      >
        Close
      </Button>
    </Box>
  </Modal>
);
export default SelectionModal;
