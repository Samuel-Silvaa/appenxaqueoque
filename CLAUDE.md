# appenxaqueoque — Guia para LLMs

App mobile do **Enxaque O Quê?** (React Native + Expo), para pacientes pediátricos e médicos.
Manipula dados de saúde de menores: **LGPD aplica**.

## Stack

- React Native 0.76 · Expo SDK 52 · TypeScript 5
- Estado: Redux Toolkit + react-redux (`auth`, `app` slices)
- Navegação: React Navigation 6 (native-stack + bottom-tabs)
- Forms: react-hook-form + Yup (NUNCA `useState` para campos)
- UI: NativeWind 2 (Tailwind), react-native-paper, expo-linear-gradient
- Storage seguro: expo-secure-store (token, refresh) — NUNCA AsyncStorage para dados sensíveis
- HTTP: axios via `src/infra/api.ts` com interceptors

## Layout

```
src/
├── infra/
│   ├── api.ts                 # axios single-instance + interceptors
│   ├── app/{store,app,actions,selectors,reducers}/
│   ├── auth/auth.actions.ts
│   ├── services/              # appService.tsx, authService.tsx (CHAMADAS HTTP — nunca axios solto em componentes)
│   ├── theme/                 # ThemeContext, useTw
│   └── utils/
├── modules/
│   ├── auth/                  # login, registration (patient/physician), forgotPassword, emailConfirmation, welcome
│   ├── app/                   # paciente: home, calendar, episode, report, profile
│   ├── physicianApp/          # médico: home, patient
│   └── shared/                # components reutilizáveis
└── theme/                     # AppThemeProvider, tokens
```

## Comandos

```bash
npm install
npx expo start                              # dev server
npx expo run:android                        # build dev local Android
EXPO_PUBLIC_API_URL=https://api.exemplo.com eas build --profile production --platform android
```

## Configuração

- `EXPO_PUBLIC_API_URL` é a fonte de verdade do baseURL. Lida em `api.ts` (com fallback para `Constants.expoConfig.extra.apiUrl`).
- `EXPO_PUBLIC_ALLOW_CLEARTEXT=true` ativa HTTP no Android em dev. Em produção: NUNCA.

## Padrões obrigatórios

### Forms
- **Sempre** `react-hook-form` + `@hookform/resolvers/yup` + schema Yup.
- Nunca `useState` para gerenciar valor de input.

### HTTP
- Toda chamada de API mora em `src/infra/services/*.tsx` ou `src/infra/auth/*`.
- Componentes/Telas não importam `axios` diretamente — usam funções exportadas dos services.
- O interceptor de resposta desloga em **401 apenas** (não em 400). Mantenha assim.

### Estado
- Global: Redux Toolkit slices (`auth.reducer.ts`, `app.reducer.ts`).
- Local: `useState` SÓ para UI ephemeral (modal aberto, focus, etc).
- Selectors: prefira selecionar só o que precisa (`useSelector(s => s.app.error)`), não o slice inteiro.

### Token / Segurança
- Token e refresh: `expo-secure-store` (`getItemAsync` / `setItemAsync`).
- Em logout: limpar SecureStore e dispatch `signOut()`.
- Nunca `console.log(token)`, `console.log(user)`.

### Estilo
- Use tokens definidos em `tailwind.config.js`. Não usar hex hardcoded em componentes.
- Paleta principal: `blue-primary #8FD7FF`, `d-primary #23263F`, `d-blue-primary #373D59`, `d-blue-title #6E8DBB`, `purple-dark-primary #9194E9`, `snow-white #f5f8fd`.

### Navegação
- Imperativa: usar `navigate` de `navigationService.tsx` (já configurado com `navigationRef`).
- Declarativa dentro de telas: `useNavigation()`.

## O que NÃO fazer

- `debugger;` em código commitado.
- `console.log` de dados de paciente/episódio.
- Cleartext HTTP em build de produção.
- AsyncStorage para token/refresh.
- Axios direto em componente — sempre via service.
- `useState` para campo de formulário.
- Hex de cor hardcoded — use Tailwind tokens.

## Telas críticas (auditar a cada PR)

- `auth/login`, `auth/registration` — entrada de credenciais
- `auth/emailConfirmation` — fluxo de verificação
- `app/profile/security` — change password
- `app/episode/*` — captura de PHI do paciente
- `app/report` — geração e compartilhamento de PDF (cuidado com `expo-sharing` em prod)

## Build EAS

`eas.json` deve ter perfis `development`, `preview`, `production`. Cada um com `EXPO_PUBLIC_API_URL` próprio. Production exige HTTPS.
