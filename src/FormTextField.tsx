import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";

// Tはフォームのデータ型（スキーマ）を指します
interface FormTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  rules?: object;
}

const FormTextField = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  ...props
}: FormTextFieldProps<T> & TextFieldProps)  => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        {...props} // fullWidth, multiline, rows などを外から受け取る
        label={label}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        sx={{ bgcolor: 'background.paper', ...props.sx }}
      />
    )}
  />
);

export default FormTextField;
