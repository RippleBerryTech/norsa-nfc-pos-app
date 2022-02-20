import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {routeNames} from '~/navigation/routeNames';

// Common

export interface PosPrinterInterface {
  print: (textToBePrinted: string) => Promise<boolean>;
}

export interface EmptyProps {}

export type NfcTagReadResult = {
  success: boolean;
  error: string;
  text: string;
};

export type NfcTagWriteResult = {
  success: boolean;
  error: string;
};

export type ParseTagResult = {
  success: boolean;
  error: string;
  text: string;
};

export type NfcTagOperationStatus = 'scanning' | 'error' | 'success' | 'none';

// Api Requests and Responses

export type LoginData = {
  id?: string;
  accessToken?: string;
  refreshToken?: string;
  dormantUser?: number;
  isAdmin?: number;
  expiryDate?: number;
};

export type LoginApiRequest = {
  email: string;
  password: string;
};

export type LoginApiResponse = {
  result?: string;
  message?: string;
  data?: LoginData;
};

export type LoginSuccessResponse = {
  data?: LoginData;
};

export type GeneralFailureResponse = {
  message?: string;
};

export type LoginResponse = LoginSuccessResponse & GeneralFailureResponse;

export type IssuanceHistory = {
  id?: string;
  Client_id?: string;
  Pincode?: string;
  DateTime?: string;
  Amount?: string;
  AmountPaid?: string;
  Balance?: string;
  clientCode?: string;
  clientName?: string;
};

export type GetIssuanceHistoryApiRequest = {
  nfcCardId: string;
};

export type GetIssuanceHistoryApiResponse = {
  error?: string;
  data?: {
    data?: {
      id?: string;
      Client_id?: string;
      Pincode?: string;
      DateTime?: string;
      Amount?: string;
      AmountPaid?: string;
      Balance?: string;
    };
    clientCodeAndFullName?: {
      Code?: string;
      FullName?: string;
    };
  };
};

export type GetIssuanceHistorySuccessResponse = {
  data?: IssuanceHistory;
};

export type GetIssuanceHistoryResponse = GetIssuanceHistorySuccessResponse &
  GeneralFailureResponse;

export type Client = {
  id: string;
  code: string;
  name: string;
};

export type GetClientApiResponse = Client | null;

export type GetClientSuccessResponse = {
  data?: Client;
};

export type GetClientResponse = GetClientSuccessResponse &
  GeneralFailureResponse;

export type CreateTransactionHistoryApiResponse = {
  message?: string;
};

export type Transaction = {
  Client_id: string;
  Merchant_ID: string;
  IssuanceHistoryId: string;
  ItemDescription: 'Expense';
  dateTime: string;
  AmountUser: number;
};

export type CreateTransactionHistoryResponse = {
  success: boolean;
  message?: string;
};

export type MerchantId = {
  id?: string;
};

export type GetMerchantIdApiResponse = {
  success?: string;
  data?: Array<MerchantId>;
};

export type GetMerchantIdSuccessResponse = {
  data?: string;
};

export type GetMerchantIdResponse = GetMerchantIdSuccessResponse &
  GeneralFailureResponse;

export type DailyTransaction = {
  id?: string;
  Client_id?: string;
  Merchant_ID?: string;
  ItemDescription?: string;
  dateTime?: string;
  AmountUser?: number;
  issuancehistoryId?: string;
};

export type GetDailyTransactionsApiResponse = {
  message?: string;
  data?: Array<DailyTransaction>;
};

export type GetDailyTransactionsSuccessResponse = {
  data?: Array<DailyTransaction>;
};

export type GetDailyTransactionsResponse = GetDailyTransactionsSuccessResponse &
  GeneralFailureResponse;

// Context

export type AuthContext = {
  isLoading: boolean;
  isLoggedIn: boolean;
  loginData: LoginData | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  onLoginSuccess: (data: LoginData) => void;
  checkUserSession: () => Promise<void>;
};

export type AuthContextValue = AuthContext | undefined;

// Navigation

export type SplashStackParamList = {
  [routeNames.Splash]: undefined;
};

export type AuthStackParamList = {
  [routeNames.Login]: undefined;
};

export type MainStackParamList = {
  [routeNames.Home]: undefined;
  [routeNames.PrintExpense]: {
    client: Client;
    balance: number;
    cardId: string;
    pinCode: string;
    issuanceHistoryId: string;
  };
};

export type RootStackParamList = SplashStackParamList &
  AuthStackParamList &
  MainStackParamList;

export type HomeScreenNavProp = StackNavigationProp<
  MainStackParamList,
  routeNames.Home
>;

export type AddItemsScreeProps = StackScreenProps<
  MainStackParamList,
  routeNames.PrintExpense
>;
