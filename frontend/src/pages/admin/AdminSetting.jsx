import React, { useState } from 'react';

const AdminSetting = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
 

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
    // Add logic to handle password change (e.g., API call)
    alert('Password changed successfully!');
  };

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    // Add logic to handle email update (e.g., API call)
    alert('Email updated successfully!');
  };



  return (
    <div className="p-6 w-4/5 mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Settings</h2>

      {/* Change Password Section */}
      <form onSubmit={handlePasswordChange} className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h3>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-gray-600 mb-2">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-600 mb-2">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-600 mb-2">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Change Password
        </button>
      </form>

      {/* Update Email Section */}
      <form onSubmit={handleEmailUpdate} className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Update Email</h3>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-2">New Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Update Email
        </button>
      </form>

    </div>
  );
};

export default AdminSetting;