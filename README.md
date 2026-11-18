# 📱 AlertaCom Mobile - Aplicativo CitizenTech de Resiliência Urbana
> **Mobile Application Development - Global Solution FIAP 2026/2**  
> *Tecnologia com o Cidadão no Centro da Inovação*

---

## 👥 Integrantes do Grupo

| Nome | RM | Papel no Projeto |
|---|---|---|
| **Thomas Fontes** | **562254** | **Mobile Application Development & Backend .NET** |
| **Gabriel Maciel** | **562795** | **Java Advanced (Spring Boot & Pitch)** |
| **Matheus Molina** | **563399** | **Disruptive Architectures (Visão Computacional & GenAI)** |
| **Vitória Rodrigues** | **565160** | **Database (Oracle PL/SQL & MongoDB)** |

---

## 📌 1. Visão Geral do Aplicativo

O **AlertaCom Mobile** é um aplicativo desenvolvido em **React Native com TypeScript e Expo**, utilizando **React Navigation** (Stack Navigation e Bottom Tab Navigation), que coloca o cidadão no centro do enfrentamento a desastres climáticos (enchentes, alagamentos, bueiros obstruídos, quedas de árvores).

O aplicativo conecta-se diretamente à API RESTful desenvolvida em **.NET 10** (`AlertaComApi`), permitindo que cidadãos autenticados via JWT registrem ocorrências com evidências fotográficas, acompanhem o status de zeladoria e recebam avisos emergenciais da Defesa Civil.

---

## 📱 2. Mapeamento das 6 Telas Obrigatórias + Tela Sobre o App

Conforme exigido pelo edital da disciplina (Slides 79-87), o app possui mais de 6 telas com navegação fluida e sem bugs:

1. **`LoginScreen` (Autenticação)**:
   - Login real com validação e autenticação JWT contra a API .NET.
   - Acesso rápido preenchido para contas de teste da banca.
2. **`RegisterScreen` (Cadastro Cidadão)**:
   - Formulário completo com Nome, Usuário, E-mail, CPF, Bairro e Senha.
3. **`HomeScreen` / Feed de Alertas (Início)**:
   - Painel dinâmico consumindo alertas meteorológicos da Defesa Civil (`/api/alertas`).
   - Métricas de chamados abertos e resolvidos no município.
   - Lista das ocorrências mais recentes com badges coloridos de severidade e status.
4. **`NewIncidentScreen` (Reportar Novo Risco - CRUD Create)**:
   - Captura de foto via Câmera ou Galeria (`expo-image-picker`).
   - Seleção interativa do Tipo de Risco e Severidade estimada.
   - Preenchimento de endereço e descrição do problema.
   - Envio seguro com **cabeçalho de Idempotência (`Idempotency-Key`)** para evitar chamadas duplicadas se o sinal 4G/3G oscilar.
5. **`IncidentsListScreen` (Ocorrências da Cidade - CRUD Read com Filtros)**:
   - Listagem com busca textual por rua/bairro e filtros rápidos por status (Abertas, Em Atendimento, Resolvidas).
   - Recarregamento com `RefreshControl` (pull-to-refresh).
6. **`IncidentDetailScreen` (Detalhes & Timeline)**:
   - Exibição da foto da ocorrência, geolocalização e histórico de atendimento.
   - Parecer técnico emitido pela Defesa Civil.
   - **Recomendações de Segurança geradas por IA** (harmonizando com a entrega de Disruptive Architectures).
   - Ações de atualização de status e cancelamento do chamado.
7. **`MyIncidentsScreen` (Meus Chamados - CRUD Update/Delete)**:
   - Painel de controle exclusivo do cidadão logado com histórico pessoal e opção de exclusão.
8. **`AboutScreen` ("Sobre o App" - Requisito 7)**:
   - Tela com os nomes, RMs e papéis dos 5 integrantes.
   - Exibição em destaque do **Hash do Commit de Referência (`7f9a82b`)** para auditoria no Firebase App Distribution.

---

## ⚙️ 3. Integração com Backend (.NET)

O app utiliza a biblioteca **Axios** com interceptors automáticos em `src/services/api.ts`:
- **Injeção de Token**: Injeta automaticamente o Bearer Token obtido no login armazenado no `@react-native-async-storage/async-storage`.
- **Idempotência**: Gera automaticamente chaves únicas no cabeçalho `Idempotency-Key` em requisições POST para evitar duplicidade.
- **Tratamento de Erros & Loaders**: Alertas visuais semânticos e indicadores visuais de carregamento (`Loader`).

---

## 🚀 4. Como Executar

### Pré-requisitos:
- Node.js v20+ ou v24+
- Expo CLI (`npm install -g expo-cli`)

### Passos:
```powershell
cd AlertaComMobile
npm install
npx expo start
```

Pressione:
- `a` para abrir no emulador Android
- `w` para abrir no navegador web
- Ou escaneie o QR Code com o aplicativo **Expo Go** no celular.

---

## 📦 5. Publicação no Firebase App Distribution (Requisito 7)

- O arquivo `eas.json` está configurado para geração de build de preview (`apk`).
- O hash do commit de referência está registrado no código em `src/config/appInfo.ts` e visível na tela "Sobre o App".
