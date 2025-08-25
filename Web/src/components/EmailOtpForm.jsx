import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/useAuth";

const EmailOtpForm = ({ email, onVerified, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  const { sendOtpEmail, verifyOtpEmail } = useAuth();

  // Gửi lại OTP và reset form
  const handleResend = async () => {
    setLoading(true);
    const success = await sendOtpEmail(email);
    if (success) {
      setOtp(["", "", "", "", "", ""]); // Reset OTP
      setError(""); // Xóa thông báo lỗi
      setCountdown(60); // Đặt lại đếm ngược
    }
    setLoading(false);
  };

  // Đếm ngược thời gian gửi lại OTP
  useEffect(() => {
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
      setError(""); // Xóa lỗi khi nhập
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[idx] = val;
        return newOtp;
      });
    }
  };

  // Xử lý xóa ký tự bằng phím Backspace
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        // Xóa ký tự ở ô hiện tại
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[idx] = "";
          return newOtp;
        });
      } else if (idx > 0) {
        // Nếu ô hiện tại trống, chuyển về ô trước và xóa
        inputRefs.current[idx - 1].focus();
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[idx - 1] = "";
          return newOtp;
        });
      }
    }
  };

  // Xử lý dán OTP vào bất kỳ ô nào
  const handlePaste = (e, idx) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    if (paste.length > 0) {
      setError(""); // Xóa lỗi khi dán
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        let pasteIndex = 0;
        // Điền dữ liệu dán vào các ô còn trống, bắt đầu từ ô hiện tại
        for (let i = idx; i < 6 && pasteIndex < paste.length; i++) {
          if (!newOtp[i]) {
            // Chỉ điền vào ô trống
            newOtp[i] = paste[pasteIndex];
            pasteIndex++;
          }
        }
        // Tìm ô trống tiếp theo hoặc ô cuối cùng để focus
        const nextEmptyIndex = newOtp.findIndex((val, i) => !val && i >= idx);
        const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
        inputRefs.current[focusIndex].focus();
        return newOtp;
      });
      e.preventDefault();
    }
  };

  // Xác thực OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6 || code.includes("")) {
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
      <div className="flex gap-2 justify-center">
        {otp.map((v, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            maxLength={1}
            value={v}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={(e) => handlePaste(e, i)} // Thêm sự kiện onPaste cho từng ô
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
