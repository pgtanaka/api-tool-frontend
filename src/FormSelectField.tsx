import { Controller} from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

// T extends FieldValues とすることで、どんなフォーム定義にも対応可能になります
interface FormSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: string[];
  rules?: object;
}

const FormSelectField = <T extends FieldValues>({ 
  name,
  control,
  label,
  options,
  rules = {}
}: FormSelectFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState }) => (
      <FormControl
        fullWidth
        error={!!fieldState.error}
        required={!!(rules as any)?.required} // rulesにrequiredがあるか判定
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          {...field}
          labelId={`${name}-label`}
          label={label}
          sx={{ bgcolor: 'background.paper' }}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
        {fieldState.error && (
          <FormHelperText>{fieldState.error.message}</FormHelperText>
        )}
      </FormControl>
    )}
  />
);

export default FormSelectField;
