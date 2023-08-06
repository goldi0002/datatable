# ExcelExport


# Examples{

const headers = ['Name', 'Age', 'Country', 'City'];    
const data = [
  ['John Doe', 30, 'USA', 'New York'],
  ['Jane Smith', 25, 'Canada', 'Toronto'],
  ['Michael Johnson', 40, 'UK', 'London']
];



exportToExcel('Sheet1', headers, data, {
  columnOrder: ['Name', 'City', 'Country', 'Age'],
  customFilename: 'my_exported_data'
});



const data = [
  { person: { name: 'John', age: 30 }, country: 'USA' },
  { person: { name: 'Jane', age: 25 }, country: 'Canada' },
];

exportToExcel('Sheet1', ['Name', 'Age', 'Country'], data, {
  nestedDataDelimiter: 'person.name',
  transformCellValue: val => val.toUpperCase(),
  customFilename: 'nested_data_export'
});


((((((( escapeSpecialChars(value, escapeChar))))))))
This function takes two arguments:
value: The input string that needs to be escaped.
escapeChar: The escape character used in the CSV format. In most cases, this is a double quote (").
The function uses a regular expression to replace any occurrences of the escape character, newline (\n), or carriage return (\r) in the input string with the escape character repeated twice. This effectively escapes these characters according to the CSV format.
For example, if you have a cell value like "Hello, world!", using escapeSpecialChars would ensure that it's properly formatted for CSV export:

# }


