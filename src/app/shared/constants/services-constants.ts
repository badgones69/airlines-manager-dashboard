import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-ts';

/* Database URL */
const decodedURL = new TextDecoder().decode(
  decode('aHR0cHM6Ly9xc3l1cnRyY2VxcXd6dGhxbnlpdS5zdXBhYmFzZS5jbw=='),
);

/* Database API Key */
const decodedKey = new TextDecoder().decode(
  decode(
    'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5GemVYVnlkSEpqWlhGeGQzcDBhSEZ1ZVdsMUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTlRFd01qa3dOamtzSW1WNGNDSTZNakEyTmpZd05UQTJPWDAubVh1OWtvQWhLSGtJY19kaFF4WjJtSEF0VzRzVzJWYWRDMjBaM3ZRYjFVWQ==',
  ),
);

/* Database user password */
const decodedPassword = new TextDecoder().decode(
  decode('M05QaXRhI2N0NiFZcWZI'),
);

// Database client creation
const supabase = createClient(decodedURL, decodedKey);

/* Database user authentication */
supabase.auth.signInWithPassword({
  email: 'app.am.dashboard@gmail.com',
  password: decodedPassword,
});

export default supabase;
