function addCheckboxes() {
    const elements = document.querySelectorAll('[id^="react-collapsed-panel"]');

    elements.forEach((panel) => {
        const panelId = panel.getAttribute('id');
        const listItems = panel.querySelectorAll('li');
        const total = listItems.length;
        let count = 0;

        listItems.forEach((li, index) => {
            const padDiv = li.querySelector('div');
            if (padDiv) {
                padDiv.style.padding = '0px';
                padDiv.style.paddingLeft = '20px';
                const innerPadDiv = padDiv.querySelector('a > div');
                if (innerPadDiv) {
                    innerPadDiv.style.paddingLeft = '5px';
                    innerPadDiv.style.fontSize = '12px';
                    innerPadDiv.style.letterSpacing = '-0.5px';
                }
            }

            const anchor = li.querySelector('a');
            if (anchor) {
                // 체크박스가 이미 있으면 중복 추가 방지
                if (!li.querySelector('input[type="checkbox"]')) {
                    // div 생성
                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.alignItems = 'center';

                    // 체크박스 생성
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.style.width = '14px';
                    checkbox.style.height = '14px';
                    checkbox.style.cursor = 'pointer';

                    // 체크박스 상태 로컬 스토리지에서 불러오기
                    const key = `${panelId}-checkbox-${index}`;
                    const storedState = localStorage.getItem(key);
                    if (storedState === 'true') {
                        checkbox.checked = true;
                        count++;
                    }

                    // 체크박스 상태 변경 시 로컬 스토리지에 저장 및 count 갱신
                    checkbox.addEventListener('change', () => {
                        localStorage.setItem(key, checkbox.checked);
                        updateCount(panel, total, count);
                    });

                    // a 스타일 변경
                    anchor.style.display = 'inline';
                    anchor.style.backgroundColor = '';
                    anchor.style.paddingLeft = '8px';

                    // a 스타일을 container에 복사 (클래스 추가)
                    anchor.classList.forEach((className) => {
                        container.classList.add(className);
                    });

                    // div 안에 체크박스와 a 추가
                    container.appendChild(checkbox);
                    // container.appendChild(anchor);
                    container.appendChild(anchor);

                    // li에 새 div 추가
                    li.appendChild(container);
                }
            }
        });

        updateCount(panel, total, count);

        const previousAnchor = panel.parentElement.previousElementSibling;
        const badge = previousAnchor.querySelector('div > div > span');

        if (badge) {
            // hover 이벤트 추가
            previousAnchor.style.transition = 'all 0.5s';

            previousAnchor.addEventListener('mouseover', () => {
                badge.style.fontSize = '12px';
                badge.style.width = 'inherit';
                badge.style.height = '20px';
                badge.style.lineHeight = '20px';
                badge.style.paddingLeft = '8px';
                badge.style.paddingRight = '8px';
            });

            // hover 해제 시 원래 상태로 복구 (마우스 아웃)
            previousAnchor.addEventListener('mouseout', () => {
                badge.style.fontSize = '0px';
                badge.style.width = '10px';
                badge.style.height = '10px';
                badge.style.lineHeight = '0px';
                badge.style.paddingLeft = '0px';
                badge.style.paddingRight = '0px';
            });
        }
    });
}

// count를 업데이트하고 p 내용 갱신
function updateCount(panel, total, initialCount = null) {
    const parentDiv = panel.parentElement;

    if (parentDiv) {
        const previousAnchor = parentDiv.previousElementSibling;
        if (previousAnchor) {
            const div = previousAnchor.querySelector('div');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'space-between';
            div.style.flexGrow = '1';

            // innerDiv
            let innerDiv = div.querySelector('div');
            if (!innerDiv) {
                innerDiv = document.createElement('div');
                div.appendChild(innerDiv);
            }
            innerDiv.style.display = 'flex';
            innerDiv.style.alignItems = 'center';
            innerDiv.style.gap = '8px';

            let p = innerDiv.querySelector('p');

            // count 재계산
            let count = initialCount !== null ? initialCount : 0;
            const listItems = panel.querySelectorAll('li');
            listItems.forEach((li) => {
                const checkbox = li.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    count++;
                }
            });

            updateState(innerDiv, count, total);

            if (!p) {
                p = document.createElement('p');
                innerDiv.appendChild(p);
            }

            p.textContent = `${count} / ${total}`;
        }
    }
}

// badge의 state 갱신
function updateState(innerDiv, count, total) {
    let badge = innerDiv.querySelector('span');
    if (!badge) {
        badge = document.createElement('span');
        innerDiv.appendChild(badge);
    }

    let state = '';
    if (count === 0) {
        state = '시작 전';
        badge.style.backgroundColor = '#d4d5d6';
    } else if (count < total) {
        state = '진행 중';
        badge.style.backgroundColor = '#abd5ff';
    } else {
        state = '완료';
        badge.style.backgroundColor = '#c5ebc8';
    }

    badge.textContent = state;

    badge.style.display = 'inline-block';
    badge.style.width = '10px';
    badge.style.height = '10px';
    badge.style.lineHeight = '0px';
    badge.style.textAlign = 'center';
    badge.style.fontSize = '0px';
    badge.style.paddingLeft = '0px';
    badge.style.paddingRight = '0px';
    badge.style.borderRadius = '40px';
}

// DOM 변경 감지
const observer = new MutationObserver(() => {
    addCheckboxes();
});

// DOM 변경 감지 시작
observer.observe(document.body, {
    childList: true,
    subtree: true,
});

// 초기 체크박스 추가 실행
addCheckboxes();
