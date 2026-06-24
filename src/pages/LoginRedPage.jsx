import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_TIMEOUT, storeUser } from '../utils/userSession';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    background:
      'linear-gradient(90deg, #6b1218 0%, #8f2e26 52%, #efe3d4 52%, #f7efe5 100%)',
    fontFamily: 'Arial, sans-serif',
  },
  showcase: {
    padding: '56px',
    color: '#fff3e8',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandBadge: {
    width: '58px',
    height: '58px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#d5a25c',
    color: '#6b1218',
    fontWeight: 'bold',
    boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
  },
  showcaseTitle: {
    fontSize: '56px',
    lineHeight: 1.06,
    margin: '0 0 18px',
    maxWidth: '520px',
  },
  showcaseText: {
    fontSize: '17px',
    lineHeight: 1.8,
    color: 'rgba(255,243,232,0.82)',
    maxWidth: '520px',
  },
  badgeRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '24px',
  },
  badge: {
    padding: '10px 14px',
    borderRadius: '999px',
    border: '1px solid rgba(255,243,232,0.18)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff3e8',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  formPane: {
    display: 'grid',
    placeItems: 'center',
    padding: '36px',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#fffaf6',
    borderRadius: '28px',
    padding: '38px',
    boxShadow: '0 24px 54px rgba(107, 18, 24, 0.16)',
    border: '1px solid rgba(143, 46, 38, 0.10)',
  },
  eyebrow: {
    margin: 0,
    color: '#9e3a33',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  title: {
    margin: '12px 0 10px',
    fontSize: '38px',
    color: '#6b1218',
  },
  subtitle: {
    margin: '0 0 24px',
    color: '#7b5a50',
    lineHeight: 1.7,
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#6b1218',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    borderRadius: '16px',
    border: '1px solid #dcc2b3',
    backgroundColor: '#fff',
    fontSize: '15px',
  },
  button: {
    width: '100%',
    marginTop: '8px',
    padding: '15px 18px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    marginTop: '8px',
    padding: '15px 18px',
    borderRadius: '16px',
    border: '1px solid #caa996',
    backgroundColor: '#fff',
    color: '#6b1218',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  helper: {
    marginTop: '18px',
    textAlign: 'center',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '18px',
  },
  tab: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #dcc2b3',
    backgroundColor: '#fff4ea',
    color: '#8f2e26',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  activeTab: {
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    borderColor: '#8f2e26',
  },
  link: {
    color: '#9e3a33',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  otpHint: {
    margin: '10px 0 0',
    color: '#7b5a50',
    lineHeight: 1.7,
    fontSize: '14px',
  },
  textButton: {
    marginTop: '14px',
    background: 'none',
    border: 'none',
    color: '#9e3a33',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: 0,
  },
  loadingBar: {
    height: '6px',
    margin: '0 0 18px',
    borderRadius: '999px',
    overflow: 'hidden',
    backgroundColor: '#ead8cc',
  },
  loadingFill: {
    width: '45%',
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #8f2e26, #d5a25c, #8f2e26)',
    animation: 'loginLoading 1.1s ease-in-out infinite',
  },
  noticeBackdrop: {
    position: 'fixed',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(32, 18, 14, 0.48)',
    zIndex: 1000,
  },
  noticeBox: {
    width: 'min(420px, 100%)',
    borderRadius: '24px',
    padding: '28px',
    backgroundColor: '#fffaf6',
    border: '1px solid rgba(143, 46, 38, 0.16)',
    boxShadow: '0 28px 70px rgba(37, 16, 12, 0.32)',
    textAlign: 'center',
  },
  noticeTitle: {
    margin: '0 0 10px',
    color: '#6b1218',
    fontSize: '24px',
  },
  noticeMessage: {
    margin: '0 0 22px',
    color: '#6f5148',
    lineHeight: 1.65,
  },
  noticeButton: {
    minWidth: '130px',
    padding: '12px 18px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

const emptyRegisterForm = {
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
};

const emptyForgotForm = {
  email: '',
  newPassword: '',
  confirmNewPassword: '',
  verificationCode: '',
};

const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '');

const isValidVietnamPhone = (phone) => {
  const normalizedPhone = normalizePhone(phone);
  return /^(09|03)\d{8,9}$/.test(normalizedPhone);
};

const LoginRedPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [registerCodeSent, setRegisterCodeSent] = useState(false);
  const [forgotCodeSent, setForgotCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [registerData, setRegisterData] = useState({ ...emptyRegisterForm });
  const [forgotData, setForgotData] = useState({ ...emptyForgotForm });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const showNotice = (message, title = 'Thông báo') => {
    setNotice({ title, message });
  };

  const resetRegisterState = () => {
    setRegisterCodeSent(false);
    setRegisterData({ ...emptyRegisterForm });
  };

  const resetForgotState = () => {
    setForgotCodeSent(false);
    setForgotData({ ...emptyForgotForm });
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setIsSendingCode(false);
    setIsSubmitting(false);
    if (nextMode !== 'register') {
      resetRegisterState();
    }
    if (nextMode !== 'forgot') {
      resetForgotState();
    }
  };

  const handleLogin = async () => {
    const response = await axios.post(`${API_BASE_URL}/api/login`, loginData, {
      timeout: API_TIMEOUT,
    });

    const user = response.data?.user;
    const role = String(user?.role || '').toLowerCase();

    if (user) {
      storeUser(user);
    }

    if (role === 'admin') {
        navigate('/admin/dashboard');
      return;
    }

    if (role === 'customer') {
      navigate('/customer/home');
      return;
    }

    showNotice('Tài khoản không có quyền truy cập hợp lệ.', 'Không thể đăng nhập');
  };

  const handleRequestRegisterCode = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      showNotice('Mật khẩu xác nhận không khớp.', 'Kiểm tra lại thông tin');
      return;
    }

    if (!registerData.fullName.trim() || !registerData.phone.trim() || !registerData.email.trim() || !registerData.password.trim()) {
      showNotice('Bạn cần nhập họ tên, số điện thoại, email và mật khẩu trước khi gửi mã.', 'Thiếu thông tin');
      return;
    }

    if (!isValidVietnamPhone(registerData.phone)) {
      showNotice('Số điện thoại không hợp lệ. Chỉ chấp nhận đầu 09 hoặc 03 và dài 10 hoặc 11 số.', 'Số điện thoại không hợp lệ');
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register/request-code`, {
        fullName: registerData.fullName,
        phone: normalizePhone(registerData.phone),
        email: registerData.email,
        password: registerData.password,
      });
      showNotice(response.data.message, 'Đã gửi mã');
      setRegisterCodeSent(true);
    } catch (error) {
      showNotice(error.response?.data?.message || 'Không thể gửi mã xác thực email!', 'Không thể gửi mã');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleRegister = async () => {
    if (!registerCodeSent) {
      showNotice('Bạn cần gửi mã xác thực email trước.', 'Chưa có mã xác thực');
      return;
    }

    if (!registerData.verificationCode.trim()) {
      showNotice('Bạn cần nhập mã xác thực email.', 'Thiếu mã xác thực');
      return;
    }

    const response = await axios.post(`${API_BASE_URL}/api/register/verify`, {
      email: registerData.email,
      verificationCode: registerData.verificationCode,
    });

    showNotice(response.data.message, 'Đăng ký thành công');
    switchMode('login');
  };

  const handleRequestForgotCode = async () => {
    if (!forgotData.email.trim()) {
      showNotice('Bạn cần nhập email trước khi gửi mã.', 'Thiếu email');
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/password-reset/request-code`, {
        email: forgotData.email,
      });
      showNotice(response.data.message, 'Đã gửi mã');
      setForgotCodeSent(true);
    } catch (error) {
      showNotice(error.response?.data?.message || 'Không thể gửi mã quên mật khẩu!', 'Không thể gửi mã');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotCodeSent) {
      showNotice('Bạn cần gửi mã xác thực email trước.', 'Chưa có mã xác thực');
      return;
    }

    if (!forgotData.newPassword.trim()) {
      showNotice('Bạn cần nhập mật khẩu mới.', 'Thiếu mật khẩu mới');
      return;
    }

    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      showNotice('Mật khẩu mới xác nhận không khớp.', 'Kiểm tra lại mật khẩu');
      return;
    }

    if (!forgotData.verificationCode.trim()) {
      showNotice('Bạn cần nhập mã xác thực email.', 'Thiếu mã xác thực');
      return;
    }

    const response = await axios.post(`${API_BASE_URL}/api/password-reset/verify`, {
      email: forgotData.email,
      verificationCode: forgotData.verificationCode,
      newPassword: forgotData.newPassword,
    });

    showNotice(response.data.message, 'Đổi mật khẩu thành công');
    switchMode('login');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting || isSendingCode) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await handleLogin();
        return;
      }
      if (mode === 'register') {
        await handleRegister();
        return;
      }
      await handleForgotPassword();
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        showNotice('Server phản hồi quá lâu, vui lòng thử lại sau vài giây.', 'Kết nối chậm');
        return;
      }
      showNotice(error.response?.data?.message || 'Lỗi kết nối server!', 'Không thể xử lý yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes loginLoading {
            0% { transform: translateX(-110%); }
            50% { transform: translateX(70%); }
            100% { transform: translateX(230%); }
          }
        `}
      </style>
      <section style={styles.showcase}>
        <div>
          <div style={styles.brandBadge}>KC</div>
          <h1 style={styles.showcaseTitle}>Hệ thống bán hàng K-COFFEE</h1>
          <p style={styles.showcaseText}>
            Khách hàng cần đăng nhập, đăng ký hoặc khôi phục mật khẩu để tiếp tục sử dụng dịch vụ mua sản phẩm bên K-COFFEE.
          </p>

          <div style={styles.badgeRow}>
            <span style={styles.badge}>Quản lý sản phẩm</span>
            <span style={styles.badge}>Theo dõi tồn kho</span>
            <span style={styles.badge}>Đặt hàng cho customer</span>
          </div>
        </div>

        <div style={{ color: 'rgba(255,243,232,0.72)', lineHeight: 1.7 }}>
          Khu vực truy cập dành cho vận hành cửa hàng
        </div>
      </section>

      <section style={styles.formPane}>
        <div style={styles.card}>
          <p style={styles.eyebrow}>Tài khoản hệ thống</p>
          <h2 style={styles.title}>
            {mode === 'login' ? 'Đăng nhập' : mode === 'register' ? 'Đăng ký' : 'Quên mật khẩu'}
          </h2>
          <p style={styles.subtitle}>
            {mode === 'login'
              ? 'Đăng nhập để vào đúng khu vực theo vai trò tài khoản.'
              : mode === 'register'
                ? 'Đăng ký tài khoản mới bằng mã xác thực gửi về email.'
                : 'Xác thực email trước khi đặt lại mật khẩu mới.'}
          </p>

          {(isSubmitting || isSendingCode) && (
            <div style={styles.loadingBar} aria-label="Đang xử lý">
              <div style={styles.loadingFill} />
            </div>
          )}

          <div style={styles.tabs}>
            <button type="button" onClick={() => switchMode('login')} disabled={isSubmitting || isSendingCode} style={mode === 'login' ? { ...styles.tab, ...styles.activeTab } : styles.tab}>
              Đăng nhập
            </button>
            <button type="button" onClick={() => switchMode('register')} disabled={isSubmitting || isSendingCode} style={mode === 'register' ? { ...styles.tab, ...styles.activeTab } : styles.tab}>
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'login' && (
              <>
                <div style={styles.field}>
                  <label style={styles.label}>Email</label>
                  <input type="email" placeholder="admin@kcafe.com" value={loginData.email} onChange={(e) => setLoginData((current) => ({ ...current, email: e.target.value }))} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Mật khẩu</label>
                  <input type="password" placeholder="********" value={loginData.password} onChange={(e) => setLoginData((current) => ({ ...current, password: e.target.value }))} style={styles.input} />
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <div style={styles.field}>
                  <label style={styles.label}>Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" value={registerData.fullName} onChange={(e) => setRegisterData((current) => ({ ...current, fullName: e.target.value }))} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Số điện thoại</label>
                  <input type="text" placeholder="0901234567" value={registerData.phone} onChange={(e) => setRegisterData((current) => ({ ...current, phone: normalizePhone(e.target.value) }))} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email</label>
                  <input type="email" placeholder="admin@kcafe.com" value={registerData.email} onChange={(e) => setRegisterData((current) => ({ ...current, email: e.target.value }))} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Mật khẩu</label>
                  <input type="password" placeholder="********" value={registerData.password} onChange={(e) => setRegisterData((current) => ({ ...current, password: e.target.value }))} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Xác nhận mật khẩu</label>
                  <input type="password" placeholder="********" value={registerData.confirmPassword} onChange={(e) => setRegisterData((current) => ({ ...current, confirmPassword: e.target.value }))} style={styles.input} />
                </div>
                <button type="button" style={styles.secondaryButton} onClick={handleRequestRegisterCode} disabled={isSendingCode || isSubmitting}>
                  {isSendingCode ? 'Đang gửi mã...' : registerCodeSent ? 'Gửi lại mã xác thực' : 'Gửi mã xác thực email'}
                </button>
                {registerCodeSent && (
                  <>
                    <p style={styles.otpHint}>Mã xác thực gồm 6 số đã được gửi về email của bạn và có hiệu lực trong 5 phút.</p>
                    <div style={styles.field}>
                      <label style={styles.label}>Mã xác thực email</label>
                      <input type="text" placeholder="Nhập 6 số được gửi về email" value={registerData.verificationCode} onChange={(e) => setRegisterData((current) => ({ ...current, verificationCode: e.target.value }))} style={styles.input} />
                    </div>
                  </>
                )}
              </>
            )}

            {mode === 'forgot' && (
              <>
                <div style={styles.field}>
                  <label style={styles.label}>Email</label>
                  <input type="email" placeholder="admin@kcafe.com" value={forgotData.email} onChange={(e) => setForgotData((current) => ({ ...current, email: e.target.value }))} style={styles.input} />
                </div>
                <button type="button" style={styles.secondaryButton} onClick={handleRequestForgotCode} disabled={isSendingCode || isSubmitting}>
                  {isSendingCode ? 'Đang gửi mã...' : forgotCodeSent ? 'Gửi lại mã xác thực' : 'Gửi mã quên mật khẩu'}
                </button>
                {forgotCodeSent && (
                  <>
                    <p style={styles.otpHint}>Mã xác thực đổi mật khẩu đã được gửi về email của bạn và có hiệu lực trong 5 phút.</p>
                    <div style={styles.field}>
                      <label style={styles.label}>Mã xác thực email</label>
                      <input type="text" placeholder="Nhập 6 số được gửi về email" value={forgotData.verificationCode} onChange={(e) => setForgotData((current) => ({ ...current, verificationCode: e.target.value }))} style={styles.input} />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Mật khẩu mới</label>
                      <input type="password" placeholder="********" value={forgotData.newPassword} onChange={(e) => setForgotData((current) => ({ ...current, newPassword: e.target.value }))} style={styles.input} />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Xác nhận mật khẩu mới</label>
                      <input type="password" placeholder="********" value={forgotData.confirmNewPassword} onChange={(e) => setForgotData((current) => ({ ...current, confirmNewPassword: e.target.value }))} style={styles.input} />
                    </div>
                  </>
                )}
              </>
            )}

            <button type="submit" style={styles.button} disabled={isSubmitting || isSendingCode}>
              {isSubmitting
                ? 'Đang xử lý...'
                : mode === 'login'
                  ? 'Đăng nhập'
                  : mode === 'register'
                    ? 'Xác thực và tạo tài khoản'
                    : 'Xác thực và đổi mật khẩu'}
            </button>
          </form>

          {mode === 'login' && (
            <button type="button" style={styles.textButton} onClick={() => switchMode('forgot')}>
              Quên mật khẩu?
            </button>
          )}

          <div style={styles.helper}>
            {mode !== 'login' && (
              <button type="button" style={styles.textButton} onClick={() => switchMode('login')}>
                Quay về đăng nhập
              </button>
            )}
            <div>
              <Link to="/" style={styles.link}>
                Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {notice && (
        <div style={styles.noticeBackdrop} role="dialog" aria-modal="true">
          <div style={styles.noticeBox}>
            <h3 style={styles.noticeTitle}>{notice.title}</h3>
            <p style={styles.noticeMessage}>{notice.message}</p>
            <button type="button" style={styles.noticeButton} onClick={() => setNotice(null)}>
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRedPage;
