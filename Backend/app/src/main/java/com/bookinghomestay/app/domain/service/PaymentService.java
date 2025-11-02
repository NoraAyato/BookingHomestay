package com.bookinghomestay.app.domain.service;

import java.math.BigDecimal;

/**
 * Domain interface for payment operations
 * Implementations will be in infrastructure layer (MoMo, VNPay, etc.)
 */
public interface PaymentService {

    /**
     * Create a payment request and return payment URL
     * 
     * @param orderId   Booking/Invoice ID
     * @param amount    Amount to pay
     * @param orderInfo Description
     * @param returnUrl URL to redirect after payment
     * @param notifyUrl URL to receive payment notification
     * @return Payment URL for redirect
     */
    String createPaymentRequest(String orderId, BigDecimal amount, String orderInfo,
            String returnUrl, String notifyUrl);

    /**
     * Verify payment callback/IPN from payment gateway
     * 
     * @param requestParams Raw parameters from payment gateway
     * @return true if payment is valid and successful
     */
    boolean verifyPaymentCallback(java.util.Map<String, String> requestParams);

    /**
     * Query payment status from payment gateway
     * 
     * @param orderId Order ID to query
     * @return Payment status (SUCCESS, PENDING, FAILED, etc.)
     */
    String queryPaymentStatus(String orderId);
}
