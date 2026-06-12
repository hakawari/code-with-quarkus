// 로그인 유효성 검사 함수
function validateAndLogin() {
    let valid = true;

    // input 요소 가져오기
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // ① 아이디 유효성 검사 (4~20자 영문/숫자)
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
        showError(usernameInput, 'usernameMsg', '아이디는 4~20자의 영문/숫자이어야 합니다.');
        valid = false;
    } else {
        clearError(usernameInput, 'usernameMsg');
    }

    // ② 패스워드 유효성 검사 (8자 이상, 영문+숫자+특수문자)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
    if (!passwordRegex.test(password)) {
        showError(passwordInput, 'passwordMsg', '패스워드는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.');
        valid = false;
    } else {
        clearError(passwordInput, 'passwordMsg');
    }

    // ③ 두 항목 모두 통과 시 로그인 실행
    if (valid) {
        submitLogin();
    }
}

// 에러 표시 함수
function showError(inputElement, msgId, message) {
    if (inputElement) {
        inputElement.classList.add('is-invalid');
    }
    const msgElement = document.getElementById(msgId);
    if (msgElement) {
        msgElement.textContent = message;
        msgElement.style.display = 'block';
    }
}

// 에러 초기화 함수
function clearError(inputElement, msgId) {
    if (inputElement) {
        inputElement.classList.remove('is-invalid');
    }
    const msgElement = document.getElementById(msgId);
    if (msgElement) {
        msgElement.textContent = '';
        msgElement.style.display = 'none';
    }
}

// 폼 전송 함수
function submitLogin() {
    document.getElementById('loginForm').submit();
}

// 페이지 로드 시 URL 파라미터로 오류 감지
window.addEventListener('load', function() {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error === '1') {
        showError(document.getElementById('passwordInput'), 'passwordMsg', '아이디 또는 패스워드가 올바르지 않습니다.');
    }
});