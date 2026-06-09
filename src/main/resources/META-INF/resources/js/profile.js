window.onload = function() {
    fetch('/profile/info')
        .then(res => res.json())
        .then(data => {
            const profileLink = document.getElementById('profileNavLink');
            if (profileLink) {
                profileLink.setAttribute('data-bs-title', '🙌' + data.username);
                new bootstrap.Tooltip(profileLink);
            }
            document.getElementById('infoUsername').textContent = data.username;
            document.getElementById('infoEmail').textContent = data.email;
            document.getElementById('infoPhone').textContent = data.phone;
            if (data.profileImage) {
                document.getElementById('profileImg').src = '/uploads/profile/' + data.profileImage;
            }
        });

    // ✅ URL 파라미터 오류 감지 추가
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error === 'invalid_type') {
        const msg = document.getElementById('uploadErrorMsg');
        msg.classList.remove('d-none');
        msg.textContent = 'jpg, png, gif, webp 파일만 가능합니다.';
    } else if (error === 'too_large') {
        const msg = document.getElementById('uploadErrorMsg');
        msg.classList.remove('d-none');
        msg.textContent = '파일 크기는 5MB 이하여야 합니다.';
    } else if (error === 'upload_fail') {
        const msg = document.getElementById('uploadErrorMsg');
        msg.classList.remove('d-none');
        msg.textContent = '업로드 실패. 다시 시도해주세요.';
    }
};