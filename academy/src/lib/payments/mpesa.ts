'use server'

/**
 * M-Pesa Daraja API Integration (STK Push)
 */

import { darajaApiSdk } from './DarajaApiSdk';

export async function getDarajaAccessToken() {
    try {
        return await darajaApiSdk.getAccessToken();
    } catch (error) {
        console.error('Error getting Daraja access token:', error);
        return null;
    }
}

export async function initiateStkPush(phoneNumber: string, amount: number, accountReference: string) {
    try {
        const result = await darajaApiSdk.stkPush({
            phoneNumber,
            amount,
            accountReference,
            transactionDesc: `Payment for ${accountReference}`,
        });

        return {
            success: true,
            merchantRequestID: result.MerchantRequestID,
            checkoutRequestID: result.CheckoutRequestID,
            message: result.CustomerMessage
        };
    } catch (error: any) {
        console.error('Error initiating STK push:', error);
        return { success: false, message: error.message || 'STK Push failed' };
    }
}
