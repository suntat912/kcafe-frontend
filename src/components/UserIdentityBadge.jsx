import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearStoredUser, getAvatarUrl, getStoredUser, getUserInitials } from '../utils/userSession';

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  link: {
    textDecoration: 'none',
  },
  pill: {
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '999px',
    backgroundColor: '#f2e2d4',
    color: '#6b1218',
    fontWeight: 'bold',
    boxSizing: 'border-box',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    display: 'grid',
    placeItems: 'center',
    fontSize: '13px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  name: {
    whiteSpace: 'nowrap',
  },
  role: {
    display: 'block',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    opacity: 0.72,
    marginTop: '2px',
  },
  logoutButton: {
    minHeight: '48px',
    padding: '10px 16px',
    borderRadius: '999px',
    border: '1px solid #dcc2b3',
    backgroundColor: '#fff4ea',
    color: '#8f2e26',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
};

const UserIdentityBadge = ({ profilePath, showRole = true }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [imageBroken, setImageBroken] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener('user-updated', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('user-updated', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const avatarUrl = useMemo(() => getAvatarUrl(user?.avatar), [user?.avatar]);
  const initials = getUserInitials(user?.full_name);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    clearStoredUser();
    navigate('/login');
  };

  return (
    <div style={styles.wrap}>
      <Link to={profilePath} style={styles.link}>
        <div style={styles.pill}>
          <div style={styles.avatar}>
            {avatarUrl && !imageBroken ? (
              <img
                src={avatarUrl}
                alt={user.full_name}
                style={styles.image}
                onError={() => setImageBroken(true)}
              />
            ) : (
              initials
            )}
          </div>

          <div>
            <div style={styles.name}>{user.full_name || 'Tài khoản'}</div>
            {showRole ? <span style={styles.role}>{user.role || 'user'}</span> : null}
          </div>
        </div>
      </Link>
      <button type="button" onClick={handleLogout} style={styles.logoutButton}>
        Đăng xuất
      </button>
    </div>
  );
};

export default UserIdentityBadge;
