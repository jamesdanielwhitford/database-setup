// src/components/FileInput.js
import React from 'react';

const FileInput = ({ label, name, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type="file"
        name={name}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            onChange(name, file);
          }
        }}
      />
    </div>
  );
};

export default FileInput;