// Define a type for credentials
export interface Credentials {
  username: string;
  password: string;
}

// Credentials for different user roles or environments
export const CREDENTIALS: { [key: string]: Credentials } = {
  demoUser: {
    username:  process.env.DEMO_USERNAME || 'demo.',
    password:  process.env.DEMO_PASSWORD || 'Test!',
  },
   
  wrongUser: {
    username: process.env.WRONG_USERNAME || 't0000000estUser',
    password: process.env.WRONG_PASSWORD || 'userPass123',
  },
   
};

export function getCredentials(role: string): Credentials {
  const creds = CREDENTIALS[role];
  if (!creds) {
    throw new Error(`No credentials found for role: ${role}`);
  }
  return creds;
}