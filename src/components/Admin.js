// src/components/Admin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Admin = () => {
  const [contactDetail, setContactDetail] = useState('');
  const [contactType, setContactType] = useState('phone');
  const [timezone, setTimezone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      const contactDoc = doc(db, 'personalDetails', 'contact');
      const docSnap = await getDoc(contactDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContactDetail(data.contactDetail);
        setContactType(data.contactType);
        setTimezone(data.timezone);
      } else {
        console.log("No such document!");
      }
    };
    fetchPersonalDetails();
  }, []);

  const handleUpdate = async () => {
    const contactDoc = doc(db, 'personalDetails', 'contact');
    await setDoc(contactDoc, {
      contactDetail,
      contactType,
      timezone,
    });
  };

  const handleCurrentTimezone = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);
  };

  const handleSubjectsClick = () => {
    navigate('/admin/subjects');
  };

  return (
    <div>
      <h1>Admin</h1>
      <div>
        <label>Contact Detail:</label>
        <input
          type="text"
          value={contactDetail}
          onChange={(e) => setContactDetail(e.target.value)}
        />
        <select value={contactType} onChange={(e) => setContactType(e.target.value)}>
          <option value="phone">Phone Number</option>
          <option value="email">Email Address</option>
          <option value="link">Link</option>
        </select>
      </div>
      <div>
        <label>Timezone:</label>
        <input
          type="text"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        />
        <button onClick={handleCurrentTimezone}>Current Timezone</button>
      </div>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleSubjectsClick}>Subjects</button>
    </div>
  );
};

export default Admin;