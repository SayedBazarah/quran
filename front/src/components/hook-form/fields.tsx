import { RHFRating } from './rhf-rating';
import { RHFTextField } from './rhf-text-field';
import { RHFPhoneInput } from './rhf-phone-input';
import { RHFNumberInput } from './rhf-number-input';
import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFSelect, RHFMultiSelect } from './rhf-select';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox';
import { RHFUpload, RHFUploadBox, RHFUploadAvatar } from './rhf-upload';
import { RHFDatePicker, RHFMobileDateTimePicker } from './rhf-date-picker';

// ----------------------------------------------------------------------

export const Field = {
  Select: RHFSelect,
  Switch: RHFSwitch,
  Rating: RHFRating,
  Text: RHFTextField,
  Phone: RHFPhoneInput,
  Upload: RHFUpload,
  UploadAvatar: RHFUploadAvatar,
  UploadBox: RHFUploadBox,
  Checkbox: RHFCheckbox,
  DatePicker: RHFDatePicker,
  NumberInput: RHFNumberInput,
  MultiSwitch: RHFMultiSwitch,
  MultiSelect: RHFMultiSelect,
  Autocomplete: RHFAutocomplete,
  MultiCheckbox: RHFMultiCheckbox,
  MobileDateTimePicker: RHFMobileDateTimePicker,
};
