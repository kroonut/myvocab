import React from 'react';
import '../styles/Manual.css';

const Manual = () => {
  return (
    <div className="manual-container">
      <header className="manual-header text-center">
        <h1>คู่มือการใช้งาน</h1>
        <p>เรียนรู้วิธีใช้งานระบบอย่างง่ายและรวดเร็ว</p>
      </header>

      {/* Card Rows */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            {/* ส่วนหน้า */}
            <div className="card-header text-center bg-primary text-white">
              <h5 className="card-title">เริ่มต้นใช้งาน</h5>
            </div>
            {/* รูปภาพ */}
            <img
              src="https://via.placeholder.com/1200x400"
              className="card-img-top"
              alt="Example"
            />
            {/* ข้อความอธิบาย */}
            <div className="card-body">
              <p className="card-text">
                ขั้นตอนเบื้องต้นในการเข้าสู่ระบบและการตั้งค่าพื้นฐานสำหรับผู้ใช้งานใหม่
              </p>
              <a href="#" className="btn btn-primary">
                อ่านเพิ่มเติม
              </a>
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="card">
            {/* ส่วนหน้า */}
            <div className="card-header text-center bg-success text-white">
              <h5 className="card-title">การจัดการข้อมูล</h5>
            </div>
            {/* รูปภาพ */}
            <img
              src="https://via.placeholder.com/1200x400"
              className="card-img-top"
              alt="Example"
            />
            {/* ข้อความอธิบาย */}
            <div className="card-body">
              <p className="card-text">
                คำแนะนำเกี่ยวกับการเพิ่ม, แก้ไข และลบข้อมูลในระบบ
              </p>
              <a href="#" className="btn btn-success">
                อ่านเพิ่มเติม
              </a>
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="card">
            {/* ส่วนหน้า */}
            <div className="card-header text-center bg-warning text-white">
              <h5 className="card-title">คำถามที่พบบ่อย</h5>
            </div>
            {/* รูปภาพ */}
            <img
              src="https://via.placeholder.com/1200x400"
              className="card-img-top"
              alt="Example"
            />
            {/* ข้อความอธิบาย */}
            <div className="card-body">
              <p className="card-text">
                รวมคำถามที่พบบ่อยพร้อมคำตอบเพื่อช่วยให้คุณแก้ไขปัญหาได้รวดเร็ว
              </p>
              <a href="#" className="btn btn-warning">
                อ่านเพิ่มเติม
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;
