import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-ts';

const decodedURL = new TextDecoder().decode(
  decode('aHR0cHM6Ly9xc3l1cnRyY2VxcXd6dGhxbnlpdS5zdXBhYmFzZS5jbw==')
);

const decodedKey = new TextDecoder().decode(
  decode(
    'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5GemVYVnlkSEpqWlhGeGQzcDBhSEZ1ZVdsMUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTlRFd01qa3dOamtzSW1WNGNDSTZNakEyTmpZd05UQTJPWDAubVh1OWtvQWhLSGtJY19kaFF4WjJtSEF0VzRzVzJWYWRDMjBaM3ZRYjFVWQ=='
  )
);

export const supabase = createClient(decodedURL, decodedKey);
