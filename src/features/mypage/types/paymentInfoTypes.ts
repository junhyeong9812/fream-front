export interface PaymentInfoCreateDto {
    cardNumber: string;       // 카드 번호
    cardPassword: string;     // 카드 비밀번호 앞 두 자리
    expirationDate: string;   // 유효기간
    birthDate: string;        // 생년월일
  }
  
  export interface PaymentInfoDto {
    id: number;
    cardNumber: string;       // 카드 번호
    cardPassword: string;     // 카드 비밀번호 앞 두 자리
    expirationDate: string;   // 유효기간
    birthDate: string;        // 생년월일
  }