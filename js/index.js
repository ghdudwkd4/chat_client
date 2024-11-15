const apiClient = axios.create({
    baseUrl: '/api',
    withCredentials: true,
    headers: {"dataType":"text", "Content-Type":"application/json"}
})

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
            await apiClient.post('http://localhost:8080/api/auth/refresh', {}, { withCredentials: true })
                .then(response => {
                    localStorage.setItem("userId",response.data);
                    console.log(response);
                });
            return apiClient(originalRequest);
        } catch (refreshError) {
            // Refresh Token도 만료된 경우 로그아웃 처리
            // alert('Refresh Token도 만료되었습니다. 다시 로그인하세요.');
            // window.location.href = '/chat_client/login/login.html'; // 로그인 페이지로 이동
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});
