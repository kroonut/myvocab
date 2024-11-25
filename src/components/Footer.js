import React from 'react';
import '../styles/Footer.css'; // Import Footer-specific styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © <a href="https://www.kroonut.com/" target="_blank" rel="noopener noreferrer">ครูณัฐดอทคอม</a>
        </p>
        <p>จัดทำโดย : ครูณัฐกรณ์ นวลสุวรรณ</p>
        <p>โรงเรียนวัดไร่ขิง(สุนทรอุทิศ)</p>
      </div>
    </footer>
  );
};

export default Footer;
