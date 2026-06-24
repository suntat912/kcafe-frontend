export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
export const API_TIMEOUT = 15000;
const USER_KEY = 'user';

export const getStoredUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null');
  } catch (error) {
    return null;
  }
};

export const storeUser = (user) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('user-updated'));
};

export const clearStoredUser = () => {
  sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('user-updated'));
};

export const getAvatarUrl = (avatar) => {
  if (!avatar || avatar === 'default-avatar.png') {
    return '';
  }

  if (/^https?:\/\//.test(avatar)) {
    return avatar;
  }

  return `${API_BASE_URL}/uploads/avatars/${avatar}`;
};

export const getUserInitials = (fullName) => {
  if (!fullName) {
    return 'U';
  }

  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
};

const CART_KEY = 'customer-cart';

export const getCartItems = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (error) {
    return [];
  }
};

export const storeCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
};

export const addCartItem = (product) => {
  const currentItems = getCartItems();
  const existingItem = currentItems.find((item) => item.productId === product.productId);

  if (existingItem) {
    storeCartItems(
      currentItems.map((item) =>
        item.productId === product.productId
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      )
    );
    return;
  }

  storeCartItems([...currentItems, { ...product, quantity: product.quantity || 1 }]);
};

export const updateCartItemQuantity = (productId, quantity) => {
  const nextQuantity = Number(quantity);
  if (nextQuantity <= 0) {
    removeCartItem(productId);
    return;
  }

  storeCartItems(
    getCartItems().map((item) =>
      item.productId === productId ? { ...item, quantity: nextQuantity } : item
    )
  );
};

export const removeCartItem = (productId) => {
  storeCartItems(getCartItems().filter((item) => item.productId !== productId));
};

export const clearCartItems = () => {
  storeCartItems([]);
};

export const getCartCount = () =>
  getCartItems().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
