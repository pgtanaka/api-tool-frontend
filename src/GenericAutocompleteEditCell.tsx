import React, { useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { AutocompleteProps } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';
import type { GridRenderEditCellParams } from '@mui/x-data-grid';

// Propsの定義：DataGridの標準Paramsに加えて、optionsを受け取れるようにします
interface GenericAutocompleteEditCellProps extends GridRenderEditCellParams {
  options: string[];
}

const GenericAutocompleteEditCell = (props: GenericAutocompleteEditCellProps) => {
  const { id, value, field, error, options } = props;
  const apiRef = useGridApiContext();

  const handleChange: NonNullable<AutocompleteProps<any, any, any, any>['onChange']> = useCallback(
    async (_: React.SyntheticEvent, newValue: string | null, reason: string) => {
      await apiRef.current.setEditCellValue({ id, field, value: newValue });
      if (reason !== 'clear') {
        apiRef.current.stopCellEditMode({ id, field });
      }
    },
    [id, field, apiRef]
  );

  const handleBlur = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      await apiRef.current.setEditCellValue({ id, field, value: inputValue });
    },
    [id, field, apiRef]
  );

  return (
    <Autocomplete
      freeSolo
      value={value ?? ''}
      onChange={handleChange}
      options={options}
      fullWidth
      // DataGridのセル内でのEnter/Escape挙動を制御
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.stopPropagation();
        if (event.key === 'Escape') {
          apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
        }
      }}
      renderInput={(inputParams) => (
        <TextField
          {...inputParams}
          error={!!error}
          onBlur={handleBlur}
        />
      )}
			sx={{
				fontSize: 'inherit',
				'& .MuiFormControl-root': {
					height: '100%',
				},
				'& .MuiOutlinedInput-root': {
					fontSize: 'inherit',
					paddingLeft: '9px',
					paddingTop: 0,
					paddingBottom: '1px', // to account for the editing cell 1px
				},
				'& .MuiOutlinedInput-root .MuiAutocomplete-input': {
					paddingLeft: 0,
				},
				'& .MuiOutlinedInput-notchedOutline': {
					display: 'none',
				},
			}}
    />
  );
};

export default GenericAutocompleteEditCell;
