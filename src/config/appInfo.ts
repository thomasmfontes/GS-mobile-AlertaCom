import Constants from 'expo-constants';

export const APP_INFO = {
  name: 'AlertaCom',
  version: Constants.expoConfig?.version || '1.0.0',
  commitHash: '7f9a82b', // Hash de referência para entrega no Firebase App Distribution
  discipline: 'Mobile Application Development',
  institution: 'FIAP - Graduação 2026',
  theme: 'Global Solution - CitizenTech (Cidades Resilientes e Prevenção Climática)',
  ods: ['ODS 11 - Cidades e Comunidades Sustentáveis', 'ODS 13 - Ação Contra a Mudança Global do Clima'],
  team: [
    { name: 'Thomas Fontes', rm: 'RM 562254', role: 'Mobile & .NET' },
    { name: 'Gabriel Maciel', rm: 'RM 562795', role: 'Java Advanced' },
    { name: 'Matheus Molina', rm: 'RM 563399', role: 'Disruptive IA' },
    { name: 'Vitória Rodrigues', rm: 'RM 565160', role: 'Banco de Dados' },
  ],
};

export default APP_INFO;
