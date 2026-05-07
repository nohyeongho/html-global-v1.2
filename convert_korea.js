/**
 * korea_model_0507.xlsx → html-convert-onepoint-V1-model-data.js 변환 스크립트
 * 
 * 왜 이렇게 짰나: 
 * 1. 기존의 한국 모델 데이터(globalModelData)를 최신 엑셀 데이터로 갱신하기 위함입니다.
 * 2. Node.js의 xlsx 라이브러리를 사용하여 대량의 엑셀 데이터를 효율적으로 처리합니다.
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const xlsxFile = path.join(__dirname, 'korea_model_0507.xlsx');
const jsFile = path.join(__dirname, 'html-convert-onepoint-V1-model-data.js');

console.log(`[시작] ${xlsxFile} 읽는 중...`);

// 엑셀 파일 존재 여부 확인
if (!fs.existsSync(xlsxFile)) {
    console.error(`에러: ${xlsxFile} 파일을 찾을 수 없습니다.`);
    process.exit(1);
}

// 엑셀 파일 로드
const workbook = XLSX.readFile(xlsxFile);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

console.log(`시트 이름: ${sheetName}`);

// 시트 데이터를 JSON 배열로 변환 (헤더 포함 배열 형식)
const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log(`총 행 수 (헤더 포함): ${rawData.length}`);

// 데이터 변환 로직
const data = [];
let count = 0;

// 1행(index 0)은 헤더(["PROD_MODEL_CD","PRODUCT_LVL3_CD"])이므로 2행부터 처리
for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    
    // 데이터가 유효한지 확인 (최소 2개 컬럼)
    if (!row || row.length < 2) continue;
    
    const model = row[0]; // A열: 모델 코드
    const lv3   = row[1]; // B열: 레벨3 코드
    
    // 모델명과 레벨3 코드가 모두 존재할 때만 추가
    if (model && lv3) {
        data.push({
            model: String(model).trim(),
            lv3: String(lv3).trim()
        });
        count++;
    }
}

console.log(`유효 데이터 추출 완료: ${count}건`);

// JS 파일로 저장
console.log(`[쓰기] ${jsFile} 저장 중...`);

// 기존 형식(const globalModelData = [...]) 유지
const output = `const globalModelData = ${JSON.stringify(data)};`;

try {
    fs.writeFileSync(jsFile, output, 'utf8');
    console.log(`[완료] ${jsFile} 업데이트 완료!`);
} catch (err) {
    console.error(`[실패] 파일 쓰기 중 오류 발생: ${err.message}`);
}
