import { hcWithType } from 'api/hc';

export const hcWithAuth = (accessToken: string) => {
  return hcWithType('http://localhost:3001/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
