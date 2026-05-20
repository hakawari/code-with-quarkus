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

    // ② 패스워드 : 8자 이상, 영문+숫자+특수문자
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

    // 전체 통과 시 확인 모달 출력 (교수님 PPT 요청 변경 내용)
    if (valid) {
        showConfirmModal();
    }
}

// PPT 구현 사항: 에러 표시 기능
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
    }
    const msg = document.getElementById(fieldId + 'Msg');
    if (msg) {
        msg.textContent = message;
        msg.style.display = 'block'; // 화면에 표시
    }
}

// PPT 구현 사항: 에러 제거 기능
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('is-invalid');
    }
    const msg = document.getElementById(fieldId + 'Msg');
    if (msg) {
        msg.textContent = '';
        msg.style.display = 'none'; // 화면에서 숨김
    }
}

// 주소창의 error 파라미터를 분석해 중복 검사 에러를 띄워주는 함수
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error === 'duplicate_username') {
        showError('username', '이미 사용 중인 아이디입니다.');
    } else if (error === 'duplicate_email') {
        showError('email', '이미 사용 중인 이메일입니다.');
    }
}

// 임시 모달 창 트리거 함수 (다음 PPT에서 모달 HTML 코드가 추가될 예정입니다)
function showConfirmModal() {
    console.log("모달 표시 호출됨");
    alert("회원가입 확인 모달을 띄웁니다! (다음 단계에서 HTML 모달 코드가 추가될 예정입니다)");
}