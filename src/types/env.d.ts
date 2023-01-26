import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import '@types/jest';

declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
}
