function addCheckboxes() {
    const elements = document.querySelectorAll('[id^="react-collapsed-panel"]');

    elements.forEach((panel) => {
        const panelId = panel.getAttribute('id');
        const listItems = panel.querySelectorAll('li');

        listItems.forEach((li, index) => {
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
                    checkbox.style.width = '20px';
                    checkbox.style.height = '20px';

                    // 체크박스 상태 로컬 스토리지에서 불러오기
                    const key = `${panelId}-checkbox-${index}`;
                    const storedState = localStorage.getItem(key);
                    if (storedState === 'true') {
                        checkbox.checked = true;
                    }

                    // 체크박스 상태 변경 시 로컬 스토리지에 저장
                    checkbox.addEventListener('change', () => {
                        localStorage.setItem(key, checkbox.checked);
                    });

                    // a 스타일 변경
                    anchor.style.display = 'inline';
                    anchor.style.backgroundColor = '';

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
    });

    return elements.filter((el, idx) => idx === 0);
}

// MutationObserver로 DOM 변경 감지
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
