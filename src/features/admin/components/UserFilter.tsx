import React, { useState, useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { UserSearchDto } from "../types/userManagementTypes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./UserFilter.module.css";
import { UserGradeService } from "../services/userGradeService";
import { UserGrade } from "../types/userManagementTypes";

interface UserFilterProps {
  onApplyFilter: (filter: UserSearchDto) => void;
  theme: string;
}

const UserFilter: React.FC<UserFilterProps> = ({ onApplyFilter, theme }) => {
  // Filter state
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [ageStart, setAgeStart] = useState<string>("");
  const [ageEnd, setAgeEnd] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [registrationDateStart, setRegistrationDateStart] =
    useState<Date | null>(null);
  const [registrationDateEnd, setRegistrationDateEnd] = useState<Date | null>(
    null
  );
  const [isVerified, setIsVerified] = useState<string>("");
  const [sellerGrade, setSellerGrade] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [shoeSize, setShoeSize] = useState<string>("");

  // Grades for dropdown
  const [grades, setGrades] = useState<UserGrade[]>([]);

  // Load grades on component mount
  useEffect(() => {
    const loadGrades = async () => {
      try {
        const response = await UserGradeService.getAllGrades();
        setGrades(response);
      } catch (err) {
        console.error("Failed to load grades:", err);
      }
    };

    loadGrades();
  }, []);

  // Handle apply filter
  const handleApplyFilter = () => {
    const filter: UserSearchDto = {};

    // Only add parameters if they have values
    if (email) filter.email = email;
    if (phoneNumber) filter.phoneNumber = phoneNumber;
    if (ageStart) filter.ageStart = parseInt(ageStart);
    if (ageEnd) filter.ageEnd = parseInt(ageEnd);
    if (gender && gender !== "ALL") filter.gender = gender;
    if (registrationDateStart)
      filter.registrationDateStart = registrationDateStart
        .toISOString()
        .split("T")[0];
    if (registrationDateEnd)
      filter.registrationDateEnd = registrationDateEnd
        .toISOString()
        .split("T")[0];
    if (isVerified) filter.isVerified = isVerified === "true";
    if (sellerGrade && sellerGrade !== "ALL")
      filter.sellerGrade = parseInt(sellerGrade);
    if (role && role !== "ALL") filter.role = role;
    if (shoeSize && shoeSize !== "ALL") filter.shoeSize = shoeSize;

    onApplyFilter(filter);
  };

  // Handle reset
  const handleReset = () => {
    setEmail("");
    setPhoneNumber("");
    setAgeStart("");
    setAgeEnd("");
    setGender("");
    setRegistrationDateStart(null);
    setRegistrationDateEnd(null);
    setIsVerified("");
    setSellerGrade("");
    setRole("");
    setShoeSize("");
  };

  return (
    <div
      className={`${styles.filterPanel} ${theme === "dark" ? styles.dark : ""}`}
    >
      <h3 className={styles.filterTitle}>상세 검색</h3>

      <div className={styles.filterGrid}>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>이메일</label>
          <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>전화번호</label>
          <input
            type="text"
            placeholder="전화번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>연령</label>
          <div className={styles.rangeInputs}>
            <input
              type="number"
              placeholder="최소"
              value={ageStart}
              onChange={(e) => setAgeStart(e.target.value)}
              className={styles.filterInput}
              min="0"
            />
            <span className={styles.rangeSeparator}>~</span>
            <input
              type="number"
              placeholder="최대"
              value={ageEnd}
              onChange={(e) => setAgeEnd(e.target.value)}
              className={styles.filterInput}
              min="0"
            />
          </div>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>성별</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">전체</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="OTHER">기타</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>가입일</label>
          <div className={styles.rangeInputs}>
            <DatePicker
              selected={registrationDateStart}
              onChange={(date) => setRegistrationDateStart(date)}
              selectsStart
              startDate={registrationDateStart}
              endDate={registrationDateEnd}
              placeholderText="시작일"
              dateFormat="yyyy-MM-dd"
              className={styles.filterInput}
            />
            <span className={styles.rangeSeparator}>~</span>
            <DatePicker
              selected={registrationDateEnd}
              onChange={(date) => setRegistrationDateEnd(date)}
              selectsEnd
              startDate={registrationDateStart}
              endDate={registrationDateEnd}
              minDate={registrationDateStart ?? undefined}
              placeholderText="종료일"
              dateFormat="yyyy-MM-dd"
              className={styles.filterInput}
            />
          </div>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>본인인증</label>
          <select
            value={isVerified}
            onChange={(e) => setIsVerified(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">전체</option>
            <option value="true">인증 완료</option>
            <option value="false">미인증</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>판매자 등급</label>
          <select
            value={sellerGrade}
            onChange={(e) => setSellerGrade(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">전체</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.level}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>권한</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">전체</option>
            <option value="USER">일반 사용자</option>
            <option value="ADMIN">관리자</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>신발 사이즈</label>
          <select
            value={shoeSize}
            onChange={(e) => setShoeSize(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">전체</option>
            <option value="SIZE_220">220</option>
            <option value="SIZE_225">225</option>
            <option value="SIZE_230">230</option>
            <option value="SIZE_235">235</option>
            <option value="SIZE_240">240</option>
            <option value="SIZE_245">245</option>
            <option value="SIZE_250">250</option>
            <option value="SIZE_255">255</option>
            <option value="SIZE_260">260</option>
            <option value="SIZE_265">265</option>
            <option value="SIZE_270">270</option>
            <option value="SIZE_275">275</option>
            <option value="SIZE_280">280</option>
            <option value="SIZE_285">285</option>
            <option value="SIZE_290">290</option>
            <option value="SIZE_295">295</option>
            <option value="SIZE_300">300</option>
          </select>
        </div>
      </div>

      <div className={styles.filterActions}>
        <button className={styles.resetButton} onClick={handleReset}>
          <FiX /> 초기화
        </button>
        <button className={styles.applyButton} onClick={handleApplyFilter}>
          <FiCheck /> 적용
        </button>
      </div>
    </div>
  );
};

export default UserFilter;
