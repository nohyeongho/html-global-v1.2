
        // Global을 위한 전역 상태
        let appRegion = 'ko'; // 'ko' or 'global'
        // globalExcelData는 외부 스크립트(global-model-data.js)에서 이미 선언되어 로드됩니다.
        // 언어 선택 상태 관리 (UI 토글용)
        async function changeAppLanguage(lang) {
            const koBtn = document.getElementById('btnLangKo');
            const enBtn = document.getElementById('btnLangEn');

            if (lang === 'ko') {
                appRegion = 'ko';
                koBtn.classList.add('active');
                enBtn.classList.remove('active');
            } else {
                appRegion = 'global';
                enBtn.classList.add('active');
                koBtn.classList.remove('active');

                // Global 선택 시 엑셀 데이터 로드 시도
                if (!globalExcelData) {
                    await loadGlobalExcelData();
                } else {
                    // 이미 로드된 경우 리스트 갱신
                    renderLv2List();
                }
            }

            // 지역 전환 시 기존 선택값 초기화 (데이터셋이 다르므로 필수)
            clearProductFamily();
            clearAppliedModel();

            console.log('Selected Region:', appRegion);
        }

        async function loadGlobalExcelData() {
            // 이미 global-model-data.js가 <script> 태그로 로드되어 window.globalExcelData에 담겨 있습니다.
            if (typeof globalExcelData !== 'undefined' && globalExcelData !== null) {
                console.log('Global model data already loaded from JS file:', globalExcelData.length, 'rows');
                return;
            }

            console.warn('globalExcelData not found. JS file might be missing or failed to load.');

            // 만약 로드되지 않았다면 기존처럼 수동 선택 안내만 남김 (HTML 파서 제거로 인해 수동 선택도 제약될 수 있음)
            if (confirm('Global 모델 데이터(global-model-data.js)를 찾을 수 없습니다. 파일을 확인해 주세요.')) {
                // 수동 선택 기능은 현재 비활성화됨
            } else {
                changeAppLanguage('ko');
            }
        }

        // Note: global-model-data.js 방식으로 전환되어 엑셀 파싱 로직이 제거
        // Custom renderer to wrap tables in .tbl-scroll div
        const renderer = new marked.Renderer();
        renderer.table = function (header, body) {
            return `
<div class="tbl-scroll">
<table style="width: 600px; border-collapse: collapse;" class="xfe_just_info">
<thead>${header}</thead>
<tbody>${body}</tbody>
</table>
</div>`;
        };

        renderer.tablecell = function (content, flags) {
            const type = flags.header ? 'th' : 'td';
            const tag = flags.header ? '<th scope="col">' : '<td>';
            return tag + content + `</${type}>\n`;
        };

        renderer.image = function (href, title, text) {
            return `<div class="img-only">\n<img src="${href}" alt="${text || ''}" class="xfe_just_info"/>\n</div>`;
        };

        renderer.paragraph = function (text) {
            if (text.startsWith('<div class="img-only">') || text.startsWith('<div class="tbl-scroll">')) {
                return text + '\n';
            }
            return '<p>' + text + '</p>\n';
        };

        marked.setOptions({
            breaks: true,
            gfm: true,
            renderer: renderer
        });

        // --- Shared Toolbar HTML ---
        const TOOLBAR_HTML = `
            <select onchange="changeFontFamily(this)" class="font-family-select" onmousedown="event.stopPropagation()">
                <option value="'LG Smart UI Regular', 'LG Smart UI', '맑은 고딕'" selected>LG 스마트체</option>
                <option value="맑은 고딕">맑은 고딕</option>
                <option value="돋움">돋움</option>
                <option value="굴림">굴림</option>
                <option value="바탕">바탕</option>
                <option value="Arial">Arial</option>
            </select>
            <select onchange="changeFontSize(this)" class="font-size-select" id="fontSizeSelect" onmousedown="event.stopPropagation()">
                <option value="6px">6</option><option value="8px">8</option><option value="9px">9</option>
                <option value="10px">10</option><option value="11px" selected>11</option><option value="12px">12</option>
                <option value="14px">14</option><option value="16px">16</option><option value="18px">18</option>
                <option value="20px">20</option><option value="22px">22</option><option value="24px">24</option>
                <option value="26px">26</option><option value="28px">28</option><option value="36px">36</option>
                <option value="48px">48</option>
            </select>
            <button onclick="stepFontSize(1)" class="btn-font-step" onmousedown="event.preventDefault()">가<span>+</span></button>
            <button onclick="stepFontSize(-1)" class="btn-font-step" onmousedown="event.preventDefault()">가<span>-</span></button>
            <div class="color-tool-split">
                <button class="color-btn-main" onclick="applyLastColor('foreColor', event)" onmousedown="event.preventDefault()"><div class="color-icon-wrapper"><b>가</b><div class="color-bar" style="background-color: red;"></div></div></button>
                <button class="color-btn-arrow" onclick="openColorTool('foreColor', event)" onmousedown="event.preventDefault()"><i class="fas fa-caret-down"></i></button>
            </div>
            <button onclick="insertFormat('bold')" onmousedown="event.preventDefault()"><i class="fas fa-bold"></i></button>
            <button onclick="insertFormat('italic')" onmousedown="event.preventDefault()"><i class="fas fa-italic"></i></button>
            <button onclick="insertFormat('insertUnorderedList')" onmousedown="event.preventDefault()"><i class="fas fa-list-ul"></i></button>
            <button onclick="insertFormat('insertOrderedList')" onmousedown="event.preventDefault()"><i class="fas fa-list-ol"></i></button>
            <button onclick="openTableModal(event)" onmousedown="event.preventDefault()"><i class="fas fa-table"></i></button>
            <div class="toolbar-divider"></div>
            <div class="toolbar-size-group">
                <span class="toolbar-label">크기:</span>
                <i class="fas fa-arrows-alt-v" style="font-size:10px; color:#aaa;"></i>
                <input type="number" class="ed-toolbar-h" placeholder="높이" step="2" title="높이(px)" oninput="applyManualSizeToElement(this, 'height')" onmousedown="event.stopPropagation()">
                <i class="fas fa-arrows-alt-h" style="font-size:10px; color:#aaa;"></i>
                <input type="number" class="ed-toolbar-w" placeholder="너비" step="2" title="너비(px)" oninput="applyManualSizeToElement(this, 'width')" onmousedown="event.stopPropagation()">
            </div>
        `;

        // --- Editor Core ---
        let lastFocusedEditor = null, selectionRange = null, activeToolbar = null, activeColorType = 'foreColor';
        let isRestoringSelection = false;
        // Editor Table Resize Variables
        let edIsRowResizing = false, edIsColResizing = false, edIsImgResizing = false;
        let edStartX, edStartY, edStartW, edStartH, edStartTableW, edStartImgW;
        let edTargetCell = null, edTargetRow = null, edTargetImg = null, edImgCorner = '';
        let edIsPendingColResize = false, edIsPendingRowResize = false, edIsPendingImgResize = false;

        function saveSelectionState() {
            if (isRestoringSelection) return;
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const newRange = sel.getRangeAt(0);
                // 커서 위치가 바뀌면 수동 변경 모드 해제
                if (selectionRange && (newRange.startContainer !== selectionRange.startContainer || newRange.startOffset !== selectionRange.startOffset)) {
                    window.isManualFontSizeChange = false;
                }
                selectionRange = newRange.cloneRange();
                syncFontSize();
            }
        }
        function restoreSelectionState() {
            if (selectionRange && lastFocusedEditor) {
                isRestoringSelection = true;
                lastFocusedEditor.focus();
                const sel = window.getSelection();
                sel.removeAllRanges(); sel.addRange(selectionRange);
                setTimeout(() => { isRestoringSelection = false; }, 10);
            } else if (lastFocusedEditor) lastFocusedEditor.focus();
        }

        function syncFontSize() {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                let node = sel.anchorNode;
                if (node && node.nodeType === 3) node = node.parentElement;
                if (node) {
                    const fs = window.getComputedStyle(node).fontSize;
                    const selects = document.querySelectorAll('.font-size-select');

                    // 수동 변경 직후라면 자동 동기화를 한 번 건너뜀 (사용자 선택 유지)
                    if (window.isManualFontSizeChange) {
                        return;
                    }

                    selects.forEach(select => {
                        const px = parseInt(fs) + 'px';
                        const sizes = ['6px', '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px'];
                        if (sizes.includes(px)) {
                            select.value = px;
                        } else {
                            const num = parseInt(fs);
                            let closest = '12px', minDiff = 999;
                            sizes.forEach(s => { const diff = Math.abs(parseInt(s) - num); if (diff < minDiff) { minDiff = diff; closest = s; } });
                            select.value = closest;
                        }
                    });
                }
            }
        }

        function insertFormat(cmd, val = null) {
            if (document.activeElement !== lastFocusedEditor) restoreSelectionState();
            document.execCommand(cmd, false, val);
        }

        function insertHTML(html) {
            if (document.activeElement !== lastFocusedEditor) restoreSelectionState();
            document.execCommand('insertHTML', false, html);
        }

        function changeFontFamily(s) { restoreSelectionState(); document.execCommand('fontName', false, s.value); }

        function changeFontSize(s) {
            restoreSelectionState();
            const val = typeof s === 'string' ? s : s.value;
            window.isManualFontSizeChange = true;
            applyStyleToSelection('fontSize', val);
        }

        function applyStyleToSelection(type, val) {
            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) return;
            const range = sel.getRangeAt(0);

            if (type === 'fontSize') {
                if (range.collapsed) {
                    const span = document.createElement('span');
                    span.style.fontSize = val;
                    span.appendChild(document.createTextNode('\u200B'));
                    range.insertNode(span);
                    range.setStart(span.firstChild, 1); // ZWSP 뒤로
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else {
                    document.execCommand('styleWithCSS', false, true);
                    document.execCommand('fontSize', false, '7');
                    if (lastFocusedEditor) {
                        const markers = lastFocusedEditor.querySelectorAll('font[size="7"], span[style*="font-size: xxx-large"], span[style*="font-size: -webkit-xxx-large"]');
                        markers.forEach(el => {
                            el.style.fontSize = val;
                            if (el.tagName === 'FONT') el.removeAttribute('size');
                            el.querySelectorAll('[style*="font-size"]').forEach(inner => { inner.style.fontSize = 'inherit'; });
                        });
                    }
                }
                document.querySelectorAll('.font-size-select').forEach(sel => sel.value = val);
            }
            saveSelectionState();
        }

        function stepFontSize(d) {
            const sizes = ['6px', '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px'];
            const select = document.querySelector('.font-size-select');
            if (!select) return;
            let curIdx = sizes.indexOf(select.value);
            if (curIdx === -1) {
                const curSizeNum = parseInt(select.value) || 12;
                curIdx = sizes.findIndex(s => parseInt(s) >= curSizeNum);
            }
            const nextIdx = Math.max(0, Math.min(sizes.length - 1, curIdx + d));
            changeFontSize(sizes[nextIdx]);
        }

        function clearEditor(btn) {
            const container = btn.closest('.editor-container');
            if (container) {
                const editor = container.querySelector('.editor-content-view');
                if (editor && confirm('내용을 지우시겠습니까?')) {
                    editor.innerHTML = '';
                    editor.focus();
                }
            }
        }

        function clearTextarea(btn) { clearEditor(btn); }

        // --- Colors ---
        function applyLastColor(type, e) {
            e.stopPropagation(); activeColorType = type;
            const color = e.currentTarget.querySelector('.color-bar').style.backgroundColor || 'red';
            if (type === 'foreColor') changeColor(color); else changeBgColor(color);
        }
        function openColorTool(type, e) {
            e.stopPropagation(); activeColorType = type;
            activeToolbar = e.currentTarget.closest('.color-tool-split');
            const p = document.getElementById('customColorPicker'), r = e.currentTarget.getBoundingClientRect();
            p.style.display = 'block'; p.style.top = (window.scrollY + r.bottom + 5) + 'px';
            p.style.left = Math.min(r.left, window.innerWidth - 275) + 'px';
        }
        function changeColor(c) {
            restoreSelectionState();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && sel.getRangeAt(0).collapsed && lastFocusedEditor) {
                const span = document.createElement('span');
                span.style.color = c;
                span.appendChild(document.createTextNode('\u200B'));
                const range = sel.getRangeAt(0);
                range.insertNode(span);
                range.setStart(span.firstChild, 1);
                range.collapse(true);
                sel.removeAllRanges(); sel.addRange(range);
            } else {
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('foreColor', false, c);
            }
            document.querySelectorAll('.color-bar').forEach(b => b.style.backgroundColor = c);
        }
        function changeBgColor(c) {
            restoreSelectionState();
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('hiliteColor', false, c);
            document.querySelectorAll('.color-bar').forEach(b => b.style.backgroundColor = c);
        }
        function selectQuickColor(c) {
            if (activeColorType === 'foreColor') changeColor(c); else changeBgColor(c);
            document.getElementById('customColorPicker').style.display = 'none';
        }
        function triggerNativeColorInput() { document.getElementById('nativeColorInput').click(); }

        function initColorPicker() {
            const theme = ['#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6d9f0', '#dbe5f1', '#f2dcdb', '#ebf1de', '#e5e0ec', '#dbeef3', '#fdeada', '#d8d8d8', '#595959', '#c4bd97', '#8db3e2', '#b8cce4', '#e5b9b7', '#d7e3bc', '#ccc1d9', '#b7dde8', '#fbd5b5', '#bfbfbf', '#3f3f3f', '#938953', '#548dd4', '#95b3d7', '#d99694', '#c3d69b', '#b2a2c7', '#92cddc', '#fac08f', '#a5a5a5', '#262626', '#494429', '#17365d', '#366092', '#953734', '#76923c', '#5f497a', '#31859b', '#e36c09', '#7f7f7f', '#0c0c0c', '#1d1b10', '#0f243e', '#244061', '#632423', '#4f6128', '#3f3151', '#205867', '#974806'];
            const std = ['#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'];
            const tg = document.getElementById('themeColorsGrid'), sg = document.getElementById('standardColorsRow');
            theme.forEach(c => { const d = document.createElement('div'); d.className = 'cp-cell'; d.style.backgroundColor = c; d.onclick = () => selectQuickColor(c); tg.appendChild(d); });
            std.forEach(c => { const d = document.createElement('div'); d.className = 'cp-cell'; d.style.backgroundColor = c; d.onclick = () => selectQuickColor(c); sg.appendChild(d); });
            document.addEventListener('click', () => document.getElementById('customColorPicker').style.display = 'none');
            document.getElementById('customColorPicker').onclick = e => e.stopPropagation();
        }

        // Bind paste events to existing paste-areas
        document.querySelectorAll('.paste-area').forEach(el => {
            el.addEventListener('paste', handleContentPaste);
            el.addEventListener('focus', () => { lastFocusedEditor = el; saveSelectionState(); });
            el.addEventListener('mouseup', saveSelectionState);
            el.addEventListener('keyup', () => {
                // 글자를 입력하기 시작하면 수동 변경 모드 해제 (스타일이 입혀졌으므로)
                window.isManualFontSizeChange = false;
                saveSelectionState();
            });
        });

        // Inject toolbar HTML into all editor-toolbar divs and init color picker
        document.querySelectorAll('.editor-toolbar').forEach(tb => { tb.innerHTML = TOOLBAR_HTML; });
        initColorPicker();

        // --- Editor Content Table Resize (Row & Column) ---
        let edNextStartW = 0, edNextRowStartH = 0;
        window.addEventListener('mousedown', function (e) {
            const cell = e.target.closest('.editor-content-view td, .editor-content-view th');
            if (cell) {
                const rect = cell.getBoundingClientRect();
                const isRightEdge = Math.abs(e.clientX - rect.right) < 10;
                const isLeftEdge = Math.abs(e.clientX - rect.left) < 10;
                const isBottomEdge = Math.abs(e.clientY - rect.bottom) < 10;
                const tbl = cell.closest('table');
                if (!tbl) return;

                // --- Editor Element Tracking (단순 클릭 시에도 툴바 업데이트) ---
                updateActiveElementForToolbar(tbl);

                if (isRightEdge || isLeftEdge || isBottomEdge) {
                    edStartX = e.clientX;
                    edStartY = e.clientY;
                    if (isRightEdge || isLeftEdge) {
                        edIsPendingColResize = true;
                        // 왼쪽 경계선을 잡았을 경우 이전 셀을 타겟팅
                        edTargetCell = isRightEdge ? cell : cell.previousElementSibling;
                        if (!edTargetCell && isLeftEdge) edTargetCell = cell;
                    }
                    if (isBottomEdge) {
                        edIsPendingRowResize = true;
                        edTargetRow = cell.parentElement;
                    }
                    document.body.style.userSelect = 'none';
                    return;
                }
            }

            // --- Editor Image Resize Initial ---
            const img = e.target.closest('.editor-content-view img');
            if (img) {
                const iRect = img.getBoundingClientRect();
                const pad = 20;
                const isL = e.clientX < iRect.left + pad;
                const isR = e.clientX > iRect.right - pad;
                const isT = e.clientY < iRect.top + pad;
                const isB = e.clientY > iRect.bottom + pad; // Wait, rect.bottom is absolute, so e.clientY > rect.bottom - pad is correct
                // Correct coordinate check:
                const isLeft = (e.clientX - iRect.left) < pad;
                const isRight = (iRect.right - e.clientX) < pad;
                const isTop = (e.clientY - iRect.top) < pad;
                const isBottom = (iRect.bottom - e.clientY) < pad;

                if ((isLeft || isRight) && (isTop || isBottom)) {
                    updateActiveElementForToolbar(img);
                    edStartX = e.clientX;
                    edIsPendingImgResize = true;
                    edTargetImg = img;
                    edStartImgW = iRect.width;
                    // 기존에 박혀있을 수 있는 고정 width 속성 제거 (스타일 우선 적용을 위해)
                    img.removeAttribute('width');
                    img.style.height = 'auto';
                    if (isLeft && isTop) edImgCorner = 'tl';
                    else if (isRight && isTop) edImgCorner = 'tr';
                    else if (isLeft && isBottom) edImgCorner = 'bl';
                    else if (isRight && isBottom) edImgCorner = 'br';

                    document.body.style.userSelect = 'none';
                    e.preventDefault();
                    return;
                } else {
                    // 리사이즈 영역은 아니지만 이미지를 클릭했을 때 툴바 값 업데이트
                    updateActiveElementForToolbar(img);
                }
            }
        });

        let edActiveElement = null; // 현재 선택된 리사이즈 대상 (표/이미지)

        function updateActiveElementForToolbar(el) {
            edActiveElement = el;
            if (!el) return;

            // 모든 에디터 툴바의 수치를 동기화하여 사용자 혼동 방지
            const w = Math.round(el.offsetWidth);
            const h = Math.round(el.offsetHeight);

            document.querySelectorAll('.ed-toolbar-w').forEach(inp => inp.value = w);
            document.querySelectorAll('.ed-toolbar-h').forEach(inp => inp.value = h);
        }

        function applyManualSizeToElement(input, type) {
            if (!edActiveElement) return;
            const val = input.value;
            if (!val) return;

            if (edActiveElement.tagName === 'TABLE') {
                if (type === 'width') {
                    edActiveElement.style.width = val + 'px';
                    edActiveElement.style.tableLayout = 'fixed';
                    // 첫 번째 행의 셀 너비들도 균형있게 조정 (에디터 내 테이블 특성)
                    const firstRow = edActiveElement.rows[0];
                    if (firstRow) {
                        const cellCount = firstRow.cells.length;
                        const avgW = val / cellCount;
                        for (let c of firstRow.cells) c.style.width = avgW + 'px';
                    }
                } else {
                    edActiveElement.style.height = val + 'px';
                    const avgH = val / edActiveElement.rows.length;
                    for (let row of edActiveElement.rows) {
                        row.style.height = avgH + 'px';
                        for (let cell of row.cells) cell.style.height = avgH + 'px';
                    }
                }
            } else if (edActiveElement.tagName === 'IMG') {
                if (type === 'width') {
                    edActiveElement.style.width = val + 'px';
                    edActiveElement.setAttribute('width', val);
                } else {
                    edActiveElement.style.height = val + 'px';
                }
            }
        }

        function edStartColResize(e) {
            if (!edTargetCell) return;
            const tbl = edTargetCell.closest('table');
            if (!tbl) return;
            edIsColResizing = true;

            // 핵심: 리사이즈를 방해하는 모든 제약 해제 (줄바꿈 허용 포함)
            tbl.querySelectorAll('td, th').forEach(c => {
                c.style.minWidth = '0';
                c.style.maxWidth = 'none';
                c.style.whiteSpace = 'normal';
            });

            const colIdx = edTargetCell.cellIndex;
            const cellRect = edTargetCell.getBoundingClientRect();
            edStartW = cellRect.width;
            const tblRect = tbl.getBoundingClientRect();
            edStartTableW = tblRect.width;

            const firstRow = tbl.rows[0];
            if (firstRow) {
                for (let i = 0; i < firstRow.cells.length; i++) {
                    firstRow.cells[i].style.width = firstRow.cells[i].getBoundingClientRect().width.toFixed(2) + 'px';
                }
            }
            tbl.style.width = edStartTableW.toFixed(2) + 'px';
            tbl.style.tableLayout = 'fixed';
            document.body.style.cursor = 'ew-resize';
        }

        function edStartRowResize() {
            if (!edTargetRow) return;
            edIsRowResizing = true;

            const tbl = edTargetRow.closest('table');
            tbl.querySelectorAll('tr, td, th').forEach(el => {
                el.style.minHeight = '0';
                el.style.maxHeight = 'none';
            });

            edStartH = edTargetRow.offsetHeight;
            const nextRow = edTargetRow.nextElementSibling;
            edNextRowStartH = nextRow ? nextRow.offsetHeight : 0;
            document.body.style.cursor = 'ns-resize';
        }

        let edMouseTimer = null;
        window.addEventListener('mousemove', function (e) {
            const curX = e.clientX, curY = e.clientY;

            if (e.buttons === 0 && (edIsColResizing || edIsRowResizing || edIsImgResizing || edIsPendingColResize || edIsPendingRowResize || edIsPendingImgResize)) {
                edIsColResizing = edIsRowResizing = edIsImgResizing = false;
                edIsPendingColResize = edIsPendingRowResize = edIsPendingImgResize = false;
                document.body.style.cursor = ''; document.body.style.userSelect = '';
                return;
            }

            if (edMouseTimer) return;
            edMouseTimer = requestAnimationFrame(function () {
                if (!edIsColResizing && !edIsRowResizing && !edIsImgResizing) {
                    if (edIsPendingColResize || edIsPendingRowResize) {
                        const dist = Math.sqrt(Math.pow(curX - edStartX, 2) + Math.pow(curY - edStartY, 2));
                        if (dist > 3) {
                            if (edIsPendingColResize) edStartColResize(e);
                            if (edIsPendingRowResize) edStartRowResize();
                        }
                    } else if (edIsPendingImgResize && edTargetImg) {
                        const dist = Math.abs(curX - edStartX);
                        if (dist > 3) {
                            edIsImgResizing = true;
                            document.body.style.cursor = 'nwse-resize';
                        }
                    }
                }

                if (edIsImgResizing && edTargetImg) {
                    const diff = curX - edStartX;
                    let newW = edStartImgW;
                    if (edImgCorner === 'tr' || edImgCorner === 'br') {
                        newW = edStartImgW + diff;
                    } else if (edImgCorner === 'tl' || edImgCorner === 'bl') {
                        newW = edStartImgW - diff;
                    }
                    const finalW = Math.max(30, newW);
                    edTargetImg.style.width = finalW + 'px';
                    edTargetImg.setAttribute('width', finalW);
                    updateActiveElementForToolbar(edTargetImg);
                } else {
                    if (edIsColResizing && edTargetCell) {
                        const diff = curX - edStartX;
                        const tbl = edTargetCell.closest('table');
                        if (tbl && tbl.rows.length > 0) {
                            const colIdx = edTargetCell.cellIndex;
                            const newW = Math.max(30, edStartW + diff);
                            const masterCell = tbl.rows[0].cells[colIdx];
                            if (masterCell) masterCell.style.width = newW + 'px';
                            tbl.style.width = (edStartTableW + (newW - edStartW)) + 'px';
                            updateActiveElementForToolbar(tbl);
                        }
                    }
                    if (edIsRowResizing && edTargetRow) {
                        const diff = curY - edStartY;
                        const newH = Math.max(24, edStartH + diff);
                        edTargetRow.style.height = newH + 'px';
                        for (let i = 0; i < edTargetRow.cells.length; i++) {
                            edTargetRow.cells[i].style.height = newH + 'px';
                        }
                        updateActiveElementForToolbar(edTargetRow.closest('table'));
                    }
                }

                if (!edIsColResizing && !edIsRowResizing && !edIsImgResizing) {
                    const img = e.target.closest('.editor-content-view img');
                    if (img) {
                        const iRect = img.getBoundingClientRect();
                        const pad = 20;
                        const isLeft = (curX - iRect.left) < pad;
                        const isRight = (iRect.right - curX) < pad;
                        const isTop = (curY - iRect.top) < pad;
                        const isBottom = (iRect.bottom - curY) < pad;

                        if ((isLeft && isTop) || (isRight && isBottom)) {
                            img.style.cursor = 'nwse-resize';
                        } else if ((isRight && isTop) || (isLeft && isBottom)) {
                            img.style.cursor = 'nesw-resize';
                        } else {
                            img.style.cursor = '';
                        }
                    }

                    const cell = e.target.closest('.editor-content-view td, .editor-content-view th');
                    if (cell) {
                        const rect = cell.getBoundingClientRect();
                        const isRight = Math.abs(curX - rect.right) < 10;
                        const isLeft = Math.abs(curX - rect.left) < 10;
                        const isBottom = Math.abs(curY - rect.bottom) < 10;

                        if (isBottom && (isRight || isLeft)) {
                            cell.style.cursor = isRight ? 'nwse-resize' : 'nesw-resize';
                        } else if (isRight || isLeft) {
                            cell.style.cursor = 'ew-resize';
                        } else if (isBottom) {
                            cell.style.cursor = 'ns-resize';
                        } else {
                            cell.style.cursor = '';
                        }
                    }
                }
                edMouseTimer = null;
            });
        });

        window.addEventListener('mouseup', function () {
            edIsColResizing = edIsRowResizing = edIsImgResizing = false;
            edIsPendingColResize = edIsPendingRowResize = edIsPendingImgResize = false;
            document.body.style.cursor = ''; document.body.style.userSelect = '';

            // 수동 크기 변경 후 클릭했을 때, 해당 위치에 선택한 크기 강제 재적용
            if (window.isManualFontSizeChange) {
                const select = document.querySelector('.font-size-select');
                if (select) applyStyleToSelection('fontSize', select.value);
            }
        });

        // --- Table Modal Logic ---
        let lastFocusedTextarea = null;

        function openTableModal(e) {
            if (!lastFocusedEditor) { alert('표를 삽입할 위치를 먼저 클릭해주세요.'); return; }
            lastFocusedTextarea = lastFocusedEditor;
            document.getElementById('tableModal').style.display = 'block';
            generateVisualTable();
        }

        function closeTableModal() {
            document.getElementById('tableModal').style.display = 'none';
        }

        window.onclick = function (event) {
            if (event.target === document.getElementById('tableModal')) closeTableModal();
        };

        // --- Table Size Input Sync ---
        function syncSizeInputs(tbl) {
            if (!tbl) return;
            document.getElementById('tblTotalWidth').value = Math.round(tbl.offsetWidth);
            document.getElementById('tblTotalHeight').value = Math.round(tbl.offsetHeight);
        }

        function applyManualSize() {
            const tbl = document.querySelector('.visual-table');
            if (!tbl) return;
            const w = document.getElementById('tblTotalWidth').value;
            const h = document.getElementById('tblTotalHeight').value;

            if (w) tbl.style.width = w + 'px';
            if (h) {
                tbl.style.height = h + 'px';
                // 행 높이 균등 분할
                const rowH = h / tbl.rows.length;
                for (let row of tbl.rows) {
                    row.style.height = rowH + 'px';
                    for (let cell of row.cells) cell.style.height = rowH + 'px';
                }
            }
            tbl.style.tableLayout = 'fixed';
        }

        function generateVisualTable() {
            const r = parseInt(document.getElementById('tblRows').value);
            const c = parseInt(document.getElementById('tblCols').value);
            let h = '<table class="visual-table" cellspacing="0" cellpadding="0" style="border-collapse:collapse; border-spacing:0; width:auto;"><tbody>';
            for (let i = 0; i < r; i++) {
                h += '<tr>';
                for (let j = 0; j < c; j++) h += `<td style="border:1px solid #999; padding:4px 6px;"><div class="cell-input" contenteditable="true" data-placeholder="내용"></div></td>`;
                h += '</tr>';
            }
            h += '</tbody></table>';
            document.getElementById('visualTableContainer').innerHTML = h;

            const tbl = document.querySelector('.visual-table');
            if (tbl) {
                requestAnimationFrame(() => syncSizeInputs(tbl));
            }
            initTableResize();
        }

        function insertTableFromModal() {
            if (!lastFocusedTextarea) return;
            const mt = document.querySelector('.visual-table');
            if (!mt) return;
            const toHtml = v => v ? v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') : '&nbsp;';

            let out = `<div class="tbl-scroll">\n<table style="width: auto;" class="xfe_just_info">\n<tbody>\n`;
            const rows = Array.from(mt.querySelectorAll('tbody tr'));
            rows.forEach(row => {
                out += '<tr>\n';
                row.querySelectorAll('.cell-input').forEach(cell => {
                    out += `<td style="padding: 2px 8px; line-height: 1.2;">${toHtml(cell.innerText)}</td>\n`;
                });
                out += '</tr>\n';
            });
            out += '</tbody>\n</table>\n</div>\n<p><br></p>\n';
            lastFocusedTextarea.focus();
            insertHTML(out);
            closeTableModal();
        }

        // --- Table Resize (Row & Column) ---
        let tblStartX, tblStartY, tblStartW, tblStartH, tblStartTableW;
        let tblTargetCell = null, tblTargetRow = null;
        let isTblColResizing = false, isTblRowResizing = false;
        let isPendingTblColResize = false, isPendingTblRowResize = false;

        function initTableResize() {
            const container = document.getElementById('visualTableContainer');

            container.addEventListener('mousedown', function (e) {
                const cell = e.target.closest('td, th');
                if (!cell || !container.contains(cell)) return;
                const rect = cell.getBoundingClientRect();
                const isRight = Math.abs(e.clientX - rect.right) < 10;
                const isLeft = Math.abs(e.clientX - rect.left) < 10;
                const isBottom = Math.abs(e.clientY - rect.bottom) < 10;
                const tbl = cell.closest('table');
                if (!tbl) return;
                if (isRight || isLeft || isBottom) {
                    tblStartX = e.clientX; tblStartY = e.clientY;
                    if (isRight || isLeft) {
                        isPendingTblColResize = true;
                        tblTargetCell = isRight ? cell : cell.previousElementSibling;
                    }
                    if (isBottom) {
                        isPendingTblRowResize = true;
                        tblTargetRow = cell.parentElement;
                    }
                    document.body.style.userSelect = 'none';
                }
            });

            container.addEventListener('mousemove', function (e) {
                const curX = e.clientX, curY = e.clientY;

                if (!isTblColResizing && !isTblRowResizing) {
                    if (isPendingTblColResize || isPendingTblRowResize) {
                        const dist = Math.sqrt(Math.pow(curX - tblStartX, 2) + Math.pow(curY - tblStartY, 2));
                        if (dist > 3) {
                            if (isPendingTblColResize && tblTargetCell) {
                                isTblColResizing = true;
                                const tbl = tblTargetCell.closest('table');
                                const cellRect = tblTargetCell.getBoundingClientRect();
                                const tblRect = tbl.getBoundingClientRect();
                                tblStartW = cellRect.width;
                                tblStartTableW = tblRect.width;
                                const firstRow = tbl.rows[0];
                                if (firstRow) {
                                    for (let i = 0; i < firstRow.cells.length; i++) {
                                        firstRow.cells[i].style.width = firstRow.cells[i].getBoundingClientRect().width.toFixed(2) + 'px';
                                    }
                                }
                                tbl.style.width = tblStartTableW.toFixed(2) + 'px';
                                tbl.style.tableLayout = 'fixed';
                                document.body.style.cursor = 'ew-resize';
                                // 입력창 값 초기화 유도
                                syncSizeInputs(tbl);
                            }
                            if (isPendingTblRowResize && tblTargetRow) {
                                isTblRowResizing = true;
                                tblStartH = tblTargetRow.offsetHeight;
                                document.body.style.cursor = (isTblColResizing) ? 'nwse-resize' : 'ns-resize';
                            }
                        }
                    }
                }

                if (isTblColResizing && tblTargetCell) {
                    const diff = curX - tblStartX;
                    const newW = Math.max(30, tblStartW + diff);
                    const tbl = tblTargetCell.closest('table');
                    if (tbl && tbl.rows.length > 0) {
                        const colIdx = tblTargetCell.cellIndex;
                        const masterCell = tbl.rows[0].cells[colIdx];
                        if (masterCell) masterCell.style.width = newW + 'px';
                        tbl.style.width = (tblStartTableW + (newW - tblStartW)) + 'px';
                        syncSizeInputs(tbl);
                    }
                }
                if (isTblRowResizing && tblTargetRow) {
                    const diff = curY - tblStartY;
                    const newH = Math.max(24, tblStartH + diff);
                    const tbl = tblTargetRow.closest('table');
                    tblTargetRow.style.height = newH + 'px';
                    for (let i = 0; i < tblTargetRow.cells.length; i++) {
                        tblTargetRow.cells[i].style.height = newH + 'px';
                    }
                    if (tbl) syncSizeInputs(tbl);
                }
                if (!isTblColResizing && !isTblRowResizing) {
                    const cell = e.target.closest('#visualTableContainer td, #visualTableContainer th');
                    if (cell) {
                        const rect = cell.getBoundingClientRect();
                        const isRight = Math.abs(curX - rect.right) < 10;
                        const isLeft = Math.abs(curX - rect.left) < 10;
                        const isBottom = Math.abs(curY - rect.bottom) < 10;

                        if (isBottom && (isRight || isLeft)) {
                            cell.style.cursor = isRight ? 'nwse-resize' : 'nesw-resize';
                        } else if (isRight || isLeft) {
                            cell.style.cursor = 'ew-resize';
                        } else if (isBottom) {
                            cell.style.cursor = 'ns-resize';
                        } else {
                            cell.style.cursor = '';
                        }
                    }
                }
            });

            document.addEventListener('mouseup', function tblMouseUp() {
                if (isTblColResizing || isTblRowResizing || isPendingTblColResize || isPendingTblRowResize) {
                    isTblColResizing = false; isTblRowResizing = false;
                    isPendingTblColResize = false; isPendingTblRowResize = false;
                    tblTargetCell = null; tblTargetRow = null;
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                }
            });
        }

        // --- Paste Handling (Image & Excel & HTML) ---
        function handleContentPaste(e) {
            const d = e.clipboardData || e.originalEvent.clipboardData;
            const t = d.getData('text/plain');
            const h = d.getData('text/html');

            // 1. HTML 내용 (Excel, Word 등에서 복사)
            if (h) {
                e.preventDefault();
                processHTML(h);
                return;
            }

            // 2. 엑셀 형태 탭 구분 텍스트
            if (t && t.indexOf('\t') !== -1) {
                e.preventDefault();
                const lines = t.trim().split(/\r\n|\n|\r/), rows = lines.map(line => line.split('\t')), max = Math.max(...rows.map(r => r.length));
                let tableHtml = `<div class="tbl-scroll">\n<table style="width: auto;" class="xfe_just_info">\n<thead>\n<tr>\n`;
                rows[0].forEach(c => tableHtml += `<th style="padding: 2px 4px; line-height: 1.1; text-align: center; vertical-align: middle; font-size: 13px;">${(c || "").trim() || '&nbsp;'}</th>\n`);
                for (let j = rows[0].length; j < max; j++) tableHtml += `<th style="padding: 2px 4px; line-height: 1.1; text-align: center; vertical-align: middle; font-size: 13px;">&nbsp;</th>\n`;
                tableHtml += '</tr>\n</thead>\n<tbody>\n';
                for (let i = 1; i < rows.length; i++) {
                    tableHtml += '<tr>\n';
                    rows[i].forEach(c => tableHtml += `<td style="padding: 2px 4px; line-height: 1.1; text-align: center; vertical-align: middle; font-size: 13px;">${(c || "").trim() || '&nbsp;'}</td>\n`);
                    for (let j = rows[i].length; j < max; j++) tableHtml += `<td style="padding: 2px 4px; line-height: 1.2;">&nbsp;</td>\n`;
                    tableHtml += '</tr>\n';
                }
                tableHtml += '</tbody>\n</table>\n</div>\n<p><br></p>\n';
                insertHTML(tableHtml);
                return;
            }

            // 3. 이미지 파일
            for (let item of d.items) {
                if (item.kind === 'file' && item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        e.preventDefault();
                        const reader = new FileReader();
                        reader.onload = ev => {
                            const img = new Image();
                            img.onload = () => {
                                // 800px 제한 해제: 원본 크기를 기본으로 하며 툴바에서 자유롭게 조절 가능
                                const w = img.width;
                                const insertedHtml = `<span class="img-only"><img src="${ev.target.result}" style="width:${w}px;" class="xfe_just_info"></span>&nbsp;`;
                                insertHTML(insertedHtml);
                                // 삽입 직후 해당 이미지를 찾아 툴바 값 자동 입력
                                setTimeout(() => {
                                    const recentlyAddedImgs = document.querySelectorAll('.editor-content-view img');
                                    const latestImg = recentlyAddedImgs[recentlyAddedImgs.length - 1];
                                    if (latestImg) {
                                        updateActiveElementForToolbar(latestImg);
                                        // 시각적으로 선택되었음을 알리기 위해 툴바에 포커스 유도 가능 (선택 사항)
                                    }
                                }, 50);
                            };
                            img.src = ev.target.result;
                        };
                        reader.readAsDataURL(file);
                        return;
                    }
                }
            }

            // 4. 일반 텍스트
            if (t && t.trim().length > 0) {
                e.preventDefault();
                insertHTML(t.replace(/\n/g, '<br>'));
                return;
            }

            function processHTML(htmlText) {
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0';
                iframe.style.border = 'none'; iframe.style.visibility = 'hidden';
                document.body.appendChild(iframe);
                const doc = iframe.contentWindow.document;
                doc.open(); doc.write(htmlText); doc.close();
                doc.querySelectorAll('td, th, col, tr, table').forEach(el => {
                    const comp = iframe.contentWindow.getComputedStyle(el);
                    const bg = comp.backgroundColor;
                    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== 'rgb(255, 255, 255)') el.dataset.bg = bg;
                    el.dataset.ta = comp.textAlign;
                    el.dataset.va = comp.verticalAlign;
                    el.dataset.fw = comp.fontWeight;
                    const c = comp.color;
                    if (c && !(c.includes('rgb(0, 0, 0)') || c.includes('rgb(34, 34, 34)') || c.includes('gray'))) el.dataset.color = c;
                    const w = comp.width;
                    if (w && w !== 'auto' && parseFloat(w) > 0) el.dataset.w = w;
                    const h = comp.height;
                    if (h && h !== 'auto' && parseFloat(h) > 0) el.dataset.h = h;
                });
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = doc.body.innerHTML;
                document.body.removeChild(iframe);
                tempDiv.querySelectorAll('meta, style, script, link').forEach(el => el.remove());
                tempDiv.querySelectorAll('*').forEach(el => {
                    const tag = el.tagName.toLowerCase();
                    el.removeAttribute('class'); el.removeAttribute('id');
                    el.removeAttribute('face'); el.removeAttribute('size');
                    el.removeAttribute('width'); el.removeAttribute('height');
                    if (el.style) {
                        el.style.cssText = '';
                        if (tag === 'img') {
                            el.style.maxWidth = '100%'; el.style.height = 'auto';
                        } else if (tag === 'table') {
                            el.style.width = 'auto'; el.style.borderCollapse = 'collapse';
                        } else if (tag === 'td' || tag === 'th' || tag === 'col' || tag === 'tr') {
                            if (tag === 'td' || tag === 'th') {
                                // 셀 내부 텍스트의 좌우 공백 제거 (사용자 요청: 여백 최소화)
                                el.innerHTML = el.innerHTML.replace(/&nbsp;/g, ' ').trim().replace(/ +/g, ' ');
                                el.style.padding = '2px 4px'; el.style.lineHeight = '1.2'; el.style.fontSize = '13px';
                                el.style.border = '1px solid #ccc';
                                el.style.textAlign = 'center'; // 가운데 정렬 강제
                                el.style.verticalAlign = 'middle'; // 수직 중앙 강제
                            }
                            if (el.dataset.bg) el.style.backgroundColor = el.dataset.bg;
                            // 사용자 요청에 따라 원본(엑셀)의 정렬 데이터(dataset.ta)를 무시하고 무조건 가운데 정렬 유지
                            // if (el.dataset.ta) el.style.textAlign = el.dataset.ta; 
                            // if (el.dataset.va) el.style.verticalAlign = el.dataset.va;
                            if (el.dataset.fw && el.dataset.fw !== '400' && el.dataset.fw !== 'normal') el.style.fontWeight = 'bold';
                            if (el.dataset.color) el.style.color = el.dataset.color;
                            // 너비/높이는 강제 지정하지 않음으로써 최소 사이즈 유지 (content-fit)
                            // if (el.dataset.w) el.style.width = el.dataset.w;
                            // if (el.dataset.h) el.style.height = el.dataset.h;
                        }
                    }
                });

                tempDiv.querySelectorAll('span').forEach(span => {
                    if (span.attributes.length === 0) {
                        const fragment = document.createDocumentFragment();
                        while (span.firstChild) fragment.appendChild(span.firstChild);
                        span.parentNode.replaceChild(fragment, span);
                    }
                });

                // 이미지 가로 배치를 방해하는 불필요한 감싸기 태그(div, p) 제거
                const allImgs = tempDiv.querySelectorAll('img');
                if (allImgs.length > 0) {
                    allImgs.forEach(img => {
                        img.style.display = 'inline-block';
                        img.style.verticalAlign = 'top';
                        // 부모가 div나 p이고 자식이 이미지만 있다면 부모 해제
                        let parent = img.parentElement;
                        if (parent && (parent.tagName === 'DIV' || parent.tagName === 'P')) {
                            if (parent.querySelectorAll('*').length === 1 && parent.textContent.trim() === "") {
                                parent.style.display = 'inline';
                            }
                        }
                    });
                }
                insertHTML(tempDiv.innerHTML);
            }
        }


        function insertToTextArea(textarea, content) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            textarea.value = text.substring(0, start) + content + text.substring(end);
        }


        function addDynamicSection() {
            const container = document.getElementById('dynamicSections');
            const sectionId = 'dyn_sec_' + Date.now();

            const sectionHtml = `
            <div class="dynamic-section" id="${sectionId}">
                <button class="btn-remove-section" onclick="removeSection('${sectionId}')" title="삭제"><i class="fas fa-trash-alt"></i></button>
                <div class="form-group">
                    <label>추가 섹션 제목</label>
                    <input type="text" class="dyn-title" placeholder="소제목 입력">
                </div>
                <div class="editor-container">
                    <div class="editor-toolbar"></div>
                    <div class="editor-content-view paste-area dyn-content" contenteditable="true" placeholder="내용을 입력하세요... (이미지 붙여넣기 가능)"></div>
                </div>
            </div>
            `;

            container.insertAdjacentHTML('beforeend', sectionHtml);

            // Inject toolbar and attach listeners to new editor
            const newSection = container.lastElementChild;
            newSection.querySelector('.editor-toolbar').innerHTML = TOOLBAR_HTML;
            const newEditor = newSection.querySelector('.paste-area');
            newEditor.addEventListener('paste', handleContentPaste);
            newEditor.addEventListener('focus', () => { lastFocusedEditor = newEditor; saveSelectionState(); });
            newEditor.addEventListener('mouseup', saveSelectionState);
            newEditor.addEventListener('keyup', saveSelectionState);
        }

        function removeSection(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }

        function generateHTML() {
            const title = document.getElementById('inTitle').value;
            const appliedModel = document.getElementById('inAppliedModel').value;
            const productFamily = document.getElementById('inProductFamily').value;
            const targetSerial = document.getElementById('inTargetSerial').value;
            const actionSummary = document.getElementById('inActionSummary').innerHTML;

            // Fixed sections
            const symptomTitle = document.getElementById('inSymptomTitle').value;
            const symptom = document.getElementById('inSymptom').innerHTML;
            const causeTitle = document.getElementById('inCauseTitle').value;
            const cause = document.getElementById('inCause').innerHTML;
            const repairTitle = document.getElementById('inRepairTitle').value;
            const repairMethod = document.getElementById('inRepairMethod').innerHTML;

            let sectionIndex = 1;
            function generateSection(title, content) {
                if (!content) return "";

                // 실제 내용이 있는지 더 정확하게 체크하기 위해 임시 엘리먼트 활용
                const temp = document.createElement('div');
                temp.innerHTML = content;

                // 보이지 않는 특수문자(제로 너비 공백 등) 제거 후 텍스트 확인
                const text = temp.textContent.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

                // 이미지, 표, iframe(영상) 등이 포함되어 있는지 확인
                const hasMedia = temp.querySelector('img, table, iframe') !== null;

                // 내용이 전혀 없으면(텍스트도 없고 미디어도 없으면) 빈 문자열 반환 (번호 증가 안 함)
                if (text.length === 0 && !hasMedia) {
                    return "";
                }

                return `
<h3 class="sub-tit">
<span class="num">v</span>${title}</h3>
${content}`;
            }

            let actionSummaryHtml = actionSummary;
            let sectionsHtml = "";

            // Generate fixed sections
            sectionsHtml += generateSection(symptomTitle, symptom);
            sectionsHtml += generateSection(causeTitle, cause);
            sectionsHtml += generateSection(repairTitle, repairMethod);

            // Generate dynamic sections
            const dynSections = document.querySelectorAll('.dynamic-section');
            dynSections.forEach(sec => {
                const dTitle = sec.querySelector('.dyn-title').value || "추가 섹션";
                const dContent = sec.querySelector('.dyn-content').innerHTML;
                sectionsHtml += generateSection(dTitle, dContent);
            });

            // Get updated product data attributes
            const postDataDiv = document.querySelector('.postData');
            const pLv2 = postDataDiv.getAttribute('data-productlv2') || "['ALL']";
            const pLv3 = postDataDiv.getAttribute('data-productlv3') || "['ALL']";
            const pModel = postDataDiv.getAttribute('data-model') || "['null']";

            const postDataHtml = `<div class="postData" data-productlv2="${pLv2}" data-productlv3="${pLv3}" data-model="${pModel}"></div>`;

            // Build table rows dynamically
            const tableRows = [];
            if (title && title.trim()) {
                tableRows.push(`<tr><th class="xfe_just_info">제목</th><td>${title}</td></tr>`);
            }
            if (productFamily && productFamily.trim()) {
                tableRows.push(`<tr><th class="xfe_just_info">제품군</th><td>${productFamily}</td></tr>`);
            }
            if (appliedModel && appliedModel.trim()) {
                tableRows.push(`<tr><th class="xfe_just_info">적용 모델</th><td>${appliedModel}</td></tr>`);
            }
            if (targetSerial && targetSerial.trim()) {
                tableRows.push(`<tr><th class="xfe_just_info">대상 제번</th><td>${targetSerial}</td></tr>`);
            }

            // Check if actionSummary has meaningful content
            const actionSummaryText = actionSummary.replace(/<[^>]*>/g, '').trim();
            if (actionSummaryText && actionSummaryText !== '내용을 입력하세요...') {
                tableRows.push(`<tr><th class="xfe_just_info">조치 방법</th><td>${actionSummaryHtml}</td></tr>`);
            }

            const contentBody = `
<div class="tbl-scroll">
<table style="width: 600px; border-collapse: collapse;" class="xfe_just_info">
<tbody>
${tableRows.join('\n')}
</tbody>
</table>
</div>
${sectionsHtml}`;

            // Visual preview (inner only)
            const templateForPreview = `
    ${postDataHtml}
    <div class="content-service-view" style="padding: 10px">
        ${contentBody}
    </div>
        `;

            document.getElementById('previewContainer').innerHTML = templateForPreview;

            // 미리보기 복사 버튼 표시 (PPT용)
            document.getElementById('btnCopyPreview').style.display = 'inline-block';

            // Full Code Output
            const fullOutputCode = `<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width"/>
<title></title>
<style type="text/css">
@import url(https://fonts.googleapis.com/earlyaccess/notosanskr.css);
blockquote, body, button, code, dd, div, dl, dt, fieldset, form, h1, h2, h3, h4, h5, h6, input, legend, li, ol, p, pre, select, table, td, textarea, th, ul {word-break:break-word;}
.tal{text-align:left!important}
.ml-1{margin-left:20px!important}
.mt-0{margin-top:0!important}
.mt-1{margin-top:20px!important}
caption{overflow:hidden;width:1px;height:1px;margin:0;padding:0;font-size:1px;text-indent:-9999px}
.ir-hidden{position:absolute;margin:-1px;width:1px;height:1px;padding:0;border:0;white-space:nowrap;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%)}
.content-service-view{font-family:'Noto Sans','Noto Sans KR',sans-serif;font-size:14px;line-height:1.6}
.content-service-view .lg-red{color:#ec455a!important}
.content-service-view .c-gray{color:#999!important}
.content-service-view strong{font-weight:600}
.content-service-view p{margin:0 0 10px 0;padding:0}
.content-service-view ol,.content-service-view ul{margin:0 0 20px;padding:0 0 0 20px;list-style:initial}
.content-service-view ul{list-style:disc}
.content-service-view ol{list-style:decimal}
.content-service-view [class^=iframe-wrap]{margin-top:15px}
.content-service-view .iframe-wrap iframe{width:640px}
.content-service-view .iframe-wrap-shorts iframe{width:365px}
.content-service-view .info-subject{margin:0 0 15px;padding:0;font-size:18px;color:#444;line-height:1.5}
.content-service-view .tit{position:relative;margin:60px 0 15px 0;padding:0;font-weight:600;font-size:22px;color:#444;line-height:1.5}
.content-service-view .tit:before{content:"";overflow:hidden;position:absolute;left:0;top:-8px;width:25px;height:3px;background:#ec455a}
.content-service-view .tit:first-child{margin-top:0}
.content-service-view .info-subject+.tit{margin-top:40px}
.content-service-view .sub-tit{position:relative;margin:40px 0 10px;padding:0 0 0 22px;font-size:17px;font-weight:500;line-height:1.5}
.content-service-view .sub-tit.no-content {margin-top:20px; margin-bottom:5px;}
.content-service-view .sub-tit.no-content + .sub-tit {margin-top:10px;}
.content-service-view .sub-tit:before{content:"";overflow:hidden;position:absolute;left:0;top:5px;width:18px;height:18px;border-radius:50%;background:#999 url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=CYfUaCPKDZkbFewB3OjoAA&portalId=P1) no-repeat 4px 50%;background-size:10px}
.content-service-view .sub-tit:first-child,.content-service-view .tit+.sub-tit{margin-top:20px}
.content-service-view .sub-tit .num{display:block;position:absolute;left:0;top:5px;width:17px;height:17px;text-align:center;border-radius:50%;font-size:11px;color:#fff;background:#999}
.content-service-view .info-tit{margin:20px 0 0;padding-left:20px;font-size:15px;font-weight:500;color:#000;background:url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=81CJtgOoS8EBzjcpk4oCvA&portalId=P1) no-repeat 0 5px;background-size:16px}
.content-service-view .info-desc{margin:5px 0;font-weight:500;color:#000}
.content-service-view .info-desc.idt{margin-left:18px;text-indent:-18px}
.content-service-view .txt-idt{margin-left:16px!important;text-indent:-16px}
.content-service-view .txt-idt *{text-indent:0}
.content-service-view .img-only{margin:0 0 20px}
.content-service-view .img-only img{max-width:100%;margin-bottom:15px}
.content-service-view .img-only img:last-child{margin-bottom:0}
.content-service-view .img-box{margin:15px 0;font-size:0;line-height:0}
.content-service-view .img-box a{font-size:0;line-height:0}
.content-service-view .cause-list{margin-top:0}
.content-service-view .cause-list li{position:relative;margin-top:5px;padding-left:10px;line-height:1.5}
.content-service-view .cause-list li:before{content:"";position:absolute;left:0;top:9px;overflow:hidden;width:3px;height:3px;border-radius:50%;background:#000}
.content-service-view .bul-list{margin-top:15px}
.content-service-view .bul-list li{position:relative;margin-top:7px;padding-left:10px;line-height:1.5}
.content-service-view .bul-list li:before{content:"";position:absolute;left:0;top:9px;overflow:hidden;width:4px;height:4px;border-radius:50%;background:#ec455a}
.content-service-view .tbl-scroll{position:relative;overflow-x:auto;margin:0 0 15px}
.content-service-view table{border-collapse:collapse}
.content-service-view td,.content-service-view th{padding:7px;border:1px solid #ccc;text-align:center;vertical-align:middle;font-size:14px;line-height:1.6}
.content-service-view .tbl-scroll td,.content-service-view .tbl-scroll th{white-space:nowrap}
.content-service-view th{font-size:15px;font-weight:600;background:#ddd}
.content-service-view .tbl-scroll td p{margin-bottom:0}
.content-service-view .tbl-scroll .bg-red td{background-color:rgba(236,69,90,.06)}
.content-service-view [class^=icon-]{display:inline-block;overflow:hidden;width:14px;height:14px;text-indent:-5000px;margin-right:2px;vertical-align:-2px;background-image:url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=e6Br68S0ipa4zVZ3ZhqQ&portalId=P1);background-size:100%}
.content-service-view .icon-down{background-image:url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=cSrRVKKz6eHJNHzIRgzWA&portalId=P1)}
.content-service-view [class^=btn0]{display:inline-block;height:32px;padding:0 15px;border:1px solid #ec455a;border-radius:18px;text-decoration:none;font-size:14px;color:#ec455a;line-height:2;background:#fff}
.content-service-view .btn01:hover{color:#fff;background:#ec455a}
.content-service-view .link-btn{display:inline-block;height:32px;margin-top:5px;padding:0 15px;border:1px solid #d2d2d7;border-radius:18px;text-decoration:none;font-size:14px;color:#ec455a;line-height:2;background:#fff}
.content-service-view .link-btn:hover{border-color:#ec455a}
.content-service-view .link-txt{text-decoration:underline;vertical-align:top;color:#ec455a;word-break:keep-all;word-wrap:break-word}
.content-service-view .link-btn.hauto {height:auto;}
.content-service-view .link-btn.hauto .link-txt {display:block;}
.content-service-view .tip-box{margin:25px 0;padding:20px 20px 10px;border:2px solid #ddd;border-radius:8px}
.content-service-view .tip-box .tip-tit{display:block;position:relative;padding-left:20px;font-size:15px!important;color:#222}
.content-service-view .tip-box .tip-tit:before{content:"!";position:absolute;left:0;top:5px;width:16px;height:16px;border-radius:50%;text-align:center;font-size:11px;color:#fff;background:silver}
.content-service-view .tip-box p{margin-top:10px;}
.content-service-view .tip-box strong{font-size:14px}
.content-service-view .tip-box>p>strong{color:#ec455a!important}
.content-service-view .tip-box .con-view{margin:10px 0;color:#333}
.content-service-view .tip-box p+.con-view{margin-top:-5px}
.content-service-view .tip-box .bul-list{margin-bottom:15px}
.content-service-view .tip-box .con-view+[class^=img-]{margin-top:20px}
.content-service-view .img-banner{margin-top:30px}
.content-service-view .img-banner .mo{display:none}
.content-service-view .img-banner .pc{display:block;position:relative;height:168px;margin-right:175px;background:#e9ecf1 url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=1LKxgclhHWvKxN7aMUkPyg&portalId=P1) no-repeat 0 50%;background-size:contain}
.content-service-view .img-banner .pc a{position:absolute;top:0;right:-175px}
.content-service-view .img-banner .pc a img{-webkit-box-shadow:2px 2px 5px 0 rgba(118,118,118,1);-moz-box-shadow:2px 2px 5px 0 rgba(118,118,118,1);box-shadow:2px 2px 5px 0 rgba(118,118,118,1)}
.content-service-view .mobile-txt{display:none;margin-top:-10px;padding-left:20px;color:#999;background:url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=Xw5rvb0UTyjfo1LwHfIJ7w&portalId=P1) no-repeat 0 5px;background-size:15px}
.content-service-view .link-list{margin-top:10px}
.content-service-view .link-list li{display:table;box-sizing:border-box;width:100%;margin-top:10px;padding:8px 15px;border-radius:8px;box-shadow:2px 4px 16px 1px rgba(0,0,0,.14)}
.content-service-view .link-list li .link-tit{display:table-cell;padding-right:5px;font-weight:600;vertical-align:middle}
.content-service-view .link-list li .right{display:table-cell;text-align:right}
.content-service-view .link-list li .ver{display:inline-block;margin-top:5px;color:#999}
.content-service-view .link-list li .right a{margin-left:10px}
.content-service-view .txt-box{max-width:600px}
.content-service-view .txt-box+.txt-box{margin-top:25px}
.content-service-view .txt-box h4{margin:0;padding:6px;text-align:center;font-size:18px;font-weight:600;background:#ddd}
.content-service-view .txt-box ul{margin:0 7px}
.content-service-view .txt-box li{display:flex;flex-wrap:wrap;padding:5px;border-bottom:1px solid #ddd}
.content-service-view .txt-box li div{flex:1 1 50%}
.content-service-view .txt-box li span{display:block;position:relative;padding-left:10px;font-size:16px;font-weight:600}
.content-service-view .txt-box li span:before{content:"";position:absolute;left:0;top:10px;overflow:hidden;width:4px;height:4px;border-radius:50%;background:#000}
.content-service-view .txt-box li p{margin:0;padding:0 0 0 10px;font-size:14px}
.content-service-view .help-txt{position:relative;margin:30px 0 0;padding:0 0 0 15px;font-size:14px;color:#666}
.content-service-view .help-txt:before{content:'＊';position:absolute;left:0;top:0;font-size:12px;font-weight:600;color:#ec455a}
.content-service-view .bg-hidden {overflow: hidden;}
.content-service-view .error-sound-box {margin: 60px 0 10px 0;padding: 0 20px 20px;border: 1px solid #d2d2d7;border-radius: 10px;box-sizing: border-box;}
.content-service-view .error-sound-box .error-list {display: flex;flex-wrap: wrap;gap: 10px;max-width: 750px;margin-top: 20px;}
.content-service-view .error-sound-box .error-list .error-item .er-btn {position: relative;height: 80px;padding: 10px 10px 10px 38px;font-size: 14px;text-align: left;cursor: pointer;border: 1px solid #d2d2d7;border-radius: 18px;box-sizing: border-box;background-color: #fff;}
.content-service-view .error-sound-box .error-list .error-item .er-btn:hover {background-color: #f0f0f0;}
.content-service-view .error-sound-box .error-list .error-item .er-btn::before {content: "";overflow: hidden;position: absolute;left: 10px;top: 50%;transform: translateY(-50%);width: 18px;height: 18px;background: url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=jshf2Dvz8OwZtdDkvsixcg&portalId=P1) no-repeat center;background-size: 100%;}
.content-service-view .error-sound-box .error-item .error-pop {display: none;position: fixed;padding-top: 100px;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, .6);z-index: 99999;}
.content-service-view .error-sound-box .error-item .error-pop .modal-cont {overflow: hidden;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 100%;max-width: 600px;min-width: 500px;padding: 20px;background-color: #fefefe;border: 1px solid #888;border-radius: 10px;box-sizing: border-box;}
.content-service-view .error-sound-box .error-item .error-pop .pop-tit {margin-bottom: 15px;font-weight: 500;color: #000;}
.content-service-view .error-sound-box .error-item .error-pop .pop-cont {overflow-y: auto;max-height: 500px;}
.content-service-view .error-sound-box .error-item .error-pop .pop-close {position: absolute;top: 20px;right: 20px;width: 24px;height: 24px;padding: 0;background: url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=2cImOgY7d5sL48IwdSCCg&portalId=P1) no-repeat center;background-size: 100%;border: 0;}
.content-service-view .error-sound-box .error-item .error-pop .pop-close:hover, .content-service-view .error-sound-box .error-item .error-pop .pop-close:focus {text-decoration: none;color: #000;cursor: pointer;}
.content-service-view .collapse-box {margin: 25px 0;}
.content-service-view .collapse-box [id^="collapse-txt"] {display: none;margin-top: 20px;}
.content-service-view .collapse-box .collapse-btn {position: relative;padding: 5px 25px 5px 5px;font-weight: 600;background-color: inherit;border: 0;cursor: pointer;}
.content-service-view .collapse-box .collapse-btn::before {content: "";position: absolute;bottom: 0;left: 0;width: 85%;height: 1px;background-color: #999;}
.content-service-view .collapse-box .collapse-btn .arrow {position: absolute;top: 50%;right: 5px;transform: translateY(-50%);transition: all 0.1s ease;}
.content-service-view .collapse-box .collapse-btn .arrow {width: 18px;height: 18px;background: url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=8V9sDVh4TFZtZNBfM3lsQ&portalId=P1) no-repeat 4px 50%;background-size: 10px;}
.content-service-view .collapse-box .arrow.rotate {transform: translateY(-50%) rotate(180deg);}
#contentsViewer .content-service-view .iframe-wrap iframe{height:360px!important}
#contentsViewer .content-service-view .iframe-wrap-shorts iframe{height:650px!important}
#contentsViewer .content-service-view .info-subject{margin:0;padding:0 0 15px}
@media screen and (max-width:768px){
.content-service-view table[style*="width: 600px"] { width: 100% !important; }
.content-service-view img{max-width:100%!important; height:auto!important;}
.content-service-view .mobile-txt{display:block}
.content-service-view [class^=iframe-wrap]{position:relative;overflow:hidden;height:0;padding-top:30px;padding-bottom:56.25%}
.content-service-view .iframe-wrap-shorts{padding-bottom:120%}
.content-service-view [class^=iframe-wrap] iframe{position:absolute;top:0;left:0;width:100%;height:90%!important}
.content-service-view [class^=iframe-wrap]+.tit{margin-top:0}
.content-service-view .img-banner .mo{display:block; width: fit-content;}
.content-service-view .img-banner .mo img{width:100%}
.content-service-view .img-banner .pc{display:none}
.content-service-view .error-sound-box .error-item .error-pop .modal-cont {width: 100%;max-width: 300px;min-width: auto;}
.content-service-view .error-sound-box .error-item .error-pop .pop-cont {min-height: 300px;max-height: calc(100vh - 200px);}
.content-service-view .error-sound-box .error-list .error-item,
.content-service-view .error-sound-box .error-list .error-item .er-btn {width: 100%;}
.content-service-view .audio-box audio {width: 230px;}
#contentsViewer .content-service-view [class^=iframe-wrap] iframe{height:90%!important}
}
[dir="rtl"] .content-service-view .tit:before {left:auto; right:0;}
[dir="rtl"] .content-service-view .sub-tit {padding:0 22px 0 0;}
[dir="rtl"] .content-service-view .sub-tit:before {left:auto; right:0;}
[dir="rtl"] .content-service-view .sub-tit .num {left:auto; right:0;}
[dir="rtl"] .content-service-view .cause-list li:before {left:auto; right:0;}
[dir="rtl"] .content-service-view .info-tit {padding-left:0; padding-right:20px; background-position:100% 5px;}
[dir="rtl"] .content-service-view .info-desc.idt {margin-left:0; margin-right:18px; text-indent:-18px}
[dir="rtl"] .content-service-view .txt-idt {margin-left:0 !important; margin-right:16px;}
[dir="rtl"] .content-service-view .cause-list li {padding-left:0; padding-right:10px;}
[dir="rtl"] .content-service-view .bul-list li {padding-left:0; padding-right:10px;}
[dir="rtl"] .content-service-view .bul-list li:before {left:auto; right:0;}
[dir="rtl"] .content-service-view .tip-box .tip-tit{padding-left:0; padding-right:20px;}
[dir="rtl"] .content-service-view .tip-box .tip-tit:before{left:auto; right:0;}
[dir="rtl"] .content-service-view .tbl-scroll td.tal {text-align:start !important;}
[dir="rtl"] .content-service-view .txt-box li span {padding-left:0; padding-right:10px;}
[dir="rtl"] .content-service-view .txt-box li span:before {left:auto; right:0;}
[dir="rtl"] .content-service-view .txt-box li p {padding:0 10px 0 0;}
[dir="rtl"] .content-service-view .mobile-txt {padding-left:0; padding-right:20px; background-position:100% 5px;}
[dir="rtl"] .content-service-view .link-list li .right {text-align:end;}
[dir="rtl"] .content-service-view .help-txt {padding:0 15px 0 0;}
[dir="rtl"] .content-service-view .help-txt:before {left:auto; right:0;}
.content-service-view .cs-tabs [role="tabpanel"].is-hidden {display:none;}
.content-service-view .cs-tabs .cs-tab-list button {border:0 none; border-radius:0; background-color:transparent; cursor:pointer}
.content-service-view .cs-tabs .cs-tab-list button:focus,
.content-service-view .cs-tabs .cs-tab-list button:hover {text-decoration:none;}
.content-service-view .cs-tabs .main-tab-list {display:flex; justify-content:space-around; border-bottom:1px solid #ddd;}
.content-service-view .cs-tabs .main-tab-list button {display:block; position:relative; padding:8px 0; color:#767676; font-weight:bold; font-size:17px; line-height:1.6; letter-spacing:-1px;}
.content-service-view .cs-tabs .main-tab-list button[aria-selected="true"] {color:#000;}
.content-service-view .cs-tabs .main-tab-list button[aria-selected="true"]:after {position:absolute; bottom:-1px; left:0; width:100%; height:4px; border-radius:5px 5px 0 0; background-color:#000; content:'';}
.content-service-view .cs-tabs .cs-tabpannel-header {display:flex; flex-direction:column;}
.content-service-view .cs-tabs .sub-tab-list {border-top:1px solid #ddd;}
.content-service-view .cs-tabs .sub-tab-list button {display:block; width:100%; padding:16px; border-bottom:1px solid #ddd; font-size:14px; color:#000;}
.content-service-view .cs-tabs .sub-tab-list button[aria-selected="true"] {background-color:#000; color:#fff; font-weight:bold;}
.content-service-view .cs-tabs .sub-tab-list.flex_two {display:flex; flex-wrap:wrap;}
.content-service-view .cs-tabs .sub-tab-list.flex_two button {width: 50%;}
.content-service-view .cs-tabs .sub-tab-list.flex_two button:nth-of-type(odd) {border-right: 1px solid #ddd;}
.content-service-view .cs-tabs .cs-image-wrap {padding:30px 0; text-align:center;}
@media screen and (min-width:1024px) {
.content-service-view .cs-tabs .main-tab-list {justify-content:center;}
.content-service-view .cs-tabs .main-tab-list button {margin:0 20px; padding:24px 0;}
.content-service-view .cs-tabs .main-tab-list button br {display:none;}
.content-service-view .cs-tabs .cs-tabpannel-header {padding:50px 0 0; align-items:center;}
.content-service-view .cs-tabs .cs-tabpannel-header .cs-image-wrap {padding:0;}
.content-service-view .cs-tabs .sub-tab-list {display:flex; justify-content:center; margin-top:50px; border-top:none;}
.content-service-view .cs-tabs .sub-tab-list button {display:block; position:relative; width:auto; margin:0 20px; padding:18px 0; border-bottom:none; color:#767676; font-weight:bold; font-size:17px; line-height:1.6; letter-spacing:-1px;}
.content-service-view .cs-tabs .sub-tab-list button[aria-selected="true"] {color:#000; background-color:#fff;}
.content-service-view .cs-tabs .sub-tab-list button[aria-selected="true"]:after {position:absolute; bottom:-1px; left:0; width:100%; height:4px; border-radius:5px 5px 0 0; background-color:#000; content:'';}
.content-service-view .cs-tabs .sub-tab-list.flex_two button {width: auto;}
.content-service-view .cs-tabs .sub-tab-list.flex_two button:nth-of-type(odd) {border-right: none;}
.content-service-view .cs-tabs .cs-sub-tabpanel-inner {padding:50px 30px; border:1px solid #ddd; border-radius:8px;}
.content-service-view .cs-tabs .cs-sub-tabpanel-inner.d-flex {display:flex;}
.content-service-view .cs-tabs .cs-sub-tabpanel-inner.d-flex .cs-image-wrap {flex-shrink:1; width:600px; padding:0;}
.content-service-view .cs-tabs .cs-sub-tabpanel-inner.d-flex .cs-image-wrap img {width:100%;}
.content-service-view .cs-tabs .cs-sub-tabpanel-inner.d-flex .cs-copy-wrap {flex-grow:1; padding-left:30px;}
}
.content-service-view .flex-tv-webos-list li {padding:4px 0;}
@media screen and (min-width:769px) {
.content-service-view .flex-tv-webos-list {display:flex; flex-wrap:wrap; width:500px;}
.content-service-view .flex-tv-webos-list li {width:50%; padding:8px 0;}
}
.content-service-view .cs-accordion {margin-top:30px; border-top:2px solid #222;}
.content-service-view .cs-accordion .acc-item {border-bottom:1px solid #ddd;}
.content-service-view .cs-accordion .acc-item .heading-btn {margin:0; padding:0;}
.content-service-view .cs-accordion button {border:0 none; border-radius:0; background-color:transparent; cursor:pointer}
.content-service-view .cs-accordion button:focus,
.content-service-view .cs-accordion button:hover {text-decoration:none;}
.content-service-view .cs-accordion button.accordion-trigger {position:relative; display:block; width:100%; padding:16px 40px 16px 15px; text-align:start; color:#000; font-weight:bold; font-size:14px; line-height:22px; word-break:break-all;}
.content-service-view .cs-accordion button.accordion-trigger[aria-expanded=false] .accordion-title {
max-height: calc(24px * 2);
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
}
.content-service-view .cs-accordion button.accordion-trigger::after {display:block; position:absolute; top:22px; right:12px; width:6px; height:6px; border-top:1px solid #000; border-right:1px solid #000; transform:rotate(314deg); transition:transform .3s ease; transform-origin:5px 2px; content:'';}
.content-service-view .cs-accordion button.accordion-trigger[aria-expanded=false]::after {transform:rotate(134deg);}
.content-service-view .cs-accordion .accordion-panel {padding:0 15px 25px 15px;}
@media screen and (min-width:769px) {
.content-service-view .cs-accordion button.accordion-trigger {padding:25px 125px 25px 15px; font-size:16px;}
.content-service-view .cs-accordion button.accordion-trigger::after {top:50%; right:50px; width:10px; height:10px; margin-top:-5px; transform-origin:7px 4px;}
.content-service-view .cs-accordion .accordion-panel {padding:0 125px 25px 15px;}
}
[dir="rtl"] .content-service-view .cs-accordion button.accordion-trigger {padding:16px 15px 16px 40px;}
[dir="rtl"] .content-service-view .cs-accordion button.accordion-trigger::after {right:auto; left:12px;}
[dir="rtl"] .content-service-view .cs-accordion .accordion-panel {padding:0 15px 25px 15px;}
@media screen and (min-width:769px) {
[dir="rtl"] .content-service-view .cs-accordion button.accordion-trigger {padding:25px 15px 25px 125px;}
[dir="rtl"] .content-service-view .cs-accordion button.accordion-trigger::after {right:auto; left:50px;}
[dir="rtl"] .content-service-view .cs-accordion .accordion-panel {padding:0 15px 25px 125px;}
}
.content-service-view .osd-menu {color:#fff;}
.content-service-view .osd-ul {display:flex; margin:0;}
.content-service-view .osd-li {position:relative;}
.content-service-view .osd-ul .osd-li:nth-of-type(1) {width:30%; background-color:#312F3A;}
.content-service-view .osd-ul .osd-li.type-vertical:nth-of-type(1) {width:20%; background-color:#312F3A;}
.content-service-view .osd-ul .osd-li:nth-of-type(2) {flex-grow:1; background-color:#666666;}
.content-service-view .osd-li .option-tit {padding:10px 15px; border-bottom:1px solid #fff; font-weight:bold; font-size:24px;}
.content-service-view .osd-li.has-opt-control {padding-bottom:45px;}
.content-service-view .osd-ul.col3 .osd-li {}
.content-service-view .osd-ul.col3 .osd-li:nth-of-type(1) {width:30%;}
.content-service-view .osd-ul.col3 .osd-li:nth-of-type(2) {width:35%;}
.content-service-view .osd-ul.col3 .osd-li:nth-of-type(3) {width:35%; background-color:#767676;}
.content-service-view .osd-li .decision-box {position:relative; height:100%; padding-bottom:100px; box-sizing:border-box; font-size:18px;}
.content-service-view .osd-li .decision-box .dec-txt {padding:15px;}
.content-service-view .osd-li .decision-box .dec-btns {position:absolute; bottom:0; left:0; width:100%;}
.content-service-view .osd-li .decision-box .dec-btn {padding:10px; border-top:1px solid #fff; text-align:center;}
.content-service-view .osd-li .decision-box .dec-btn.active {background-color:#C32E4C;}
.content-service-view .osd-li .opt-control-info {position:absolute; bottom:0; left:0; display:flex; justify-content:space-around; width:100%; padding:10px 0; background-color:#312F3A; color:#fff;}
.content-service-view .osd-li .opt-control-info .ic-enter {position:relative; display:inline-flex; justify-content:center; align-items:center; width:16px; height:16px; border:2px solid #fff; border-radius:50%; box-sizing:border-box;}
.content-service-view .osd-li .opt-control-info .ic-enter::after {display:block; width:10px; height:10px; background-color:#fff; border-radius:50%; content:'';}
.content-service-view .type-vertical .osd-d1-li {flex-direction:column;}
.content-service-view .osd-d1-ul {margin:0; padding:15px 0;}
.content-service-view .osd-d1-li {display:flex; align-items:center; gap:10px; padding:10px;}
.content-service-view .osd-d1-li.active {background-color:#C32E4C;}
.content-service-view .osd-d1-li .ic-img {}
.content-service-view .osd-d1-li .ic-txt {}
.content-service-view .type-vertical .osd-d1-li .ic-txt {text-align:center;}
.content-service-view .opt-ul {}
.content-service-view .opt-li {position:relative; display:flex; justify-content:space-between; align-items:center; padding:10px 45px 10px 15px; font-size:20px;}
.content-service-view .opt-li.active {background-color:#C32E4C;}
.content-service-view .opt-li.arrow-right:after {display:block; position:absolute; top:47%; right:15px; width:8px; height:8px; border-bottom:3px solid rgb(255, 255, 255); border-right:3px solid rgb(255, 255, 255); transform:rotate(314deg); transition:transform .3s ease; transform-origin:5px 2px; content:'';}
.content-service-view .opt-li .opt-item {font-size: 18px;}
.content-service-view .opt-li .opt-seleted {flex-grow: 1;padding: 40px 0; font-size: 25px; font-weight: 500;}
.content-service-view .opt-li .opt-value {text-align:end;}
.content-service-view .opt-li.has-value .opt-item {width:70%;}
.content-service-view .opt-li.has-value .opt-value {width:30%;}
.content-service-view .opt-li-skip {padding:10px 45px 10px 15px; font-weight:bold; font-size:20px; text-align:center;}
[dir="rtl"] .content-service-view .opt-li {padding:10px 15px 10px 45px;}
[dir="rtl"] .content-service-view .opt-li.arrow-right:after {right:auto; left:15px; top: 53%; transform:rotate(135deg); transition:transform .3s ease; transform-origin:5px 2px; content:''}
.content-service-view .er-tabs { text-align: center; font-size: 18px; overflow-x: hidden; overflow-y: hidden;}
.content-service-view .er-tabs [role="tabpanel"].is-hidden { display: none;}
.content-service-view .er-tabs .cs-tab-list button {  border: 0 none;  border-radius: 0; background-color: transparent; cursor: pointer;}
.content-service-view .er-tabs .cs-tab-list button:focus,
.content-service-view .er-tabs .cs-tab-list button:hover { text-decoration: none;}
.content-service-view .er-tabs .er-tab-list { display: flex; justify-content: space-around; padding: 32px; margin: -8px;}
.content-service-view .er-tabs .er-tab-list button { display: block;  position: relative; width: calc(50% - 16px); margin: 8px; padding: 8px 0; font-weight: bold; font-size: 17px; line-height: 1.6; letter-spacing: -1px; border-radius: 16px; border: 5px solid #999; color: #a50034;max-width: 300px;}
.content-service-view .er-tabs .er-tab-list button[aria-selected="true"] { color: #fff; border: 5px solid #333; background-color: #a50034;}
.content-service-view .er-tabs .er-tab-list button img { opacity: 0.5;}
.content-service-view .er-tabs .er-tab-list button[aria-selected="true"] img { opacity: 1;}
.content-service-view .er-tabs .er-tab-list button .txt { display: block; padding-top: 8px;}
.content-service-view .er-tabs .tabpanel-wrap { padding: 50px 30px; border: 1px solid #ddd; border-radius: 8px; transition: all 600ms cubic-bezier(0.86, 0, 0.07, 1);}
@media screen and (min-width: 1024px) {
.content-service-view .er-tabs .er-tab-list {justify-content: center;}
.content-service-view .er-tabs .er-tab-list button { margin: 0 20px; padding: 8px 0;}
}
.code-modal { visibility: hidden; position: fixed; box-sizing: border-box; left: 0; top: 0; width: 100%; height: 100%; z-index: 9999; max-height: 100vh; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; padding: 20px 0; align-items: center;}
.code-modal.active {visibility: visible;}
.code-modal .modal-dialog {z-index: 100; background-color: #ffff;max-width: 710px; width: 100%; text-align: start;}
.code-modal .modal-dialog .modal-content {width: 100%; background-color: #fff; height: auto; max-height: 100%;}
.code-modal .modal-dialog .modal-content .body-box{overflow-y: auto; margin: 0 auto;padding: 32px; height: auto; width: auto; max-height: calc(100vh - 181px);}
.code-button-list {display: flex; flex-flow: row wrap;}
.code-button-list .code-btn { box-sizing: border-box; outline: none; width: calc(20% - 16px); margin: 8px; display: inline-flex; align-items: center; justify-content: center; background-color: gray; height: 50px; cursor: pointer; border: 2px solid #999; border-radius: 8px; background-color: #f4f4f4;}
.code-button-list .code-btn:hover, .code-button-list .code-btn.active {background-color: #a50034; border-color: #a50034;}
.code-button-list .code-btn:hover img, .code-button-list .code-btn.active img { filter: invert(100%);}
.code-button-list  .code-btn img { max-width: 100%; max-height: 100%;}
.code-modal .modal-dialog .modal-content .modal-header {
display: flex;
align-items: center;
justify-content: space-between;
position: relative;
background-color: #efefef;
padding: 16px;
}
.code-modal .modal-dialog .modal-content .modal-header .close {
width: 20px;
height: 20px;
padding: 0;
background: url("https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=x8m2oVyPZQFsbHfsE1SAQ&portalId=P1") no-repeat center 100%;
border: 0;
}
.code-modal .modal-dialog .modal-content .modal-header .close:hover, .code-modal .modal-dialog .modal-content .modal-header .close:focus { text-decoration: none; cursor: pointer;}
.code-modal .modal-dialog .modal-content .modal-header h2,h3,h4,h5,h6 .modal-title { font-size: 28px; color: #000; font-weight: 500; margin: 0; width: fit-content}
@media screen and (max-width: 769px) {
.code-modal .modal-dialog {width: calc(100% - 24px);}
.code-modal .modal-dialog .modal-content .body-box{ min-height: 300px; }
.code-button-list .code-btn { width: calc(50% - 16px); margin: 8px;}
}
</style>
</head>
<body >
${postDataHtml}
<div class="content-service-view">
${contentBody}
</div>
</body>
</html>`;

            document.getElementById('codeOutput').value = fullOutputCode.trim();

            // 미리보기 복사 버튼 표시 (HTML 뷰어는 항상 노출됨)
            document.getElementById('btnCopyPreview').style.display = 'inline-block';

            // Auto-switch to preview tab on mobile
            if (window.innerWidth <= 768) {
                switchTab('preview');
            }
        }

        function copyCode() {
            const copyText = document.getElementById("codeOutput").value;
            if (!copyText) {
                alert("복사할 코드가 없습니다. 먼저 HTML 변환을 수행해 주세요.");
                return;
            }
            navigator.clipboard.writeText(copyText).then(() => {
                alert("코드가 클립보드에 복사되었습니다.");
            }).catch(err => {
                console.error('복사 실패: ', err);
                // Fallback for older browsers
                const textArea = document.getElementById("codeOutput");
                textArea.select();
                textArea.setSelectionRange(0, 99999);
                document.execCommand("copy");
                alert("코드가 복사되었습니다. (Fallback)");
            });
        }

        async function copyPreview() {
            const previewEl = document.getElementById('previewContainer');
            if (!previewEl || previewEl.querySelector('[style*="text-align: center"]')) {
                alert('미리보기 내용이 없습니다. 먼저 HTML 변환을 수행해 주세요.');
                return;
            }

            const btn = document.getElementById('btnCopyPreview');
            const originalText = btn.textContent;
            btn.textContent = '⏳ 이미지 생성 중...';
            btn.disabled = true;

            try {
                // html2canvas를 사용하여 미리보기 영역을 캔버스로 변환
                // useCORS: true를 통해 외부 이미지(서버 허용 시) 포함 가능
                const canvas = await html2canvas(previewEl, {
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff', // PPT 붙여넣기 시 배경이 투명하게 변하는 것 방지
                    scale: 2 // 선명도를 위해 해상도 2배 확대
                });

                // 캔버스를 PNG Blob으로 변환
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        throw new Error('Canvas to Blob 변환 실패');
                    }

                    try {
                        // 최신 ClipboardItem API 사용 (이미지 복사)
                        if (navigator.clipboard && window.ClipboardItem) {
                            const item = new ClipboardItem({ [blob.type]: blob });
                            await navigator.clipboard.write([item]);

                            btn.textContent = '✅ 이미지 복사 완료 (PPT용)';
                            setTimeout(() => {
                                btn.textContent = originalText;
                                btn.disabled = false;
                            }, 3000);
                        } else {
                            throw new Error('브라우저가 이미지 클립보드 복사를 지원하지 않습니다.');
                        }
                    } catch (err) {
                        console.error('이미지 클립보드 쓰기 실패:', err);
                        alert('클립보드에 이미지를 쓰는 중 오류가 발생했습니다.\n브라우저 권한 설정을 확인해 주세요.');
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }
                }, 'image/png');

            } catch (err) {
                console.error('이미지 생성 오류:', err);
                alert('미리보기 이미지 생성 중 오류가 발생했습니다.');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }

        /**
         * HTML 뷰어 모달 열기
         * 왜 이렇게 짰나: 사용자가 변환된 결과뿐만 아니라 직접 코드를 편집하거나 붙여넣어 볼 수 있게 하기 위함입니다.
         */
        function openHTMLViewer() {
            const modal = document.getElementById('htmlViewerModal');
            const inputArea = document.getElementById('manualHtmlInput');
            const currentCode = document.getElementById('codeOutput').value;

            // 변환된 코드가 있다면 즉시 채워줌
            inputArea.value = currentCode;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 모달 오픈 시 배경 스크롤 방지
        }

        function closeHTMLViewerModal() {
            document.getElementById('htmlViewerModal').style.display = 'none';
            document.body.style.overflow = '';
        }

        function loadConvertedCode() {
            const currentCode = document.getElementById('codeOutput').value;
            if (currentCode) {
                document.getElementById('manualHtmlInput').value = currentCode;
            } else {
                alert('가져올 변환된 코드가 없습니다.');
            }
        }

        /**
         * 모달에 입력된 HTML을 새 창에서 뷰어로 띄웁니다.
         */
        function viewManualHTML() {
            const htmlCode = document.getElementById('manualHtmlInput').value;
            if (!htmlCode.trim()) {
                alert('입력된 코드가 없습니다.');
                return;
            }

            const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }

        // --- 구글 번역 기능 ---
        function googleTranslateElementInit() {
            window.googleTranslateElementCreated = true;
            try {
                new google.translate.TranslateElement({
                    pageLanguage: 'ko',
                    includedLanguages: 'ko,en,zh-CN,ja,vi,th,id,es,fr,de,ar',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                }, 'google_translate_element');

                // 로드 완료 시 스타일 조정
                const el = document.getElementById('google_translate_element');
                if (el) {
                    el.style.border = 'none';
                    el.style.backgroundColor = 'transparent';
                    el.style.minWidth = 'auto';
                }

                // 번역에 의한 변화 감지 및 자동 소스 코드 업데이트 
                initTranslationObserver();
            } catch (e) {
                console.error("번역 초기화 실패:", e);
            }
        }

        // 번역 내용 감지용 옵저버
        let translationObserver = null;
        function initTranslationObserver() {
            const target = document.getElementById('previewContainer');
            if (!target) return;

            if (translationObserver) translationObserver.disconnect();

            translationObserver = new MutationObserver((mutations) => {
                // 번역 위젯에 의해 DOM이 변경되면 실행 (디바운스 적용)
                clearTimeout(window.syncTimer);
                window.syncTimer = setTimeout(() => {
                    syncTranslatedCode(true); // 자동 모드에서는 alert 제외
                }, 800);
            });

            translationObserver.observe(target, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        // 모달창 배경 클릭 시 닫기 기능 추가
        window.onclick = function (event) {
            const hvModal = document.getElementById('htmlViewerModal');
            const tbModal = document.getElementById('tableModal');
            if (event.target == hvModal) {
                closeHTMLViewerModal();
            }
            if (event.target == tbModal) {
                closeTableModal();
            }
        }

        // 번역된 미리보기 내용을 소스 코드에 반영
        function syncTranslatedCode(isAuto = false) {
            const previewEl = document.getElementById('previewContainer');
            if (!previewEl || previewEl.querySelector('[style*="text-align: center"]')) {
                if (!isAuto) alert('미리보기 내용이 없습니다.');
                return;
            }

            // 구글 번역 스크립트가 삽입한 요소 및 클래스 정제
            // 원본 DOM을 해치지 않기 위해 클론 사용
            const clone = previewEl.cloneNode(true);

            // 구글 번역 관련 클래스 및 태그 제거
            clone.querySelectorAll('.goog-text-highlight').forEach(el => {
                el.classList.remove('goog-text-highlight');
            });
            clone.querySelectorAll('font').forEach(el => {
                const parent = el.parentNode;
                while (el.firstChild) parent.insertBefore(el.firstChild, el);
                parent.removeChild(el);
            });

            const postDataDiv = clone.querySelector('.postData');
            const postDataHtml = postDataDiv ? postDataDiv.outerHTML : '';

            const serviceView = clone.querySelector('.content-service-view');
            const contentBody = serviceView ? serviceView.innerHTML : '';

            // 스타일 코드는 기존 generateHTML에서 사용하는 것과 동일하게 빌드
            // (여기서는 핵심 구조만 유지)
            const fullOutputCode = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width"/>
<title></title>
<style type="text/css">
@import url(https://fonts.googleapis.com/earlyaccess/notosanskr.css);
blockquote, body, button, code, dd, div, dl, dt, fieldset, form, h1, h2, h3, h4, h5, h6, input, legend, li, ol, p, pre, select, table, td, textarea, th, ul {word-break:break-word;}
.tal{text-align:left!important}
.content-service-view{font-family:'Noto Sans','Noto Sans KR',sans-serif;font-size:14px;line-height:1.6;padding:0 16px;box-sizing:border-box}
.content-service-view p{margin:0 0 10px 0;padding:0}
.content-service-view .tit{position:relative;margin:60px 0 15px 0;padding:0;font-weight:600;font-size:22px;color:#444;line-height:1.5}
.content-service-view .tit:before{content:"";overflow:hidden;position:absolute;left:0;top:-8px;width:25px;height:3px;background:#ec455a}
.content-service-view .sub-tit{position:relative;margin:40px 0 10px;padding:0 0 0 22px;font-size:17px;font-weight:500;line-height:1.5}
.content-service-view .sub-tit:before{content:"";overflow:hidden;position:absolute;left:0;top:5px;width:18px;height:18px;border-radius:50%;background:#999 url(https://gscs.lge.com:/gscs/support/fileupload/downloadFile.do?fileId=CYfUaCPKDZkbFewB3OjoAA&portalId=P1) no-repeat 4px 50%;background-size:10px}
.content-service-view .sub-tit .num{display:block;position:absolute;left:0;top:5px;width:17px;height:17px;text-align:center;border-radius:50%;font-size:11px;color:#fff;background:#999}
.content-service-view .tbl-scroll{position:relative;overflow-x:auto;margin:0 0 15px}
.content-service-view table{border-collapse:collapse; width: 600px;}
.content-service-view td,.content-service-view th{padding:7px;border:1px solid #ccc;text-align:center;vertical-align:middle;font-size:14px;line-height:1.6}
.content-service-view .tbl-scroll td,.content-service-view .tbl-scroll th{white-space:nowrap}
.content-service-view th{font-size:15px;font-weight:600;background:#ddd}
</style>
</head>
<body>
${postDataHtml}
<div class="content-service-view">
${contentBody}
</div>
</body>
</html>`;

            document.getElementById('codeOutput').value = fullOutputCode.trim();
        }

        // 로딩 실패 감지 (5초 후 체크)
        setTimeout(() => {
            if (!window.googleTranslateElementCreated) {
                const el = document.getElementById('google_translate_element');
                if (el && el.innerText.includes('불러오는')) {
                    el.style.color = '#d32f2f';
                    el.style.fontSize = '11px';
                    el.innerText = '번역 도구 로드 실패 (새로고침 요망)';
                }
            }
        }, 5000);

    