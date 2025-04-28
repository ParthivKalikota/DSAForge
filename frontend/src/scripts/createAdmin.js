import axios from 'axios';

const createAdmin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/create-first-admin', {
      name: 'Admin User',
      email: 'admin@dsaforge.com',
      password: 'admin123'
    });
    console.log('Admin created successfully:', response.data);
  } catch (error) {
    console.error('Failed to create admin:', error.response?.data || error.message);
  }
};

createAdmin();
