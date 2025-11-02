package com.bookinghomestay.app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "momo")
@Data
public class MoMoConfig {

    // MoMo Test/Sandbox credentials
    private String partnerCode = "MOMOBKUN20180529"; // Test partner code
    private String accessKey = "klm05TvNBzhg7h7j"; // Test access key
    private String secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa"; // Test secret key

    // MoMo Test endpoint
    private String endpoint = "https://test-payment.momo.vn"; // Sandbox URL

    // Callback URLs (customize based on your domain)
    private String returnUrl; // Will be set in application.properties
    private String notifyUrl; // Will be set in application.properties

    // MoMo API endpoints
    private String createPaymentUrl = "/v2/gateway/api/create";
    private String queryStatusUrl = "/v2/gateway/api/query";

    // Request type for MoMo
    private String requestType = "captureWallet";
}
