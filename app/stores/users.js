const USERS = new Map();

export function getUsers() {
  return USERS;
}

export function setUser(user) {
  USERS.set(user.token, user);
}