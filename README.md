# SocioLearn 📚

**AI-powered sociology learning platform** — master sociology through understanding, not memorization.

![SocioLearn](https://img.shields.io/badge/SocioLearn-v1.0-8b5cf6?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)

## Features

- 🤖 **AI Tutor** — Exam-ready answers with key theorists, arguments, evaluations, and exam tips
- 🎧 **Audio Lessons** — 7 core sociology lessons with an interactive audio player
- ⚡ **Active Recall Quiz** — 6-question MCQ with instant explanations
- 📝 **Smart Notes** — Save and organise your sociology notes with colour coding
- 🌐 **10 Topic Areas** — Culture, Stratification, Deviance, Family, Education, Religion, Media, Power, Health, Globalisation

## Getting Started

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/sociolearn.git
cd sociolearn
npm install
npm run dev
```

The app runs at `http://localhost:5173`

> **Note:** The AI Tutor requires an Anthropic API key. The app calls the API directly from the browser — add your key handling in `src/SociologyApp.jsx` as needed for your deployment.

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 18** with hooks
- **Vite 5** for fast builds
- **Lucide React** for icons
- **Anthropic Claude API** (claude-sonnet-4-20250514) for AI tutoring
- **Nunito** font via Google Fonts

## Sociology Topics Covered

| Topic | Key Theorists |
|-------|--------------|
| Culture & Society | Durkheim, Parsons, Giddens |
| Social Stratification | Marx, Weber, Bourdieu |
| Deviance & Crime | Becker, Lemert, Cohen |
| Family & Kinship | Engels, Parsons, Barrett |
| Education | Bourdieu, Bowles & Gintis, Willis |
| Religion & Belief | Durkheim, Weber, Marx, Davie |
| Media & Technology | Hall, Chomsky, Baudrillard |
| Power & Politics | Gramsci, Foucault, Lukes |
| Health & Illness | Parsons, Navarro, Annandale |
| Globalisation | Giddens, Held, Wallerstein |

## License

MIT
