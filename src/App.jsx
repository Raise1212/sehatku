import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import pict from './assets/PICT.png';
import backgroundImage from './assets/backround1.jpg';

function App() {
  const [rfid, setRfid] = useState('');
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchUserData = async (rfidValue) => {
    try {
      const response = await fetch("http://localhost/sehatku2/get_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `rfid=${encodeURIComponent(rfidValue)}`
      });

      const data = await response.json();

      if (data.status === "success") {
        setUser({
          nama: data.nama,
          position: data.position,
          nip: data.nip
        });
        setStatus("RFID dikenali ✅");
      } else {
        setUser(null);
        setStatus("RFID tidak ditemukan ❌");
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      setStatus("Gagal menghubungi server");
    }
  };

  const handleRfidChange = (e) => {
    const value = e.target.value;
    setRfid(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && rfid.trim() !== '') {
      fetchUserData(rfid);
      setRfid('');
    }
  };

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="page-title">CEK KESEHATAN</div>
      <div className="content-box">
        <div className="text-section">
          <div className="main-title">Selamat Datang</div>
          <div className="subtitle">Tempelkan kartu RFID Anda</div>

          <input
            ref={inputRef}
            type="text"
            className="rfid-box"
            placeholder="Masukkan atau scan kartu RFID"
            value={rfid}
            onChange={handleRfidChange}
            onKeyDown={handleKeyDown}
          />

          {status && (
            <div style={{ marginTop: "1rem", fontSize: "1.2rem", color: "#555" }}>
              {status}
            </div>
          )}

          {user && (
            <div style={{ marginTop: "1.5rem", fontSize: "1.3rem", color: "#0077b6" }}>
              <strong>Nama:</strong> {user.nama}<br />
              <strong>Jabatan:</strong> {user.position}<br />
              <strong>NIP:</strong> {user.nip}
            </div>
          )}
        </div>

        <div className="image-container">
          <img src={pict} alt="Gambar PICT" />
        </div>
      </div>
    </div>
  );
}

export default App;
