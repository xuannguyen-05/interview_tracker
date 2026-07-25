export const resetPasswordTemplate = (resetLink) => `
  <h2>Interview Tracker</h2>
  <p>You requested a password reset.</p>
  <a href="${resetLink}">Reset Password</a>
  <p>This link expires in 15 minutes.</p>
`;