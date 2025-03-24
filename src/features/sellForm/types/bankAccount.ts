export interface BankAccountCreateDto {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
}

export interface BankAccountResponseDto {
  id: number;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
}
