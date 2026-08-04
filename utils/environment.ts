function getRequiredEnvironmentVariable(
  variableName: string,
): string {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(
      `Required environment variable is missing: ${variableName}`,
    );
  }

  return value;
}

export const environment = {
  username: getRequiredEnvironmentVariable(
    'DEMOQA_USERNAME',
  ),

  password: getRequiredEnvironmentVariable(
    'DEMOQA_PASSWORD',
  ),
};