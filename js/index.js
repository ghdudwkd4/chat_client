const apiClient = axios.create({
    baseUrl: '/api',
    withCredentials: true,
    headers: {"dataType":"text", "Content-Type":"application/json"}
})

// 요청 인터셉터 (예: Access Token이 있는 경우 요청 헤더에 추가)
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken'); // Access Token 저장 위치에 따라 변경
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 응답 인터셉터 (Access Token 만료 시 처리)
apiClient.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;

    // Access Token 만료 에러인 경우 (예: HTTP 401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 무한 재요청 방지

        try {
            // /refresh 요청을 보내어 새로운 Access Token 발급받기
            const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });

            const newAccessToken = response.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken); // 새로운 토큰 저장

            // 기존 요청에 새로운 Access Token을 설정하고 재요청
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            // Refresh Token도 만료된 경우 로그아웃 처리
            // console.error('Refresh Token도 만료되었습니다. 다시 로그인하세요.');
            alert('Refresh Token도 만료되었습니다. 다시 로그인하세요.');
            window.location.href = '/chat_client/login/login.html'; // 로그인 페이지로 이동
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});
