
        
        const productData = [{ "lv2Name": "시스템 에어컨", "lv2": "ACE", "lv3": "CHCHL", "lv3Name": "칠러" }, { "lv2Name": "시스템 에어컨", "lv2": "ACE", "lv3": "COCRA", "lv3Name": "상업용 천정형" }, { "lv2Name": "시스템 에어컨", "lv2": "ACE", "lv3": "COPAH", "lv3Name": "상업용 스탠드" }, { "lv2Name": "시스템 에어컨", "lv2": "ACE", "lv3": "GAGHP", "lv3Name": "가스식시스템에어컨" }, { "lv2Name": "시스템 에어컨", "lv2": "ACE", "lv3": "SYSBL", "lv3Name": "시스템보일러" }, { "lv2Name": "에어컨", "lv2": "AIC", "lv3": "REWRA", "lv3Name": "이동식 에어컨" }, { "lv2Name": "에어컨", "lv2": "AIC", "lv3": "STPAC", "lv3Name": "스탠드형 에어컨" }, { "lv2Name": "에어컨", "lv2": "AIC", "lv3": "TWPAT", "lv3Name": "2in1" }, { "lv2Name": "에어컨", "lv2": "AIC", "lv3": "WASRA", "lv3Name": "벽걸이형" }, { "lv2Name": "에어컨", "lv2": "AIC", "lv3": "WIWRA", "lv3Name": "창호형 에어컨" }, { "lv2Name": "공기청정기", "lv2": "ARC", "lv3": "AIARC", "lv3Name": "공기청정기" }, { "lv2Name": "공기청정기", "lv2": "ARC", "lv3": "EMARC", "lv3Name": "전자식 마스크" }, { "lv2Name": "AV", "lv2": "AUD", "lv3": "APAUD", "lv3Name": "오디오/플레이어" }, { "lv2Name": "AV", "lv2": "AUD", "lv3": "BTEAR", "lv3Name": "블루투스 이어폰" }, { "lv2Name": "AV", "lv2": "AUD", "lv3": "SOHTH", "lv3Name": "사운드바" }, { "lv2Name": "보일러", "lv2": "BLR", "lv3": "BOBLR", "lv3Name": "보일러" }, { "lv2Name": "소물액세서리", "lv2": "BUL", "lv3": "ACBUL", "lv3Name": "소물액세서리" }, { "lv2Name": "CDMA폰", "lv2": "CDM", "lv3": "RPCDM", "lv3Name": "CDMA폰" }, { "lv2Name": "실링팬", "lv2": "CLF", "lv3": "SECLF", "lv3Name": "실링팬" }, { "lv2Name": "상업용 디스플레이", "lv2": "CSP", "lv3": "DIDSM", "lv3Name": "디지털 사이니지" }, { "lv2Name": "상업용 디스플레이", "lv2": "CSP", "lv3": "LEDSM", "lv3Name": "LED 사이니지" }, { "lv2Name": "상업용 디스플레이", "lv2": "CSP", "lv3": "ONEQU", "lv3Name": "원퀵" }, { "lv2Name": "상업용 디스플레이", "lv2": "CSP", "lv3": "OTDSM", "lv3Name": "올레드 사이니지" }, { "lv2Name": "청소기", "lv2": "CVC", "lv3": "A9CLN", "lv3Name": "무선청소기" }, { "lv2Name": "청소기", "lv2": "CVC", "lv3": "GECVC", "lv3Name": "유선청소기" }, { "lv2Name": "청소기", "lv2": "CVC", "lv3": "GERBC", "lv3Name": "로봇청소기" }, { "lv2Name": "청소기", "lv2": "CVC", "lv3": "LARBJ", "lv3Name": "잔디깍이 로봇" }, { "lv2Name": "스타일러", "lv2": "DCS", "lv3": "SADCS", "lv3Name": "슈케이스" }, { "lv2Name": "스타일러", "lv2": "DCS", "lv3": "SCDCS", "lv3Name": "슈케어" }, { "lv2Name": "스타일러", "lv2": "DCS", "lv3": "STDCS", "lv3Name": "스타일러" }, { "lv2Name": "제습/가습기", "lv2": "DEH", "lv3": "DEDEH", "lv3Name": "제습기" }, { "lv2Name": "제습/가습기", "lv2": "DEH", "lv3": "DEHMD", "lv3Name": "가습기" }, { "lv2Name": "의류건조기", "lv2": "DRR", "lv3": "CLDRR", "lv3Name": "의류건조기" }, { "lv2Name": "세탁기", "lv2": "DRW", "lv3": "DUDRW", "lv3Name": "트롬" }, { "lv2Name": "세탁기", "lv2": "DRW", "lv3": "GEDRW", "lv3Name": "통돌이" }, { "lv2Name": "세탁기", "lv2": "DRW", "lv3": "MIDRW", "lv3Name": "미니세탁기" }, { "lv2Name": "일체형/데스크톱", "lv2": "DSK", "lv3": "CLDSK", "lv3Name": "클라우드 PC" }, { "lv2Name": "일체형/데스크톱", "lv2": "DSK", "lv3": "MUDSK", "lv3Name": "일체형/데스크톱" }, { "lv2Name": "식기세척기", "lv2": "DWM", "lv3": "DIDWM", "lv3Name": "식기세척기" }, { "lv2Name": "워시타워", "lv2": "DWS", "lv3": "WADWS", "lv3Name": "워시타워" }, { "lv2Name": "전기레인지", "lv2": "ELR", "lv3": "HIELR", "lv3Name": "하이라이트" }, { "lv2Name": "전기레인지", "lv2": "ELR", "lv3": "HYELR", "lv3Name": "하이브리드" }, { "lv2Name": "전기레인지", "lv2": "ELR", "lv3": "INELR", "lv3Name": "인덕션" }, { "lv2Name": "EV충전기", "lv2": "EVC", "lv3": "LSEVC", "lv3Name": "완속충전기" }, { "lv2Name": "171", "lv2": "EVF", "lv3": "급속충전기", "lv3Name": "" }, { "lv2Name": "선풍기", "lv2": "FAN", "lv3": "COFAN", "lv3Name": "선풍기" }, { "lv2Name": "석유식_온풍기", "lv2": "FHO", "lv3": "OIFHO", "lv3Name": "석유식_온풍기" }, { "lv2Name": "전기/가스식_온풍기", "lv2": "FHT", "lv3": "ELFHT", "lv3Name": "전기/가스식_온풍기" }, { "lv2Name": "광파오븐/전자레인지", "lv2": "GOR", "lv3": "ERGOR", "lv3Name": "전자레인지" }, { "lv2Name": "광파오븐/전자레인지", "lv2": "GOR", "lv3": "OVGOR", "lv3Name": "광파오븐레인지" }, { "lv2Name": "가스오븐/가스레인지", "lv2": "GRN", "lv3": "GAGRN", "lv3Name": "가스레인지" }, { "lv2Name": "가스오븐/가스레인지", "lv2": "GRN", "lv3": "GVGRN", "lv3Name": "가스오븐레인지" }, { "lv2Name": "맥주제조기", "lv2": "HBR", "lv3": "BEHBR", "lv3Name": "맥주제조기" }, { "lv2Name": "안마의자", "lv2": "HMC", "lv3": "MAHMC", "lv3Name": "안마의자" }, { "lv2Name": "홈넷", "lv2": "HNS", "lv3": "HOHNS", "lv3Name": "홈넷솔루션" }, { "lv2Name": "홈넷", "lv2": "HNS", "lv3": "INBMS", "lv3Name": "지능형빌딩자동제어시스템" }, { "lv2Name": "SMART폰", "lv2": "HSD", "lv3": "SMHSD", "lv3Name": "SMART폰" }, { "lv2Name": "히터", "lv2": "HTR", "lv3": "HOHTR", "lv3Name": "히터" }, { "lv2Name": "정수기", "lv2": "HWI", "lv3": "HCHWI", "lv3Name": "냉온정수기" }, { "lv2Name": "정수기", "lv2": "HWI", "lv3": "PUHWI", "lv3Name": "정수전용" }, { "lv2Name": "스마트씽큐", "lv2": "IOT", "lv3": "SMIOT", "lv3Name": "스마트씽큐" }, { "lv2Name": "키오스크", "lv2": "KOS", "lv3": "KIOSK", "lv3Name": "키오스크" }, { "lv2Name": "김치냉장고", "lv2": "KRE", "lv3": "COKRE", "lv3Name": "뚜껑식형" }, { "lv2Name": "김치냉장고", "lv2": "KRE", "lv3": "STKRE", "lv3Name": "스탠드형" }, { "lv2Name": "LED조명", "lv2": "LED", "lv3": "LELED", "lv3Name": "LED조명" }, { "lv2Name": "의료기기", "lv2": "MDD", "lv3": "HAMHC", "lv3Name": "메디헤어" }, { "lv2Name": "뷰티 디바이스", "lv2": "MHC", "lv3": "CLMHC", "lv3Name": "클렌징 기기" }, { "lv2Name": "뷰티 디바이스", "lv2": "MHC", "lv3": "REMHC", "lv3Name": "탄력기기" }, { "lv2Name": "모니터", "lv2": "MNT", "lv3": "CLMNT", "lv3Name": "클라우드 모니터" }, { "lv2Name": "모니터", "lv2": "MNT", "lv3": "MEMNT", "lv3Name": "의료용 모니터" }, { "lv2Name": "모니터", "lv2": "MNT", "lv3": "PCMNT", "lv3Name": "PC 모니터" }, { "lv2Name": "모니터", "lv2": "MNT", "lv3": "TVMNT", "lv3Name": "TV 모니터" }, { "lv2Name": "모니터", "lv2": "MNT", "lv3": "UGMNT", "lv3Name": "울트라 기어 게이밍 모니터" }, { "lv2Name": "모니터", "lv2": "MNT", "lv3": "UWMNT", "lv3Name": "울트라 와이드 모니터" }, { "lv2Name": "마인드웰니스", "lv2": "MWD", "lv3": "DHMWD", "lv3Name": "마인드웰니스" }, { "lv2Name": "저장장치", "lv2": "NAS", "lv3": "CDCDR", "lv3Name": "CD-ROM/RW/콤보" }, { "lv2Name": "저장장치", "lv2": "NAS", "lv3": "NENAS", "lv3Name": "넷하드" }, { "lv2Name": "노트북", "lv2": "NTB", "lv3": "GRNTB", "lv3Name": "그램" }, { "lv2Name": "노트북", "lv2": "NTB", "lv3": "TBNTB", "lv3Name": "태블릿(Tablet)" }, { "lv2Name": "노트북", "lv2": "NTB", "lv3": "UDNTB", "lv3Name": "울트라 PC" }, { "lv2Name": "노트북", "lv2": "NTB", "lv3": "UGNTB", "lv3Name": "울트라 기어" }, { "lv2Name": "사무기기", "lv2": "OFM", "lv3": "ININK", "lv3Name": "잉크젯_프린터" }, { "lv2Name": "사무기기", "lv2": "OFM", "lv3": "LALAS", "lv3Name": "레이저젯_프린터" }, { "lv2Name": "사무기기", "lv2": "OFM", "lv3": "OFOFA", "lv3Name": "사무기기" }, { "lv2Name": "기타제품", "lv2": "OTH", "lv3": "ZZOTH", "lv3Name": "기타제품" }, { "lv2Name": "식물생활가전", "lv2": "PCD", "lv3": "VEPCD", "lv3Name": "식물재배기" }, { "lv2Name": "PLS조명", "lv2": "PLS", "lv3": "PLPLS", "lv3Name": "PLS조명" }, { "lv2Name": "로봇", "lv2": "RBT", "lv3": "GURBT", "lv3Name": "안내 로봇" }, { "lv2Name": "로봇", "lv2": "RBT", "lv3": "SERBT", "lv3Name": "서빙로봇" }, { "lv2Name": "로봇", "lv2": "RBT", "lv3": "UVRBT", "lv3Name": "UVC 로봇" }, { "lv2Name": "밥솥", "lv2": "RCK", "lv3": "CORCK", "lv3Name": "밥솥" }, { "lv2Name": "냉장고", "lv2": "REF", "lv3": "BUSBS", "lv3Name": "비즈니스" }, { "lv2Name": "냉장고", "lv2": "REF", "lv3": "NOREF", "lv3Name": "일반형" }, { "lv2Name": "냉장고", "lv2": "REF", "lv3": "PUSBS", "lv3Name": "정수기형" }, { "lv2Name": "냉장고", "lv2": "REF", "lv3": "SISBS", "lv3Name": "양문형" }, { "lv2Name": "냉장고", "lv2": "REF", "lv3": "ULSBS", "lv3Name": "상냉장/하냉동" }, { "lv2Name": "토스터", "lv2": "TOT", "lv3": "TOTOT", "lv3Name": "토스터" }, { "lv2Name": "TV", "lv2": "TVL", "lv3": "LSLED", "lv3Name": "라이프 스타일 스크린" }, { "lv2Name": "TV", "lv2": "TVL", "lv3": "NALED", "lv3Name": "나노셀 TV" }, { "lv2Name": "TV", "lv2": "TVL", "lv3": "NOTLV", "lv3Name": "일반형(TV)" }, { "lv2Name": "TV", "lv2": "TVL", "lv3": "OTLED", "lv3Name": "올레드 TV" }, { "lv2Name": "TV", "lv2": "TVL", "lv3": "QNLED", "lv3Name": "QNED TV" }, { "lv2Name": "TV", "lv2": "TVL", "lv3": "SDLED", "lv3Name": "일반 LED TV" }, { "lv2Name": "TV", "lv2": "TVL", "lv3": "UDLED", "lv3Name": "울트라 HD TV" }, { "lv2Name": "프로젝터", "lv2": "VPJ", "lv3": "BSVPJ", "lv3Name": "프로빔 (상업용)" }, { "lv2Name": "프로젝터", "lv2": "VPJ", "lv3": "MOVPJ", "lv3Name": "시네빔" }, { "lv2Name": "Wearable Band", "lv2": "WEA", "lv3": "BAWEA", "lv3Name": "Wearable Band" }, { "lv2Name": "와인셀러", "lv2": "WEF", "lv3": "WIWEF", "lv3Name": "와인셀러" }].filter(i => i.lv2 !== 'PRODUCT_LVL2_CD'); 

        
        let selectedLv2Codes = new Set();
        let selectedLv3Codes = new Set();
        let selectedModels = new Set();
        let selectedCorpCd = 'ALL'; 
        let currentFilteredModels = []; 
        let modelRenderLimit = 500;

        function openProductModal() {
            document.getElementById('productModal').style.display = "block";
            renderLv2List();
            renderLv3List();
        }

        function closeProductModal() {
            document.getElementById('productModal').style.display = "none";
        }

        function renderLv2List() {
            const container = document.getElementById('lv2List');
            container.innerHTML = "";

            
            let sourceData = (appRegion === 'ko') ? productData : globalExcelData;

            if (!sourceData) {
                container.innerHTML = '<div style="color: #999; text-align: center; margin-top: 50px; font-size: 12px;">데이터를 불러오는 중입니다...</div>';
                return;
            }

            const lv2Map = new Map();
            sourceData.forEach(item => {
                const code = item.lv2;
                const name = (appRegion === 'ko') ? item.lv2Name : item.lv2; 
                if (!lv2Map.has(code)) {
                    lv2Map.set(code, name);
                }
            });

            const sortedLv2 = Array.from(lv2Map.entries()).sort((a, b) => {
                return a[1].localeCompare(b[1], 'ko-KR');
            });

            sortedLv2.forEach(([code, name]) => {
                const div = document.createElement('div');
                div.style.padding = "8px 5px";
                div.style.fontSize = "11px";
                div.style.borderBottom = "1px solid #f5f5f5";

                div.innerHTML = `
                    <label style="cursor: pointer; display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" value="${code}" onchange="handleLv2Change(this)" ${selectedLv2Codes.has(code) ? 'checked' : ''} style="margin: 0;">
                        <span>${name} <span style="color: #888;">(${code})</span></span>
                    </label>
                `;
                container.appendChild(div);
            });
        }

        function handleLv2Change(checkbox) {
            const code = checkbox.value;
            
            const allCheck = document.getElementById('allProductCheck');
            if (allCheck && allCheck.checked) allCheck.checked = false;
            if (checkbox.checked) {
                selectedLv2Codes.add(code);
            } else {
                selectedLv2Codes.delete(code);
            }
            renderLv3List();
        }

        function renderLv3List() {
            const container = document.getElementById('lv3List');
            const selectAllContainer = document.getElementById('lv3SelectAllContainer');
            const selectAllCheckbox = document.getElementById('selectAllLv3');

            container.innerHTML = "";

            if (selectedLv2Codes.size === 0) {
                container.innerHTML = '<div style="color: #999; text-align: center; margin-top: 50px; font-size: 12px;">대분류를 먼저 선택하세요.</div>';
                selectAllContainer.style.display = 'none';
                return;
            }

            selectAllContainer.style.display = 'block';

            
            const sourceData = (appRegion === 'ko') ? productData : globalExcelData;
            if (!sourceData) return;

            const availableLv3 = sourceData.filter(item => selectedLv2Codes.has(item.lv2));
            const allItemsSelected = availableLv3.length > 0 && availableLv3.every(item => selectedLv3Codes.has(item.lv3));
            selectAllCheckbox.checked = allItemsSelected;

            
            const uniqueLv3List = [];
            const seenLv3 = new Set();
            availableLv3.forEach(item => {
                if (seenLv3.has(item.lv3)) return;
                seenLv3.add(item.lv3);
                const displayName = (appRegion === 'ko') ? `[${item.lv2Name}] ${item.lv3Name}` : `[${item.lv2}] ${item.lv3}`;
                uniqueLv3List.push({ ...item, displayName });
            });

            
            uniqueLv3List.sort((a, b) => a.displayName.localeCompare(b.displayName, 'ko-KR'));

            uniqueLv3List.forEach(item => {
                const div = document.createElement('div');
                div.style.padding = "8px 5px";
                div.style.fontSize = "11px";
                div.style.borderBottom = "1px solid #f5f5f5";

                div.innerHTML = `
                    <label style="cursor: pointer; display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" value="${item.lv3}" onchange="handleLv3Change(this)" ${selectedLv3Codes.has(item.lv3) ? 'checked' : ''} style="margin: 0;">
                        <span>${item.displayName} <span style="color: #888;">(${item.lv3})</span></span>
                    </label>
                `;
                container.appendChild(div);
            });
        }

        function handleLv3Change(checkbox) {
            const code = checkbox.value;
            
            const allCheck = document.getElementById('allProductCheck');
            if (allCheck && allCheck.checked) allCheck.checked = false;

            if (checkbox.checked) {
                selectedLv3Codes.add(code);
            } else {
                selectedLv3Codes.delete(code);
            }

            
            const allCheckboxes = document.querySelectorAll('#lv3List input[type="checkbox"]');
            const allChecked = Array.from(allCheckboxes).length > 0 && Array.from(allCheckboxes).every(cb => cb.checked);
            const selectAllCheck = document.getElementById('selectAllLv3');
            if (selectAllCheck) selectAllCheck.checked = allChecked;
        }

        function toggleSelectAllLv3(checkbox) {
            
            const allCheck = document.getElementById('allProductCheck');
            if (allCheck && allCheck.checked) allCheck.checked = false;

            const inputs = document.querySelectorAll('#lv3List input[type="checkbox"]');
            inputs.forEach(input => {
                input.checked = checkbox.checked;
                const val = input.value;
                if (checkbox.checked) {
                    selectedLv3Codes.add(val);
                } else {
                    selectedLv3Codes.delete(val);
                }
            });
        }

        function confirmProductSelection() {
            const postDataDiv = document.querySelector('.postData');

            
            const allCheck = document.getElementById('allProductCheck');
            if (allCheck && allCheck.checked) {
                postDataDiv.setAttribute('data-productlv2', "['ALL']");
                postDataDiv.setAttribute('data-productlv3', "['ALL']");
                document.getElementById('inProductFamily').value = 'ALL';
                closeProductModal();
                toggleClearBtn('inProductFamily', 'clearProduct');
                generateHTML();
                return;
            }

            
            const lv2Array = Array.from(selectedLv2Codes);
            const lv3Array = Array.from(selectedLv3Codes);

            
            const lv2Str = lv2Array.length > 0 ? "['" + lv2Array.join("', '") + "']" : "['ALL']";
            const lv3Str = lv3Array.length > 0 ? "['" + lv3Array.join("', '") + "']" : "['ALL']";

            postDataDiv.setAttribute('data-productlv2', lv2Str);
            postDataDiv.setAttribute('data-productlv3', lv3Str);

            let displayNames = [];
            const sourceData = (appRegion === 'ko') ? productData : globalExcelData;

            if (sourceData) {
                lv3Array.forEach(code => {
                    const item = sourceData.find(i => i.lv3 === code);
                    if (item) {
                        displayNames.push((appRegion === 'ko') ? item.lv3Name : item.lv3);
                    } else {
                        displayNames.push(code);
                    }
                });
            }

            if (displayNames.length > 0) {
                document.getElementById('inProductFamily').value = displayNames.join(", ");
            } else {
                let lv2Names = [];
                if (sourceData) {
                    lv2Array.forEach(code => {
                        const item = sourceData.find(i => i.lv2 === code);
                        if (item) {
                            const name = (appRegion === 'ko') ? item.lv2Name : item.lv2;
                            if (!lv2Names.includes(name)) lv2Names.push(name);
                        }
                    });
                }
                document.getElementById('inProductFamily').value = lv2Names.length > 0 ? lv2Names.join(", ") : '';
            }

            closeProductModal();
            toggleClearBtn('inProductFamily', 'clearProduct');
            generateHTML();
        }

        

        function openModelModal() {
            if (selectedLv3Codes.size === 0) {
                alert("먼저 제품군(소분류)을 선택해 주세요.");
                return;
            }

            
            const lv3Names = [];
            const sourceData = (appRegion === 'ko') ? productData : globalExcelData;
            if (sourceData) {
                selectedLv3Codes.forEach(code => {
                    const item = sourceData.find(i => i.lv3 === code);
                    if (item) lv3Names.push((appRegion === 'ko') ? item.lv3Name : item.lv3);
                });
            }
            document.getElementById('modelFilterInfo').textContent = "선택된 제품군: " + lv3Names.join(", ");

            
            selectedCorpCd = 'ALL';
            const corpContainer = document.getElementById('corpFilterContainer');
            if (appRegion === 'global') {
                corpContainer.style.display = 'block';
                renderCorpCdFilter();
            } else {
                corpContainer.style.display = 'none';
            }

            document.getElementById('modelModal').style.display = "block";
            modelRenderLimit = 500;
            renderModelList();
        }

        function renderCorpCdFilter() {
            const select = document.getElementById('corpCdSelect');
            select.innerHTML = '<option value="ALL">★ ALL (전체 법인)</option>';

            if (appRegion !== 'global' || !globalExcelData) return;

            
            const corps = new Set();
            globalExcelData.forEach(item => {
                if (selectedLv3Codes.has(item.lv3) && item.corp) {
                    corps.add(item.corp);
                }
            });

            
            const sortedCorps = Array.from(corps).sort();
            sortedCorps.forEach(code => {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = code;
                select.appendChild(opt);
            });
        }

        function handleCorpCdChange(select) {
            selectedCorpCd = select.value;
            modelRenderLimit = 500;
            renderModelList();
        }

        function closeModelModal() {
            document.getElementById('modelModal').style.display = "none";
        }

        
        function toggleAllProduct(checkbox) {
            if (checkbox.checked) {
                
                selectedLv2Codes.clear();
                selectedLv3Codes.clear();
                
                document.querySelectorAll('#lv2List input[type="checkbox"]').forEach(cb => cb.checked = false);
                
                renderLv3List();
            }
        }

        function toggleAllModels(checkbox) {
            if (checkbox.checked) {
                
                selectedModels.clear();
                document.querySelectorAll('#modelList input[type="checkbox"]').forEach(cb => cb.checked = false);
                const selectAll = document.getElementById('selectAllModels');
                if (selectAll) selectAll.checked = false;
                updateModelCount();
            }
        }

        function toggleSelectAllModels(checkbox) {
            
            const allCheck = document.getElementById('allModelsCheck');
            if (allCheck && allCheck.checked) {
                allCheck.checked = false;
                selectedModels.clear();
            }
            const inputs = document.querySelectorAll('#modelList input[type="checkbox"]');
            inputs.forEach(input => {
                input.checked = checkbox.checked;
            });
            currentFilteredModels.forEach(item => {
                const val = item.model;
                if (checkbox.checked) selectedModels.add(val);
                else selectedModels.delete(val);
            });
            updateModelCount();
        }

        function renderModelList() {
            const container = document.getElementById('modelList');
            const search = document.getElementById('modelSearchInput').value.toUpperCase();

            container.innerHTML = "";

            
            const currentData = (appRegion === 'ko') ? (typeof globalModelData !== 'undefined' ? globalModelData : null) : globalExcelData;

            if (!currentData) {
                container.innerHTML = '<div style="text-align:center; padding: 20px; color: #888;">모델 데이터를 불러오는 중이거나 찾을 수 없습니다.</div>';
                return;
            }

            
            currentFilteredModels = currentData.filter(item => {
                
                if (!selectedLv3Codes.has(item.lv3)) return false;

                
                if (appRegion === 'global' && selectedCorpCd !== 'ALL') {
                    if (item.corp !== selectedCorpCd) return false;
                }

                
                if (search && !item.model.toUpperCase().includes(search)) return false;
                return true;
            });

            if (currentFilteredModels.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding: 20px; color: #888;">표시할 모델이 없습니다.</div>';
                document.getElementById('selectAllModels').checked = false;
                return;
            }

            
            const fragment = document.createDocumentFragment();

            
            const modelsToRender = currentFilteredModels.slice(0, modelRenderLimit);

            modelsToRender.forEach(item => {
                const div = document.createElement('div');
                div.style.padding = "5px";
                div.style.fontSize = "12px";
                div.style.borderBottom = "1px solid #eee";

                const isChecked = selectedModels.has(item.model) ? 'checked' : '';

                div.innerHTML = `
                    <label style="cursor: pointer; display: block;">
                        <input type="checkbox" value="${item.model}" onchange="handleModelChange(this)" ${isChecked}>
                        <span style="font-weight: bold;">${item.model}</span> 
                        <span style="color: #999; font-size: 11px;">(${item.lv3})</span>
                    </label>
                `;
                fragment.appendChild(div);
            });

            container.appendChild(fragment);

            if (currentFilteredModels.length > modelRenderLimit) {
                const moreBtnContainer = document.createElement('div');
                moreBtnContainer.style.textAlign = 'center';
                moreBtnContainer.style.padding = '15px';

                const moreBtn = document.createElement('button');
                moreBtn.className = 'btn-secondary';
                moreBtn.style.padding = '8px 20px';
                moreBtn.style.fontSize = '12px';
                moreBtn.style.cursor = 'pointer';
                moreBtn.innerHTML = `더 보기 (${currentFilteredModels.length - modelRenderLimit}개의 검색된 모델이 더 있습니다)`;
                moreBtn.onclick = function () {
                    modelRenderLimit += 500;
                    renderModelList();
                };

                moreBtnContainer.appendChild(moreBtn);
                container.appendChild(moreBtnContainer);
            }

            
            const allFilteredSelected = currentFilteredModels.length > 0 && currentFilteredModels.every(m => selectedModels.has(m.model));
            document.getElementById('selectAllModels').checked = allFilteredSelected;
        }

        function filterModelList() {
            modelRenderLimit = 500;
            renderModelList();
        }

        function handleModelChange(checkbox) {
            const val = checkbox.value;
            
            const allCheck = document.getElementById('allModelsCheck');
            if (allCheck && allCheck.checked) allCheck.checked = false;
            if (checkbox.checked) {
                selectedModels.add(val);
            } else {
                selectedModels.delete(val);
            }
            updateModelCount();

            
            if (currentFilteredModels && currentFilteredModels.length > 0) {
                const allFilteredSelected = currentFilteredModels.every(m => selectedModels.has(m.model));
                document.getElementById('selectAllModels').checked = allFilteredSelected;
            }
        }

        function updateModelCount() {
            document.getElementById('modelCountBadge').textContent = `${selectedModels.size}개 선택됨`;
        }

        function confirmModelSelection() {
            
            const allCheck = document.getElementById('allModelsCheck');
            if (allCheck && allCheck.checked) {
                const postDataDiv = document.querySelector('.postData');
                postDataDiv.setAttribute('data-model', "['ALL']");
                document.getElementById('inAppliedModel').value = 'ALL';
                closeModelModal();
                toggleClearBtn('inAppliedModel', 'clearModel');
                generateHTML();
                return;
            }

            const modelArray = Array.from(selectedModels);

            
            if (modelArray.length > 6) {
                const firstSix = modelArray.slice(0, 6).join(", ");
                const remaining = modelArray.length - 6;
                document.getElementById('inAppliedModel').value = `${firstSix} 외 ${remaining}개`;
            } else {
                document.getElementById('inAppliedModel').value = modelArray.join(", ");
            }

            
            const postDataDiv = document.querySelector('.postData');

            if (modelArray.length > 0) {
                const modelStr = "['" + modelArray.join("', '") + "']";
                postDataDiv.setAttribute('data-model', modelStr);
            } else {
                postDataDiv.setAttribute('data-model', "['ALL']");
            }

            closeModelModal();
            toggleClearBtn('inAppliedModel', 'clearModel');
            generateHTML();
        }


        let modelSet = null;
        let lastSetRegion = null;
        function getModelSet() {
            const currentRegion = appRegion;
            const currentData = (currentRegion === 'ko') ? (typeof globalModelData !== 'undefined' ? globalModelData : null) : globalExcelData;

            if (!currentData) return null;

            
            if (!modelSet || lastSetRegion !== currentRegion) {
                modelSet = new Set(currentData.map(item => item.model.toUpperCase()));
                lastSetRegion = currentRegion;
            }
            return modelSet;
        }

        function syncModelData() {
            const input = document.getElementById('inAppliedModel');
            
            

            const val = input.value;
            const postDataDiv = document.querySelector('.postData');

            if (!val.trim()) {
                postDataDiv.setAttribute('data-model', "['ALL']");
                return;
            }

            
            const models = val.split(',').map(m => m.trim()).filter(m => m !== "");
            if (models.length > 0) {
                const modelStr = "['" + models.join("', '") + "']";
                postDataDiv.setAttribute('data-model', modelStr);
            } else {
                postDataDiv.setAttribute('data-model', "['ALL']");
            }
        }

        function validateModelInput() {
            const input = document.getElementById('inAppliedModel');
            const val = input.value.trim();
            if (!val) return;

            const models = val.split(',').map(m => m.trim().toUpperCase()).filter(m => m !== "");
            const set = getModelSet();

            if (!set) return;

            const invalidModels = models.filter(m => !set.has(m));

            if (invalidModels.length > 0) {
                alert(`존재하지 않는 모델이 포함되어 있습니다: ${invalidModels.join(", ")}\n모델명을 다시 검색하여 확인해 주세요.`);
            }
        }

        function toggleClearBtn(inputId, clearBtnId) {
            const input = document.getElementById(inputId);
            const clearBtn = document.getElementById(clearBtnId);
            if (input && clearBtn) {
                if (input.value.trim() !== "") {
                    clearBtn.style.display = 'inline-block';
                } else {
                    clearBtn.style.display = 'none';
                }
            }
        }

        function clearProductFamily() {
            if (typeof selectedLv2Codes !== 'undefined') selectedLv2Codes.clear();
            if (typeof selectedLv3Codes !== 'undefined') selectedLv3Codes.clear();
            document.getElementById('inProductFamily').value = "";

            const postDataDiv = document.querySelector('.postData');
            if (postDataDiv) {
                postDataDiv.setAttribute('data-productlv2', "['ALL']");
                postDataDiv.setAttribute('data-productlv3', "['ALL']");
            }

            toggleClearBtn('inProductFamily', 'clearProduct');
            if (typeof generateHTML === 'function') generateHTML();
        }

        function clearAppliedModel() {
            if (typeof selectedModels !== 'undefined') selectedModels.clear();
            document.getElementById('inAppliedModel').value = "";

            const postDataDiv = document.querySelector('.postData');
            if (postDataDiv) {
                postDataDiv.setAttribute('data-model', "['ALL']");
            }

            toggleClearBtn('inAppliedModel', 'clearModel');
            if (typeof generateHTML === 'function') generateHTML();
        }
    