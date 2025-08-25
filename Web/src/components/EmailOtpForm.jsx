import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/useAuth";

const EmailOtpForm = ({ email, onVerified, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  const { sendOtpEmail, verifyOtpEmail } = useAuth();
  // Gửi lại OTP
  const handleResend = async () => {
    setLoading(true);
    const success = await sendOtpEmail(email);
    if (success) {
      setCountdown(60);
    }
    setLoading(false);
  };

  // Đếm ngược thời gian gửi lại OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Xử lý nhập từng ô
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length === 1) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);
      if (idx < 5) inputRefs.current[idx + 1].focus();
    } else if (val.length > 1) {
      // Dán nhiều ký tự
      const chars = val.split("").slice(0, 6);
      const newOtp = [...otp];
      chars.forEach((c, i) => {
        if (idx + i < 6) newOtp[idx + i] = c;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(idx + chars.length - 1, 5);
      inputRefs.current[nextIdx].focus();
    }
  };

  // Xử lý xóa ký tự bằng phím Backspace
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        // Xóa ký tự ở ô hiện tại
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        // Nếu ô hiện tại trống, chuyển về ô trước và xóa
        inputRefs.current[idx - 1].focus();
        const newOtp = [...otp];
        newOtp[idx - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // Xử lý dán trực tiếp vào ô đầu tiên
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (paste.length === 6) {
      setOtp(paste.split(""));
      inputRefs.current[5].focus();
      e.preventDefault();
    }
  };

  // Xác thực OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Vui lòng nhập đủ 6 số OTP");
      return;
    }
    setLoading(true);
    const success = await verifyOtpEmail(email, code);
    if (success) {
      onVerified();
    } else {
      setError("Mã OTP không đúng hoặc xác thực thất bại");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-sm text-gray-700 mb-2">
        Nhập mã OTP đã gửi tới email{" "}
        <span className="font-semibold">{email}</span>
      </div>
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {otp.map((v, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            maxLength={1}
            value={v}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-10 h-10 text-center border border-gray-300 rounded-lg text-lg focus:border-rose-500 focus:ring-rose-500"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && (
        <div className="text-xs text-rose-500 text-center">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-rose-500 text-white rounded-lg font-medium mt-2"
      >
        Xác thực OTP
      </button>
      {countdown > 0 && (
        <div className="text-xs text-gray-500 text-center mt-2">
          Bạn có thể gửi lại mã sau {countdown}s
        </div>
      )}
      <div className="flex justify-between mt-2 text-xs">
        <div className="flex flex-col items-start">
          <button
            type="button"
            onClick={handleResend}
            disabled={loading || countdown > 0}
            className="text-rose-600 hover:underline"
          >
            Gửi lại mã
          </button>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:underline"
        >
          Quay lại
        </button>
      </div>
    </form>
  );
};

export default EmailOtpForm;
