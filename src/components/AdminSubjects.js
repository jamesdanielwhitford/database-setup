// src/components/AdminSubjects.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { sanitizeName } from '../utils';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      const snapshot = await getDocs(collection(db, 'subjects'));
      setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchSubjects();
  }, []);

  const handleCreateSubject = async () => {
    await addDoc(collection(db, 'subjects'), { name: newSubject, projectIds: [] });
    setNewSubject('');
    // Reload subjects
    const snapshot = await getDocs(collection(db, 'subjects'));
    setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDeleteSubject = async (id) => {
    await deleteDoc(doc(db, 'subjects', id));
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleSubjectClick = (name) => {
    navigate(`/admin/subject/${sanitizeName(name)}`);
  };

  return (
    <div>
      <h1>Subjects</h1>
      <ul>
        {subjects.map(subject => (
          <li key={subject.id}>
            {subject.name}
            <button onClick={() => handleDeleteSubject(subject.id)}>Delete</button>
            <button onClick={() => handleSubjectClick(subject.name)}>Enter</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
      />
      <button onClick={handleCreateSubject}>Create Subject</button>
    </div>
  );
};

export default AdminSubjects;