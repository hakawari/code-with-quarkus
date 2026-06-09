// 1. 유효성 검사 및 Bootstrap 모달 띄우기
function validateAndShowModal() {
    let valid = true;

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const email    = document.getElementById('email').value.trim();
    const phone    = document.getElementById('phone').value.trim();

    // ① 아이디 : 4~20자 영문/숫자
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
        showError('username', '아이디는 4~20자 영문/숫자만 가능합니다.');
        valid = false;
    } else {
        clearError('username');
    }

    // ② 패스워드 : 8자 이상, 영문+숫+특
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        showError('password', '8자 이상, 영문+숫자+특수문자를 포함 필요.');
        valid = false;
    } else {
        clearError('password');
    }

    // ③ 패스워드 확인
    if (password !== passwordConfirm) {
        showError('passwordConfirm', '패스워드가 일치하지 않습니다.');
        valid = false;
    } else {
        clearError('passwordConfirm');
    }

    // ④ 이메일 형식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', '올바른 이메일 형식이 아닙니다.');
        valid = false;
    } else {
        clearError('email');
    }

    // ⑤ 연락처 형식 : 010-0000-0000
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        showError('phone', '010-0000-0000 형식으로 입력해주세요.');
        valid = false;
    } else {
        clearError('phone');
    }

    // ✨ [구현 완료] 모든 검증 통과 시 모달창에 텍스트 주입 후 모달 오픈
    if (valid) {
        document.getElementById('confirmUsername').textContent = username;
        document.getElementById('confirmEmail').textContent = email;
        document.getElementById('confirmPhone').textContent = phone;

        // Bootstrap 모달 객체 생성 후 띄우기
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        confirmModal.show();
    }
}

// ✨ [구현 완료] 모달에서 '가입하기' 버튼을 눌렀을 때 실행되는 최종 전송 함수
function submitRegister() {
    const rawPassword = document.getElementById('password').value;
    
    // input_sha256.js의 라이브러리 함수를 사용해 비밀번호 암호화(소문자화)
    const hashedPassword = hex_sha256(rawPassword).toLowerCase();
    
    // hidden 타입 input 태그에 해시값 세팅
    document.getElementById('hashedPassword').value = hashedPassword;
    
    // 폼 서브밋 실행 (서버의 POST /register_check로 데이터 전송)
    document.getElementById('registerForm').submit();
}

// 에러 표시 기능
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
    }
    const msg = document.getElementById(fieldId + 'Msg');
    if (msg) {
        msg.textContent = message;
        msg.style.display = 'block'; 
    }
}

// 에러 제거 기능
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('is-invalid');
    }
    const msg = document.getElementById(fieldId + 'Msg');
    if (msg) {
        msg.textContent = '';
        msg.style.display = 'none'; 
    }
}

// ✨ [이름 변경 연동] 주소창 파라미터 분석을 통한 DB 중복 예외 처리 함수
function checkDuplicateErrors() {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error === 'duplicate_username') {
        showError('username', '이미 사용 중인 아이디입니다.');
    } else if (error === 'duplicate_email') {
        showError('email', '이미 사용 중인 이메일입니다.');
    }
}