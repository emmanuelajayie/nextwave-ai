// src/utils/dataCleaner.js

export function cleanData(data) {
  if (!Array.isArray(data)) return [];

  return data.map((row) => {
    let cleanedRow = {};

    Object.entries(row).forEach(([key, value]) => {
      if (typeof value === 'string') {
        cleanedRow[key] = value.trim();
      } else if (value === null || value === undefined || value === '') {
        cleanedRow[key] = null;
      } else {
        cleanedRow[key] = value;
      }
    });

    return cleanedRow;
  });
}
