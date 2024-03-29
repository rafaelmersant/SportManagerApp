import React from "react";

const Select = ({ name, label, options, error, ...rest }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}> {label} </label>}
      <select name={name} id={name} {...rest} className="form-control">
        <option value="" />
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name ? option.name : option.description}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
