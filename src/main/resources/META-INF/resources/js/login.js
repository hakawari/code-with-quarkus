// [과제 요구사항 1] validateAndLogin() 함수 구현
function validateAndLogin() {
    let valid = true;

    // input 요소 가져오기 (PPT 힌트 ID 반영)
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // ① 아이디 유효성 검사 (4~20자 영문/숫자만 허용)
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
        // 실패 시: 3개 파라미터 규칙에 맞게 showError 호출
        showError(usernameInput, 'usernameMsg', '아이디는 4~20자의 영문/숫자이어야 합니다.');
        valid = false;
    } else {
        // 성공 시: clearError 호출
        clearError(usernameInput, 'usernameMsg');
    }

    // ② 패스워드 유효성 검사 (8자 이상, 영문+숫자+특수문자 포함)
    // 기존 input_check.js의 패스워드 정규식(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/) 참고
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
    if (!passwordRegex.test(password)) {
        // 실패 시: 3개 파라미터 규칙에 맞게 showError 호출
        showError(passwordInput, 'passwordMsg', '패스워드는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.');
        valid = false;
    } else {
        // 성공 시: clearError 호출
        clearError(passwordInput, 'passwordMsg');
    }

    // ③ 두 항목 모두 통과 시 로그인 실행
    if (valid) {
        submitLogin();
    }
}

// [과제 힌트 반영] 파라미터 3개짜리 로그인 전용 에러 표시 함수
function showError(inputElement, msgId, message) {
    if (inputElement) {
        inputElement.classList.add('is-invalid'); // 입력창 테두리 빨갛게
    }
    const msgElement = document.getElementById(msgId);
    if (msgElement) {
        msgElement.textContent = message;      // 에러 메시지 주입
        msgElement.style.display = 'block';     // 화면에 노출
    }
}

// 로그인 전용 에러 메시지 초기화 함수
function clearError(inputElement, msgId) {
    if (inputElement) {
        inputElement.classList.remove('is-invalid'); // 빨간 테두리 제거
    }
    const msgElement = document.getElementById(msgId);
    if (msgElement) {
        msgElement.textContent = '';
        msgElement.style.display = 'none';           // 메시지 숨김
    }
}

// 최종 Form 전송 함수
function submitLogin() {
    // login.html의 Form 태그를 찾아 자동으로 백엔드 전송
    document.getElementById('loginForm').submit();
}