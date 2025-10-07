export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbidUsernameInPassword: boolean;
  forbidCommonPasswords: boolean;
}

// Common weak passwords to reject
const COMMON_PASSWORDS = [
  'password', 'password123', '123456789', 'qwerty123',
  'admin', 'administrator', 'welcome', 'letmein',
  'monkey', 'dragon', 'sunshine', 'iloveyou',
  'princess', 'football', 'baseball', 'welcome123',
  'abc123', '123abc', 'password1', 'pass1234',
  'user', 'guest', 'temp', 'test', 'demo'
];

const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  forbidUsernameInPassword: true,
  forbidCommonPasswords: true
};

export function validatePassword(
  password: string,
  username?: string,
  email?: string,
  requirements: PasswordRequirements = DEFAULT_REQUIREMENTS
): PasswordValidationResult {
  const errors: string[] = [];

  // Check minimum length
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  }

  // Check for uppercase letter
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }

  // Check for lowercase letter
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }

  // Check for numbers
  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one numeric digit (0-9)');
  }

  // Check for special characters
  if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }

  // Check if password contains username
  if (requirements.forbidUsernameInPassword && username) {
    const passwordLower = password.toLowerCase();
    const usernameLower = username.toLowerCase();
    if (passwordLower.includes(usernameLower) && usernameLower.length >= 3) {
      errors.push('Password must not contain your username');
    }
  }

  // Check if password contains email local part
  if (requirements.forbidUsernameInPassword && email) {
    const emailLocal = email.split('@')[0].toLowerCase();
    const passwordLower = password.toLowerCase();
    if (passwordLower.includes(emailLocal) && emailLocal.length >= 3) {
      errors.push('Password must not contain your email address');
    }
  }

  // Check against common passwords
  if (requirements.forbidCommonPasswords) {
    const passwordLower = password.toLowerCase();
    if (COMMON_PASSWORDS.some(common => passwordLower.includes(common))) {
      errors.push('Password contains common words and is not secure');
    }
  }

  // Check for repeated characters (more than 3 in a row)
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Password must not contain more than 3 repeated characters in a row');
  }

  // Check for sequential characters
  if (hasSequentialChars(password)) {
    errors.push('Password must not contain sequential characters (e.g., 123, abc, qwe)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function hasSequentialChars(password: string): boolean {
  const sequences = [
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];

  const passwordLower = password.toLowerCase();
  
  for (const sequence of sequences) {
    for (let i = 0; i <= sequence.length - 4; i++) {
      const substr = sequence.substring(i, i + 4);
      const reverseSubstr = substr.split('').reverse().join('');
      
      if (passwordLower.includes(substr) || passwordLower.includes(reverseSubstr)) {
        return true;
      }
    }
  }
  
  return false;
}

export function getPasswordRequirementsText(): string[] {
  return [
    'At least 12 characters long',
    'At least one uppercase letter (A-Z)',
    'At least one lowercase letter (a-z)',
    'At least one numeric digit (0-9)',
    'At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)',
    'Must not contain your username or email',
    'Must not contain common dictionary words',
    'Must not contain more than 3 repeated characters',
    'Must not contain sequential characters (e.g., 123, abc)'
  ];
}

export function getPasswordStrengthScore(password: string): {
  score: number;
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) score += 1;

  // Bonus points for complexity
  if (password.length >= 20) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) score += 1;

  let strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  
  if (score <= 2) {
    strength = 'Very Weak';
    feedback.push('Consider using a longer password with more character types');
  } else if (score <= 4) {
    strength = 'Weak';
    feedback.push('Add more character types and length for better security');
  } else if (score <= 5) {
    strength = 'Fair';
    feedback.push('Good start! Consider adding more special characters');
  } else if (score <= 6) {
    strength = 'Good';
    feedback.push('Strong password! Consider making it even longer');
  } else if (score <= 7) {
    strength = 'Strong';
    feedback.push('Very strong password!');
  } else {
    strength = 'Very Strong';
    feedback.push('Excellent password security!');
  }

  return { score, strength, feedback };
}