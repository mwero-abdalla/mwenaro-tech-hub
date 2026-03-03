import axios, { AxiosInstance } from "axios";


/**
 * STK Push request parameters.
 */
export interface StkPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  callbackUrl?: string;
}

/**
 * STK Push response structure.
 */
export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string; // '0' for success
  ResponseDescription: string;
  CustomerMessage: string;
}

/**
 * Transaction query response structure.
 */
export interface QueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string; // '0' means payment completed successfully
  ResultDesc: string;
}

export class DarajaApiSdk {
  private axios: AxiosInstance;
  private consumerKey: string;
  private consumerSecret: string;
  private shortCode: string;
  private passkey: string;
  private baseUrl: string;

  constructor(options?: {
    consumerKey?: string;
    consumerSecret?: string;
    shortCode?: string;
    passkey?: string;
    baseUrl?: string;
  }) {
    this.consumerKey = options?.consumerKey || process.env.DARAJA_CONSUMER_KEY || process.env.MPESA_CONSUMER_KEY || "";
    this.consumerSecret = options?.consumerSecret || process.env.DARAJA_CONSUMER_SECRET || process.env.MPESA_CONSUMER_SECRET || "";
    this.shortCode = options?.shortCode || process.env.DARAJA_SHORT_CODE || process.env.MPESA_SHORTCODE || "174379";
    this.passkey = options?.passkey || process.env.DARAJA_PASSKEY || process.env.MPESA_PASSKEY || "";
    this.baseUrl = options?.baseUrl || process.env.DARAJA_BASE_URL || "https://sandbox.safaricom.co.ke";
    this.axios = axios.create({ baseURL: this.baseUrl });
  }

  /**
   * Initiate an STK Push request.
   */
  async stkPush(request: StkPushRequest): Promise<StkPushResponse> {
    this.validateStkPushRequest(request);

    // Automatically format phone number to 254XXXXXXXXX
    const formattedPhone = this.formatPhoneNumber(request.phoneNumber);

    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString("base64");

    // Use callback URL from request or environment
    const callbackUrl = request.callbackUrl || process.env.DARAJA_CALLBACK_URL;
    if (!callbackUrl) throw new Error("A callback URL must be provided in either the request or DARAJA_CALLBACK_URL environment variable.");

    try {
      const response = await this.axios.post(
        "/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: request.amount,
          PartyA: formattedPhone,
          PartyB: this.shortCode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: request.accountReference,
          TransactionDesc: request.transactionDesc,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Log successful initiation
      const data = response.data as StkPushResponse;
      if (data.ResponseCode !== '0') {
        throw new Error(`Safaricom Error ${data.ResponseCode}: ${data.ResponseDescription}`);
      }

      return data;
    } catch (error: any) {
      throw new Error(
        `STK Push failed: ${error.response?.data?.errorMessage || error.message}`
      );
    }
  }

  /**
   * Query the status of an STK Push transaction.
   * Useful when the callback is delayed or you need immediate verification.
   */
  async queryTransactionStatus(checkoutRequestID: string): Promise<QueryResponse> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString("base64");

    try {
      const response = await this.axios.post(
        "/mpesa/stkpushquery/v1/query",
        {
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestID,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data as QueryResponse;
    } catch (error: any) {
      throw new Error(
        `Transaction query failed: ${error.response?.data?.errorMessage || error.message}`
      );
    }
  }

  /**
   * Get OAuth access token.
   */
  async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
    try {
      const response = await this.axios.get("/oauth/v1/generate?grant_type=client_credentials", {
        headers: { Authorization: `Basic ${credentials}` },
      });
      return response.data.access_token;
    } catch (error: any) {
      throw new Error(
        `Failed to get access token: ${error.response?.data?.errorMessage || error.message}`
      );
    }
  }

  /**
   * Helper: Format phone number to 254XXXXXXXXX
   */
  private formatPhoneNumber(phoneNumber: string): string {
    let formatted = phoneNumber.trim().replace(/\+/g, "");

    // Replace leading 0 with 254
    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.substring(1);
    }
    // Prepend 254 to 9-digit numbers (e.g. 7XXXXXXXX)
    else if (formatted.length === 9) {
      formatted = "254" + formatted;
    }

    // Basic validation
    if (!/^254\d{9}$/.test(formatted)) {
      throw new Error("Invalid phone number format. Expected format: 07XXXXXXXX, +254XXXXXXXXX, or 254XXXXXXXXX.");
    }

    return formatted;
  }

  private getTimestamp(): string {
    const date = new Date();
    return (
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getSeconds()).padStart(2, "0")
    );
  }

  private validateStkPushRequest(request: StkPushRequest) {
    if (!request.phoneNumber || !request.amount || !request.accountReference || !request.transactionDesc) {
      throw new Error("Missing required STK Push parameters (phoneNumber, amount, accountReference, transactionDesc).");
    }
  }
}

export const darajaApiSdk = new DarajaApiSdk();
