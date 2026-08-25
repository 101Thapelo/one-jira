// Check if user is authorized
const isAuthorized = (userId, authorId, userRole = 'user') => {
  return userId === authorId || userRole === 'admin';
};

// Generate unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Paginate results
const paginate = (array, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
};

// Get pagination metadata
const getPaginationMetadata = (totalItems, pageNumber, pageSize) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    totalItems,
    pageNumber,
    pageSize,
    totalPages,
    hasNextPage: pageNumber < totalPages,
    hasPrevPage: pageNumber > 1,
  };
};

// Sanitize user data (remove sensitive fields)
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  return userObj;
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate days remaining
const daysRemaining = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = {
  isAuthorized,
  generateUniqueId,
  paginate,
  getPaginationMetadata,
  sanitizeUser,
  formatDate,
  daysRemaining,
};
