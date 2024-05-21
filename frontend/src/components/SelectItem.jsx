import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function SelectItem({ formName, listData, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    // Displaying a single list of attributes in the Select form with @mui
    <div className="w-[340px] h-[50px]">
      <FormControl fullWidth size="small">
        <InputLabel id={`${formName}-label`}>{formName}</InputLabel>
        <Select
          labelId={`${formName}-label`}
          id={formName}
          onChange={handleChange}
          label={formName}
          defaultValue={listData.length > 0 ? listData[0].Type : ""}
        >
          {/* Iterating through data, creating a MenuItem for each item */}
          {listData.map((item, index) => (
            <MenuItem key={index} value={item.Type}>
              {item.Type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectItem;
