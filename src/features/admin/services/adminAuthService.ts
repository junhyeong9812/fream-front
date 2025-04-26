import apiClient from "src/global/services/ApiClient";
import {
  AdminLoginStatus,
  AdminLoginResponse,
  AdminTokenResponse,
} from "src/features/admin/types/AdminLoginTypes";

// 로컬 스토리지 키 상수
const ADMIN_LOGIN_STATUS_KEY = "isAdminLoggedIn";

/**
 * 관리자 로그인 요청 함수
 * @param email 관리자 이메일
 * @param password 관리자 비밀번호
 * @returns 로그인 성공 시 "yes", 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminLoginData = async (
  email: string,
  password: string
): Promise<string> => {
  console.log("adminAuthService: 로그인 요청 시작", { email });

  try {
    // 실제 API 호출
    const response = await apiClient.post("/admin/auth/login", {
      email,
      password,
    });

    console.log("adminAuthService: 로그인 응답 받음", {
      status: response.status,
    });

    // 서버 응답이 성공이면 로그인 상태 저장
    if (response.status === 200) {
      console.log("adminAuthService: 로그인 성공");

      // 로그인 상태 저장 - 액세스 토큰과 동일한 30분으로 설정
      const loginStatus: AdminLoginStatus = {
        value: "true",
        expire: Date.now() + 30 * 60 * 1000, // 30분
      };
      localStorage.setItem(ADMIN_LOGIN_STATUS_KEY, JSON.stringify(loginStatus));

      return "yes";
    }

    console.log("adminAuthService: 로그인 실패");
    return "no";
  } catch (error) {
    console.error("adminAuthService: 로그인 중 오류:", error);

    // 에러 상세 정보 확인
    if (error.response) {
      console.log("adminAuthService: 에러 응답", {
        status: error.response.status,
        data: error.response.data,
      });

      // 관리자 권한 없음
      if (error.response.status === 403) {
        return "not_admin";
      }
      // 로그인 정보 불일치
      else if (error.response.status === 401) {
        return "invalid_credentials";
      }
    }

    return "no";
  }
};

/**
 * 쿠키 존재 여부 확인 유틸리티 함수
 * @param cookieName 확인할 쿠키 이름
 * @returns 쿠키 존재 여부
 */
const cookieExists = (cookieName: string): boolean => {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${cookieName}=`));
};

/**
 * 관리자 로그인 상태 확인 - 오류 처리 강화 버전
 * @returns 로그인 상태 여부 (true/false)
 */
export const checkAdminLoginStatus = async (): Promise<boolean> => {
  console.log("adminAuthService: 로그인 상태 확인 시작");

  try {
    // 로그인 상태 확인
    const loginDataStr = localStorage.getItem(ADMIN_LOGIN_STATUS_KEY);
    if (!loginDataStr) {
      console.log("adminAuthService: 로그인 상태 정보 없음");
      return false;
    }

    console.log("adminAuthService: 저장된 로그인 상태", { loginDataStr });

    // 이전 방식 (문자열로만 저장된 경우) 처리
    if (loginDataStr === "true") {
      console.log("adminAuthService: 이전 방식 로그인 정보 확인");

      // 토큰 유효성 체크
      const isValid = await isAdminTokenValid();
      if (!isValid) {
        console.log("adminAuthService: 토큰 유효하지 않음, 로그아웃 처리");
        localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
        return false;
      }

      // 업데이트된 형식으로 저장 - 30분 설정
      const loginStatus: AdminLoginStatus = {
        value: "true",
        expire: Date.now() + 30 * 60 * 1000, // 30분
      };
      localStorage.setItem(ADMIN_LOGIN_STATUS_KEY, JSON.stringify(loginStatus));

      return true;
    }

    // 새 방식 (객체로 저장된 경우)
    const loginData = JSON.parse(loginDataStr) as AdminLoginStatus;
    console.log("adminAuthService: 새 방식 로그인 정보 확인", {
      value: loginData.value,
      expire: loginData.expire,
      currentTime: Date.now(),
      isExpired: loginData.expire <= Date.now(),
    });

    // 만료 시간이 지났는지 확인
    if (loginData.expire <= Date.now() || loginData.value !== "true") {
      console.log("adminAuthService: 로그인 상태 만료됨, 리프레시 시도");

      // 리프레시 토큰 쿠키 확인
      if (!cookieExists("REFRESH_TOKEN")) {
        console.log("adminAuthService: 리프레시 토큰 쿠키 없음, 로그아웃 처리");
        localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
        return false;
      }

      // 리프레시 토큰으로 액세스 토큰 갱신 시도
      try {
        const refreshed = await refreshAdminToken();
        if (!refreshed) {
          console.log("adminAuthService: 토큰 갱신 실패, 로그아웃 처리");
          localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
        }
        return refreshed; // 리프레시 성공 여부 반환
      } catch (error) {
        console.log("adminAuthService: 토큰 갱신 실패, 로그아웃 처리");
        localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
        return false;
      }
    }

    // 토큰이 만료되지 않았지만 유효성 추가 검증
    const isAccessTokenExists = cookieExists("ACCESS_TOKEN");
    if (!isAccessTokenExists) {
      console.log("adminAuthService: 액세스 토큰 쿠키 없음, 리프레시 시도");
      const refreshed = await refreshAdminToken();
      if (!refreshed) {
        localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
      }
      return refreshed;
    }

    console.log("adminAuthService: 로그인 상태 유효함");
    return true;
  } catch (e) {
    console.error("adminAuthService: 로그인 상태 확인 중 오류:", e);
    localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
    return false;
  }
};

/**
 * 관리자 토큰 유효성 확인을 위한 API 호출
 * @returns 토큰 유효 여부
 */
export const isAdminTokenValid = async (): Promise<boolean> => {
  try {
    // 토큰 유효성 확인 API 호출
    console.log("adminAuthService: 토큰 유효성 확인 API 호출");

    // 액세스 토큰 쿠키 확인
    if (!cookieExists("ACCESS_TOKEN")) {
      console.log("adminAuthService: 액세스 토큰 쿠키 없음");
      return false;
    }

    const response = await apiClient.get("/admin/auth/check", {
      timeout: 5000, // 5초 타임아웃 설정
    });

    console.log("adminAuthService: 토큰 유효성 확인 성공", {
      status: response.status,
    });

    return response.status === 200;
  } catch (error) {
    console.log("adminAuthService: 토큰 유효성 확인 실패", error);

    // 에러 상세 정보 확인
    if (error.response) {
      console.log("adminAuthService: 토큰 유효성 검증 에러 응답", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    return false;
  }
};

/**
 * 관리자 토큰 갱신 - 오류 처리 강화 버전
 * @returns 성공 여부를 포함한 Promise
 */
export const refreshAdminToken = async (): Promise<boolean> => {
  console.log("adminAuthService: 토큰 갱신 시도");

  try {
    // 리프레시 토큰 쿠키 존재 여부 확인
    if (!cookieExists("REFRESH_TOKEN")) {
      console.log("adminAuthService: 리프레시 토큰이 쿠키에 존재하지 않음");
      // 로그인 상태 초기화
      localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
      return false;
    }

    // 리프레시 토큰으로 새 액세스 토큰 요청
    const response = await apiClient.post(
      "/admin/auth/refresh",
      {},
      {
        timeout: 8000, // 8초 타임아웃 설정
        validateStatus: (status) => status >= 200 && status < 300, // 2xx 상태 코드만 성공으로 간주
      }
    );

    console.log("adminAuthService: 토큰 갱신 응답 받음", {
      status: response.status,
      data: response.data,
    });

    if (response.status === 200) {
      console.log("adminAuthService: 토큰 갱신 성공");

      // 로그인 상태 갱신 - 액세스 토큰과 동일한 30분으로 설정
      const loginStatus: AdminLoginStatus = {
        value: "true",
        expire: Date.now() + 30 * 60 * 1000, // 30분
      };
      localStorage.setItem(ADMIN_LOGIN_STATUS_KEY, JSON.stringify(loginStatus));
      return true;
    }

    console.log("adminAuthService: 토큰 갱신 실패 - 성공적인 응답이 아님");
    return false;
  } catch (error) {
    console.error("adminAuthService: 토큰 갱신 중 오류:", error);

    // 세부 오류 정보 로깅
    if (error.response) {
      console.log("adminAuthService: 서버 응답 오류", {
        status: error.response.status,
        data: error.response.data,
      });

      // 401/403 오류인 경우 로그인 상태 초기화
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답을 받지 못한 경우
      console.log("adminAuthService: 요청 후 응답 없음", error.request);
    } else {
      // 요청 자체가 설정되지 않은 경우
      console.log("adminAuthService: 요청 설정 중 오류", error.message);
    }

    return false;
  }
};

/**
 * 관리자 로그아웃 함수
 * 서버에 로그아웃 요청 및 로컬 스토리지에서 로그인 정보 제거
 */
export const adminLogout = async (): Promise<boolean> => {
  console.log("adminAuthService: 로그아웃 시작");

  try {
    // 액세스 토큰 쿠키 확인
    const hasAccessToken = cookieExists("ACCESS_TOKEN");

    if (hasAccessToken) {
      // 서버에 로그아웃 요청
      try {
        await apiClient.post(
          "/admin/auth/logout",
          {},
          {
            timeout: 5000, // 5초 타임아웃 설정
          }
        );
        console.log("adminAuthService: 서버 로그아웃 요청 성공");
      } catch (error) {
        console.error("adminAuthService: 서버 로그아웃 요청 실패:", error);
        // 서버 요청 실패해도 계속 진행 (클라이언트 측 로그아웃)
      }
    } else {
      console.log(
        "adminAuthService: 액세스 토큰 없음, 서버 로그아웃 요청 생략"
      );
    }

    // 로컬 스토리지 초기화
    localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);

    return true;
  } catch (error) {
    console.error("adminAuthService: 관리자 로그아웃 중 오류:", error);
    // 오류가 발생해도 로컬 스토리지는 초기화
    localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
    return false;
  }
};

/**
 * 관리자 이메일 찾기
 * @param phone 휴대폰 번호
 * @returns 성공 시 이메일, 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminFindEmailData = async (
  phone: string
): Promise<string> => {
  try {
    const response = await apiClient.post<string>("/admin/auth/find-email", {
      phoneNumber: formatPhoneNumber(phone),
    });

    if (response.status === 200) {
      return response.data; // 이메일 주소 반환
    }

    return "no";
  } catch (error) {
    console.error("관리자 이메일 찾기 중 오류:", error);

    // 에러 응답에 따른 처리
    if (error.response && error.response.status === 403) {
      return "not_admin"; // 관리자 계정이 아님
    }

    return "no";
  }
};

/**
 * 관리자 비밀번호 찾기
 * @param phone 휴대폰 번호
 * @param email 이메일
 * @returns 성공 시 "yes", 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminFindPasswordData = async (
  phone: string,
  email: string
): Promise<string> => {
  try {
    const response = await apiClient.post("/admin/auth/find-password", {
      phoneNumber: formatPhoneNumber(phone),
      email,
    });

    if (response.status === 200) {
      return "yes";
    }

    return "no";
  } catch (error) {
    console.error("관리자 비밀번호 찾기 중 오류:", error);

    // 에러 응답에 따른 처리
    if (error.response) {
      if (error.response.status === 403) {
        return "not_admin"; // 관리자 계정이 아님
      } else if (error.response.status === 400) {
        return "invalid_phone"; // 전화번호 불일치
      }
    }

    return "no";
  }
};

/**
 * 전화번호 포맷 변경 함수
 * @param number 전화번호 (숫자만)
 * @returns 포맷된 전화번호 (예: 010-1234-5678)
 */
const formatPhoneNumber = (number: string) => {
  if (number.length === 11) {
    // "01012345678" -> "010-1234-5678"
    return number.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
  } else if (number.length === 10) {
    // "0101234567" -> "010-123-4567"
    return number.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
  }
  return number;
};
