function exportToExcel(sheetName, headers, data, options = {}) {
  const {
    delimiter = ',',
    includeHeaders = true,
    customFilename = '',
    timeStamp = true,
    footer = [],
    fileExtension = 'csv', // Added option for file extension
  } = options;

  const csvRows = [];
  let timestamp = '';
  let sheetname = sheetName ? sheetName : generateRandomText(6);
  
  if (includeHeaders) {
    const formattedHeaders = headers.map(header => `"${header}"`).join(delimiter);
    csvRows.push(formattedHeaders);
  }
  
  data.forEach(row => {
    const formattedRow = row.map(cell => {
      if (typeof cell === 'string') {
        return `"${cell}"`;
      } else if (typeof cell === 'number') {
        return cell.toString();
      } else {
        return '';
      }
    }).join(delimiter);
    
    csvRows.push(formattedRow);
  });

  if (footer.length > 0) {
    const footerRow = footer.map(cell => `"${cell}"`).join(delimiter);
    csvRows.push(footerRow);
  }
  
  if (timeStamp) {
    timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Get a timestamp in a format suitable for a file name
  }
  
  const baseFilename = customFilename || sheetname;
  const fileName = `${baseFilename}${timeStamp ? '_' + timestamp : ''}.${fileExtension}`; // Use the specified file extension
  const csvContent = csvRows.join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
}
function generateRandomText(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
  }
  return result;
}