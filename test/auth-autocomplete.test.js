const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

 test('login and signup fields declare password manager autocomplete values', () => {
  const login = fs.readFileSync(path.join(__dirname, '..', 'pages', 'login.js'), 'utf8');
  const signup = fs.readFileSync(path.join(__dirname, '..', 'pages', 'signup.js'), 'utf8');

  assert.match(login, /label="Email" type="email"[^\n]*autoComplete="email"/);
  assert.match(login, /label="Mot de passe" type="password"[^\n]*autoComplete="current-password"/);
  assert.match(signup, /label="Email" type="email"[^\n]*autoComplete="email"/);
  assert.match(signup, /label="Mot de passe[^\"]*" type="password"[^\n]*autoComplete="new-password"/);
});
