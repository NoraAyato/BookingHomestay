import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>Về Rose Homestay</div>
          <a href="#" className={styles.footerLink}>
            Giới thiệu
          </a>
          <a href="#" className={styles.footerLink}>
            Blog
          </a>
          <a href="#" className={styles.footerLink}>
            Tuyển dụng
          </a>
          <a href="#" className={styles.footerLink}>
            Liên hệ
          </a>
        </div>
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>Hỗ trợ khách hàng</div>
          <a href="#" className={styles.footerLink}>
            Trung tâm trợ giúp
          </a>
          <a href="#" className={styles.footerLink}>
            Chính sách bảo mật
          </a>
          <a href="#" className={styles.footerLink}>
            Điều khoản sử dụng
          </a>
          <a href="#" className={styles.footerLink}>
            Câu hỏi thường gặp
          </a>
        </div>
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>Khám phá</div>
          <a href="#" className={styles.footerLink}>
            Địa điểm nổi bật
          </a>
          <a href="#" className={styles.footerLink}>
            Ưu đãi đặc biệt
          </a>
          <a href="#" className={styles.footerLink}>
            Trải nghiệm địa phương
          </a>
        </div>
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>Kết nối với chúng tôi</div>
          <div className={styles.socialIcons}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        &copy; {new Date().getFullYear()} Rose Homestay. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
};

export default Footer;
