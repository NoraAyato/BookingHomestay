package com.bookinghomestay.app.infrastructure.adapter;

import com.bookinghomestay.app.domain.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendResetPasswordEmail(String to, String resetToken) {
        String resetLink = "http://localhost:5173/reset-password?resetToken=" + resetToken;
        String htmlContent = "<div style='font-family:Arial,sans-serif;padding:24px;'>"
                + "<h2 style='color:#2d8cf0;'>Yêu cầu đặt lại mật khẩu</h2>"
                + "<p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>"
                + "<a href='" + resetLink
                + "' style='display:inline-block;padding:12px 24px;background:#2d8cf0;color:#fff;text-decoration:none;border-radius:4px;'>Đặt lại mật khẩu</a>"
                + "<p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>"
                + "<hr><small>BookingHomestay Team</small></div>";
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Đặt lại mật khẩu tài khoản BookingHomestay");
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi gửi email đặt lại mật khẩu");
        }
    }

    @Override
    public void sendVerifyOtp(String to, String otp) {
        String htmlContent = "<div style='font-family:Arial,sans-serif;padding:24px;'>"
                + "<h2 style='color:#2d8cf0;'>Xác thực OTP</h2>"
                + "<p>Mã OTP của bạn là: <strong>" + otp + "</strong></p>"
                + "<p>Nếu bạn không yêu cầu xác thực, hãy bỏ qua email này.</p>"
                + "<hr><small>BookingHomestay Team</small></div>";
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Xác thực OTP tài khoản BookingHomestay");
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi gửi email xác thực OTP");
        }
    }
}