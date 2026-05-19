function toggleTheme() {
    // 1. 전체 문서(html 태그)의 테마 속성 가져오기
    const htmlTag = document.documentElement;
    const currentTheme = htmlTag.getAttribute('data-bs-theme');
    
    // 2. 제어할 요소들 가져오기
    const themeBtn = document.getElementById('themeToggleBtn');
    const navbar = document.querySelector('.navbar');
    const body = document.body;
    const heroSection = document.querySelector('.hero'); // 히어로 배너

    // 3. 현재 테마가 dark(기본값)이면 light로, 아니면 dark로 전환
    if (currentTheme === 'dark' || !currentTheme) {
        // [라이트 모드로 전환]
        htmlTag.setAttribute('data-bs-theme', 'light');
        themeBtn.textContent = 'LIGHT';
        themeBtn.className = 'btn border-0 text-dark'; 
        
        // 네비바 색상 라이트로 변경
        navbar.classList.remove('navbar-dark', 'bg-dark');
        navbar.classList.add('navbar-light', 'bg-light');

        // 메인 body 배경색 흰색으로 변경
        body.style.backgroundColor = '#ffffff'; 
        body.style.color = '#212529';

        // 🌟 히어로 배너 이미지 강제로 날리고 밝은 배경 넣기!
        if (heroSection) {
            heroSection.style.backgroundImage = 'none'; // CSS에 깔린 어두운 배경 이미지 제거
            heroSection.style.backgroundColor = '#e9ecef'; // 밝은 회색 톤으로 채우기
            heroSection.style.color = '#212529';           // 글자색 검은색 고정
        }

    } else {
        // [다크 모드로 전환]
        htmlTag.setAttribute('data-bs-theme', 'dark');
        themeBtn.textContent = 'DARK';
        themeBtn.className = 'btn border-0 text-white'; 
        
        // 네비바 색상 다크로 원복
        navbar.classList.remove('navbar-light', 'bg-light');
        navbar.classList.add('navbar-dark', 'bg-dark');

        // 메인 body 배경색 어둡게 원복
        body.style.backgroundColor = '#0a0e17'; 
        body.style.color = '#ffffff';

        // 🌟 히어로 배너 원래 다크 모드 스타일로 원복!
        if (heroSection) {
            heroSection.style.backgroundImage = ''; // 이 값을 비워두면 기존 main.css에 있던 원래 배경 이미지가 다시 복구됩니다.
            heroSection.style.backgroundColor = ''; // 원래 스타일로 원복
            heroSection.style.color = '#ffffff';     // 글자색 흰색으로 원복
        }
    }
}