// src/components/AdminSubjects.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsRef = collection(db, 'subjects');
        const snapshot = await getDocs(subjectsRef);
        setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching subjects: ", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleStatusChange = async (subjectId, newStatus) => {
    const subjectRef = doc(db, 'subjects', subjectId);
    await updateDoc(subjectRef, { status: newStatus });
    setSubjects(subjects.map(subject => (subject.id === subjectId ? { ...subject, status: newStatus } : subject)));
  };

  const handleSubjectClick = (subjectName) => {
    navigate(`/admin/${subjectName}`);
  };

  return (
    <div>
      <h1>Subjects</h1>
      <ul>
        {subjects.map(subject => (
          <li key={subject.id}>
            {subject.name} ({subject.status})
            <button onClick={() => handleSubjectClick(subject.name)}>Enter</button>
            <select value={subject.status} onChange={(e) => handleStatusChange(subject.id, e.target.value)}>
              <option value="draft">Draft</option>
              <option value="public">Public</option>
              <option value="archived">Archived</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSubjects;