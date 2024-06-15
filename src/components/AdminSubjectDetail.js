// src/components/AdminSubjectDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { sanitizeName } from '../utils';

const AdminSubjectDetail = () => {
  const { subjectName } = useParams();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('subjectIds', 'array-contains', subjectName));
        const snapshot = await getDocs(q);
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };
    fetchProjects();
  }, [subjectName]);

  const handleCreateProject = async () => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        name: newProject,
        subjectIds: [subjectName],
        postIds: []
      });
      setNewProject('');
      setProjects([...projects, { id: docRef.id, name: newProject, subjectIds: [subjectName], postIds: [] }]);
    } catch (error) {
      console.error("Error creating project: ", error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  const handleProjectClick = (name) => {
    navigate(`/admin/${sanitizeName(name)}`);
  };

  return (
    <div>
      <h1>{subjectName}</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            {project.name}
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
            <button onClick={() => handleProjectClick(project.name)}>Enter</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
      />
      <button onClick={handleCreateProject}>Create Project</button>
    </div>
  );
};

export default AdminSubjectDetail;