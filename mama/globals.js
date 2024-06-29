// globals.js
let loggedInUserId;

export const getLoggedInUserId = () => loggedInUserId;

export const setLoggedInUserId = (userId) => {
  loggedInUserId = userId;
};
