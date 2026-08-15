// @ts-nocheck
// Plain module-level store (not React state) so the axios request interceptor
// can read the current token synchronously without importing React/context.
// AuthContext is the only thing that calls setToken(); everything else reads.
let currentToken = null;

export const setToken = (token) => {
  currentToken = token;
};

export const getToken = () => currentToken;
