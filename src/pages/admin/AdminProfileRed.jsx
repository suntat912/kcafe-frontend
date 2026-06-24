import React from 'react';
import AdminLayoutRed from '../../components/AdminLayoutRed';
import ProfileContent from '../../components/ProfileContent';

const AdminProfileRed = () => {
  return (
    <AdminLayoutRed activeItem="profile">
      <ProfileContent />
    </AdminLayoutRed>
  );
};

export default AdminProfileRed;
