export const getFriendlyErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'Your account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/operation-not-allowed':
      return 'Sign in with email and password is not enabled.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please try again.';
    case 'auth/missing-identifier':
      return 'An account already exists with this email, linked to another provider.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email, but different sign-in credentials. Please use the correct provider to sign in.';
    case 'auth/credential-already-in-use':
      return 'This credential is already associated with a different user account.';
    case 'auth/invalid-verification-code':
      return 'The verification code is invalid or expired.';
    case 'auth/invalid-verification-id':
      return 'The verification ID is invalid.';
    case 'auth/missing-verification-code':
      return 'The verification code is missing.';
    case 'auth/missing-verification-id':
      return 'The verification ID is missing.';
    case 'auth/multi-factor-auth-required':
      return 'Multi-factor authentication is required to sign in.';
    case 'auth/network-request-failed':
      return 'Network error occurred. Please try again.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please log in again and try.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    case 'auth/unverified-email':
      return 'Please verify your email address before logging in.';
    case 'auth/expired-action-code':
      return 'The action code has expired.';
    case 'auth/invalid-action-code':
      return 'The action code is invalid.';
    case 'auth/weak-password':
      return 'The password is too weak. Password should be at least 6 characters.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};
