// Vite config
import { EnvSchema } from './env.schema';

const ENV_PREFIX = 'VITE_';
const ENVS = import.meta.env;

const createEnv = () => {
  //! DO NOT EDIT BELOW THIS LINE!!!
  const envVars = Object.entries(ENVS).reduce<Record<string, string>>(
    (acc, curr) => {
      const [key, value] = curr;

      if (key.startsWith(ENV_PREFIX)) {
        if (typeof value === 'string') {
          acc[key.replace(ENV_PREFIX, '')] = value;
        }
      }
      return acc;
    },
    {},
  );

  // Will show in dev mode
  if (ENVS.DEV) {
    console.log('%c Environment Variables', 'background: green', envVars);
  }

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided. The following variables are missing or invalid:
        ${Object.entries(parsedEnv.error.flatten().fieldErrors)
          .map(([k, v]) => `- ${k}: ${v}`)
          .join('\n')}
        `,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
