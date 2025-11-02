package com.bookinghomestay.app.infrastructure.payment;

import com.bookinghomestay.app.config.MoMoConfig;
import com.bookinghomestay.app.domain.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoMoPaymentService implements PaymentService {

    private final MoMoConfig moMoConfig;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Override
    public String createPaymentRequest(String orderId, BigDecimal amount, String orderInfo,
            String returnUrl, String notifyUrl) {
        try {
            // Prepare request data
            String requestId = orderId + System.currentTimeMillis();
            long amountLong = amount.longValue();

            // Build raw signature
            String rawSignature = "accessKey=" + moMoConfig.getAccessKey() +
                    "&amount=" + amountLong +
                    "&extraData=" +
                    "&ipnUrl=" + (notifyUrl != null ? notifyUrl : moMoConfig.getNotifyUrl()) +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderInfo +
                    "&partnerCode=" + moMoConfig.getPartnerCode() +
                    "&redirectUrl=" + (returnUrl != null ? returnUrl : moMoConfig.getReturnUrl()) +
                    "&requestId=" + requestId +
                    "&requestType=" + moMoConfig.getRequestType();

            // Generate signature
            String signature = hmacSHA256(rawSignature, moMoConfig.getSecretKey());

            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", moMoConfig.getPartnerCode());
            requestBody.put("accessKey", moMoConfig.getAccessKey());
            requestBody.put("requestId", requestId);
            requestBody.put("amount", amountLong);
            requestBody.put("orderId", orderId);
            requestBody.put("orderInfo", orderInfo);
            requestBody.put("redirectUrl", returnUrl != null ? returnUrl : moMoConfig.getReturnUrl());
            requestBody.put("ipnUrl", notifyUrl != null ? notifyUrl : moMoConfig.getNotifyUrl());
            requestBody.put("requestType", moMoConfig.getRequestType());
            requestBody.put("extraData", "");
            requestBody.put("lang", "vi");
            requestBody.put("signature", signature);

            // Send request to MoMo
            String requestBodyJson = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(moMoConfig.getEndpoint() + moMoConfig.getCreatePaymentUrl()))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // Parse response
            @SuppressWarnings("unchecked")
            Map<String, Object> responseMap = objectMapper.readValue(response.body(), Map.class);

            log.info("MoMo create payment response: {}", responseMap);

            // Return payment URL
            return (String) responseMap.get("payUrl");

        } catch (Exception e) {
            log.error("Error creating MoMo payment request", e);
            throw new RuntimeException("Failed to create MoMo payment request: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean verifyPaymentCallback(Map<String, String> requestParams) {
        try {
            String receivedSignature = requestParams.get("signature");

            // Build raw signature for verification
            String rawSignature = "accessKey=" + moMoConfig.getAccessKey() +
                    "&amount=" + requestParams.get("amount") +
                    "&extraData=" + requestParams.getOrDefault("extraData", "") +
                    "&message=" + requestParams.get("message") +
                    "&orderId=" + requestParams.get("orderId") +
                    "&orderInfo=" + requestParams.get("orderInfo") +
                    "&orderType=" + requestParams.get("orderType") +
                    "&partnerCode=" + moMoConfig.getPartnerCode() +
                    "&payType=" + requestParams.get("payType") +
                    "&requestId=" + requestParams.get("requestId") +
                    "&responseTime=" + requestParams.get("responseTime") +
                    "&resultCode=" + requestParams.get("resultCode") +
                    "&transId=" + requestParams.get("transId");

            String calculatedSignature = hmacSHA256(rawSignature, moMoConfig.getSecretKey());

            // Verify signature and result code
            boolean signatureValid = calculatedSignature.equals(receivedSignature);
            boolean paymentSuccess = "0".equals(requestParams.get("resultCode"));

            log.info("MoMo callback verification - Signature valid: {}, Payment success: {}",
                    signatureValid, paymentSuccess);

            return signatureValid && paymentSuccess;

        } catch (Exception e) {
            log.error("Error verifying MoMo callback", e);
            return false;
        }
    }

    @Override
    public String queryPaymentStatus(String orderId) {
        try {
            String requestId = orderId + System.currentTimeMillis();

            // Build raw signature
            String rawSignature = "accessKey=" + moMoConfig.getAccessKey() +
                    "&orderId=" + orderId +
                    "&partnerCode=" + moMoConfig.getPartnerCode() +
                    "&requestId=" + requestId;

            String signature = hmacSHA256(rawSignature, moMoConfig.getSecretKey());

            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", moMoConfig.getPartnerCode());
            requestBody.put("accessKey", moMoConfig.getAccessKey());
            requestBody.put("requestId", requestId);
            requestBody.put("orderId", orderId);
            requestBody.put("lang", "vi");
            requestBody.put("signature", signature);

            String requestBodyJson = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(moMoConfig.getEndpoint() + moMoConfig.getQueryStatusUrl()))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            @SuppressWarnings("unchecked")
            Map<String, Object> responseMap = objectMapper.readValue(response.body(), Map.class);

            log.info("MoMo query status response: {}", responseMap);

            int resultCode = (Integer) responseMap.get("resultCode");
            return resultCode == 0 ? "SUCCESS" : "FAILED";

        } catch (Exception e) {
            log.error("Error querying MoMo payment status", e);
            return "UNKNOWN";
        }
    }

    /**
     * Generate HMAC SHA256 signature
     */
    private String hmacSHA256(String data, String secretKey) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);

        byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1)
                hexString.append('0');
            hexString.append(hex);
        }

        return hexString.toString();
    }
}
