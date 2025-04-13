import apiClient from "../../../global/services/ApiClient";
import { UserGrade } from "../types/userManagementTypes";

export class UserGradeService {
  private static ADMIN_GRADES_URL = "/admin/users/grades";

  /**
   * 모든 등급 조회
   */
  static async getAllGrades(): Promise<UserGrade[]> {
    const response = await apiClient.get(this.ADMIN_GRADES_URL);
    return response.data;
  }

  /**
   * 등급 상세 조회
   */
  static async getGradeById(gradeId: number): Promise<UserGrade> {
    const response = await apiClient.get(`${this.ADMIN_GRADES_URL}/${gradeId}`);
    return response.data;
  }

  /**
   * 등급 생성
   */
  static async createGrade(grade: UserGrade): Promise<UserGrade> {
    const response = await apiClient.post(this.ADMIN_GRADES_URL, grade);
    return response.data;
  }

  /**
   * 등급 수정
   */
  static async updateGrade(grade: UserGrade): Promise<UserGrade> {
    const response = await apiClient.put(
      `${this.ADMIN_GRADES_URL}/${grade.id}`,
      grade
    );
    return response.data;
  }

  /**
   * 등급 삭제
   */
  static async deleteGrade(gradeId: number): Promise<void> {
    await apiClient.delete(`${this.ADMIN_GRADES_URL}/${gradeId}`);
  }

  /**
   * 등급별 사용자 수 조회
   */
  static async getGradeUserCounts(): Promise<Record<number, number>> {
    const response = await apiClient.get(`${this.ADMIN_GRADES_URL}/counts`);
    return response.data;
  }

  /**
   * 등급 통계 조회
   */
  static async getGradeStatistics(): Promise<UserGrade[]> {
    const response = await apiClient.get(`${this.ADMIN_GRADES_URL}/statistics`);
    return response.data;
  }

  /**
   * 등급 자동 설정 실행
   * (구매액 기준으로 등급 자동 부여 배치 작업 수동 실행)
   */
  static async runGradeAutoAssignment(): Promise<{
    processed: number;
    updated: number;
  }> {
    const response = await apiClient.post(
      `${this.ADMIN_GRADES_URL}/auto-assign`
    );
    return response.data;
  }
}
