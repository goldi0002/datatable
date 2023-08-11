function exportToExcel(sheetName, headers, data, options = {}) {
    try {
      const {
        delimiter = ',',
        includeHeaders = true,
        customFilename = '',
        title = '',
        timeStamp = true,
        footer = [],
        separatorRow = false,
        excludeColumns = [],
        fileExtension = 'csv',
        charset = 'utf-8',
        lineEnding = '\n',
        transformCellValue = val => val,
        autoFormat = true,
        amountSymbol = {
          amountField: '',
          symbol:'$'
        },        
        conditionalFormatting = null,
        nestedDataDelimiter = '.', // Use dot (.) as the delimiterf
        decimalSeparator = '.', // Customize decimal separator
        thousandsSeparator = ',', // Customize thousands separator
        customHeaderTransform = header => header, // Header transformation function
        rowDataTransform = row => row, // Row data transformation function
        cellFormat = val => val, // Cell formatting function
        customDelimiter = ',',
        customLineEnding = '\n',
      } = options;
      if (!headers || !Array.isArray(headers) || !data || !Array.isArray(data) || headers.length === 0 || data.length === 0) {
        throw new Error('Invalid headers or data provided.');
      }
      const columnOrder = headers.filter(header => !excludeColumns.includes(header));
      const formattedHeaders = includeHeaders
      ? columnOrder.map(header => `"${escapeSpecialChars(customHeaderTransform(header))}"`).join(delimiter)
      : '';
      const formattedRows = data.map(row =>
        formatRow(row, headers, columnOrder, delimiter, nestedDataDelimiter, transformCellValue, decimalSeparator, thousandsSeparator, amountSymbol, conditionalFormatting)
      );   
      const csvContent = [
         title,
        formattedHeaders,
        ...(separatorRow ? [''.padEnd(formattedHeaders.length, '-')] : []),
        ...formattedRows,
        ...footer.map(cell => `"${cellFormat(cell)}"`) // Apply cell formatting to footer
      ].join(customLineEnding);
  
      const baseFilename = customFilename || sheetName || generateRandomText(6);
      const timeStampPart = timeStamp ? `_${new Date().toISOString().replace(/[-:.]/g, '')}` : '';
      const fileName = `${baseFilename}${timeStampPart}.${fileExtension}`;
      const blob = new Blob([csvContent], { type: `text/csv;charset=${charset};` });
      const url = URL.createObjectURL(blob);
      downloadFile(url, fileName);
    } catch (error) {
      console.error('An error occurred during CSV export:', error);
      throw error; // Rethrow the error to propagate it
    }
  }  
  function formatHeaders(columnOrder, delimiter) {
    return columnOrder.map(header => `"${header}"`).join(delimiter);
  }
  function formatRow(row, headers, columnOrder, delimiter, nestedDataDelimiter, transformCellValue, decimalSeparator, thousandsSeparator, amountSymbol, conditionalFormatting) {
    try {
      return columnOrder.map((column) => {
        const columnIndex = headers.indexOf(column);
        if (columnIndex !== -1) {
          const cellValue = resolveNestedValue(row, column, nestedDataDelimiter);
          if (column === amountSymbol.amountField) {
            const formattedAmount = formatAmount(cellValue, amountSymbol.symbol, decimalSeparator, thousandsSeparator);
            if (formattedAmount) {
              return `"${escapeSpecialChars(formattedAmount)}"`;
            } else {
              console.warn("Formatting not supported for this value. Please use a different approach.");
              return '""'; // Return an empty cell value as a placeholder
            }
          } else {
            const transformedValue = transformCellValue(cellValue); // Apply cell value transformation
            const formattedValue = formatCellValue(transformedValue, decimalSeparator, thousandsSeparator);
            return `"${escapeSpecialChars(formattedValue)}"`;
          }
        }
        return '';
      }).join(delimiter);
    } catch (error) {
      console.error(error + " occurred");
      throw error;
    }
  }
  function resolveNestedValue(obj, path, nestedDataDelimiter) { 
    const keys = path.split(nestedDataDelimiter);
    return keys.reduce((result, key) => (result && result[key] !== undefined) ? result[key] : '', obj);
  }  
  function escapeSpecialChars(value) {
    let EscapecedChars=value.replace(/"/g, '""');
    return EscapecedChars;
  }
  function downloadFile(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
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
  function formatCellValue(value, decimalSeparator, thousandsSeparator) {
    if (typeof value === 'number') {
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, decimalSeparator, thousandsSeparator });
    } else if (value instanceof Date) {
      return value.toLocaleDateString(); // Format dates as localized strings
    } else {
      return value.toString();
    }
  }
function applyConditionalFormatting(value, conditions) {
    if (!conditions) {
      return value;
    }
    for (const condition of conditions) {
      if (condition.test(value)) {
        return condition.format(value);
      }
    }
    return value;
  }
  function formatAmount(amount,symbol,decimalSeparator,thousandsSeparator){
    try{
      if(symbol==="₹"){
        console.error(symbol +" not supported for now please use different");
        console.warn(symbol +" not supported for now please use different")
        return false;
      }else{
        const formattedAmount=parseFloat(amount).toFixed(2);
        const amountParts=formattedAmount.split('.');
        amountParts[0]=amountParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        return `${symbol}${amountParts.join(decimalSeparator)}`;
      }
    }catch(error){
      console.error("unable to format your amount fields!" + error)
      throw error 
    }
  }