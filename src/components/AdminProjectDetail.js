// src/components/AdminProjectDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import FileInput from './FileInput';

const AdminProjectDetail = () => {
  const { projectName } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    postContent: '',
    postContentPreview: '',
    link: { text: '', url: '' },
    location: { name: '', coordinates: { lat: 0, lng: 0 } },
    type: 'image' // default type
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('projectId', '==', projectName));
        const snapshot = await getDocs(q);
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Assuming each post has a 'createdAt' field
        postsData.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };
    fetchPosts();
  }, [projectName]);

  const handleCreatePost = async () => {
    try {
      const newPostWithTimestamp = { ...newPost, projectId: projectName, createdAt: new Date() };
      const docRef = await addDoc(collection(db, 'posts'), newPostWithTimestamp);
      setNewPost({
        title: '',
        description: '',
        postContent: '',
        postContentPreview: '',
        link: { text: '', url: '' },
        location: { name: '', coordinates: { lat: 0, lng: 0 } },
        type: 'image'
      });
      setPosts([{ id: docRef.id, ...newPostWithTimestamp }, ...posts]);
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    setNewPost(prevState => ({ ...prevState, [name]: file }));
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevState => ({ ...prevState, link: { ...prevState.link, [name]: value } }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevState => ({ ...prevState, location: { ...prevState.location, [name]: value } }));
  };

  const handleTypeChange = (e) => {
    setNewPost({ ...newPost, type: e.target.value });
  };

  const renderContentInputs = () => {
    switch (newPost.type) {
      case 'image':
        return (
          <>
            <FileInput
              label="Post Content"
              name="postContent"
              value={newPost.postContent}
              onChange={handleFileChange}
            />
            <FileInput
              label="Post Content Preview"
              name="postContentPreview"
              value={newPost.postContentPreview}
              onChange={handleFileChange}
            />
          </>
        );
      case 'youtube':
        return (
          <>
            <input
              type="text"
              placeholder="Post Content (YouTube URL)"
              name="postContent"
              value={newPost.postContent}
              onChange={handleChange}
            />
            <FileInput
              label="Post Content Preview"
              name="postContentPreview"
              value={newPost.postContentPreview}
              onChange={handleFileChange}
            />
          </>
        );
      case 'markdown':
        return (
          <>
            <FileInput
              label="Post Content"
              name="postContent"
              value={newPost.postContent}
              onChange={handleFileChange}
            />
            <FileInput
              label="Post Content Preview"
              name="postContentPreview"
              value={newPost.postContentPreview}
              onChange={handleFileChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>{projectName}</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            {/* Additional button or link for editing post */}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={newPost.title}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={newPost.description}
          onChange={handleChange}
        />
        <select name="type" value={newPost.type} onChange={handleTypeChange}>
          <option value="image">Image</option>
          <option value="youtube">YouTube</option>
          <option value="markdown">Markdown</option>
        </select>
        {renderContentInputs()}
        <input
          type="text"
          placeholder="Link Text"
          name="text"
          value={newPost.link.text}
          onChange={handleLinkChange}
        />
        <input
          type="text"
          placeholder="Link URL"
          name="url"
          value={newPost.link.url}
          onChange={handleLinkChange}
        />
        <input
          type="text"
          placeholder="Location Name"
          name="name"
          value={newPost.location.name}
          onChange={handleLocationChange}
        />
        <input
          type="text"
          placeholder="Latitude"
          name="lat"
          value={newPost.location.coordinates.lat}
          onChange={handleLocationChange}
        />
        <input
          type="text"
          placeholder="Longitude"
          name="lng"
          value={newPost.location.coordinates.lng}
          onChange={handleLocationChange}
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>
    </div>
  );
};

export default AdminProjectDetail;