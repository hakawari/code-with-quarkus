// test.js 수정→ Toast 함수제공
function showToast(message, type = 'success') {
    // type : 'success' (초록) / 'danger' (빨강) / 'warning' (노랑)
    const toastEl = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastBody');
    if (!toastEl || !toastBody) return;
    // 색상클래스변경
    toastEl.className =
        `toast align-items-center text-white bg-${type} border-0`;
    toastBody.textContent = message;
    // Bootstrap Toast 실행
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}
