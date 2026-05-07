const XLSX = require('xlsx');
const path = require('path');

function checkHeaders() {
    const filePath = path.join(__dirname, '..', 'korea_model_0507.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('--- First 5 rows ---');
    data.slice(0, 5).forEach((row, i) => {
        console.log(`Row ${i + 1}:`, JSON.stringify(row));
    });
}

checkHeaders();
