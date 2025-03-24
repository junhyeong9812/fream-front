import apiClient from "src/global/services/ApiClient";
import {
  BankAccountCreateDto,
  BankAccountResponseDto,
} from "../types/bankAccount";

export const bankAccountService = {
  // 은행 계좌 목록 가져오기
  getBankAccounts: async (): Promise<BankAccountResponseDto[]> => {
    const response = await apiClient.get<BankAccountResponseDto[]>(
      "/account-info"
    );
    return response.data;
  },

  // 은행 계좌 생성하기
  createBankAccount: async (account: BankAccountCreateDto): Promise<string> => {
    const response = await apiClient.post<string>("/account-info", account);
    return response.data;
  },

  // 은행 계좌 삭제하기
  deleteBankAccount: async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/account-info/${id}`);
    return response.data;
  },
};
