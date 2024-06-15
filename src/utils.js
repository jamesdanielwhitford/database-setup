// src/utils.js
export const sanitizeName = (name) => {
    return name.replace(/\s+/g, '');
  };

export const formatFolderName = (name) => {
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};