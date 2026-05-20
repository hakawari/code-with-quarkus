// ① SHA-256 해시 함수 (브라우저 내장 Web Crypto API)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ② 확인 모달 출력 + 해시 생성
async function showConfirmModal() {
    const username = document.getElementById('username').value.trim();
    const email    = document.getElementById('email').value.trim();
    const phone    = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    // 모달에 유저가 입력한 정보 미리 보여주기
    document.getElementById('confirmUsername').textContent = username;
    document.getElementById('confirmEmail').textContent    = email;
    document.getElementById('confirmPhone').textContent    = phone;

    // SHA-256 해시 생성 -> hidden 필드(id="hashedPassword")에 저장
    const hashed = await hashPassword(password);
    document.getElementById('hashedPassword').value = hashed;

    // F12 콘솔에서 해시값 확인용
    console.log('해시된 패스워드 :', hashed);

    // Bootstrap 확인 모달 띄우기
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// ③ 가입하기 버튼 클릭 -> 최종 서버로 form submit
function submitRegister() {
    // 확인 모달 닫기
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    if (modalInstance) {
        modalInstance.hide();
    }

    // form submit -> POST /register_check 전송
    document.getElementById('registerForm').submit();
}