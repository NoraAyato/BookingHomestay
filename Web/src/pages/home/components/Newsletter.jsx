import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your newsletter signup logic here
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <section className="py-10 bg-rose-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">
          Đăng ký nhận thông tin ưu đãi
        </h2>
        <p className="text-rose-100 mb-8">
          Nhận ngay ưu đãi đặc biệt và cập nhật về các homestay mới nhất
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="px-6 py-3 rounded-lg flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors font-medium"
          >
            Đăng ký ngay
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-rose-100">
            Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin ưu đãi sớm nhất.
          </p>
        )}

        <p className="mt-4 text-sm text-rose-100">
          Chúng tôi tôn trọng quyền riêng tư của bạn - không spam!
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
