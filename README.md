Smartmeal AI

A modern, full-featured React application built with cutting-edge technologies for optimal performance and developer experience.

## Live Demo

**[View Live Demo](https://smartmeal-dashboard.netlify.app/)**

## Features

- **Modern UI/UX**: Beautiful, responsive interface with smooth animations
- **Analytics Dashboard**: Interactive data visualizations and insights
- **Authentication System**: Secure user authentication and authorization
- **Theme Support**: Light/dark mode with persistent preferences
- **Type-Safe**: Built with TypeScript for enhanced reliability
- **Optimized Performance**: Lightning-fast development and production builds

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/devfest-not-yet/website.git
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

## Getting Started

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check and fix code quality issues:

```bash
npm run lint
```

## Tech Stack

### Core

- **React 19** - Latest version of the UI library
- **Vite** - Next-generation frontend build tool
- **TypeScript** - Static type checking

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Modern icon set
- **Recharts** - Composable charting library

### State Management

- **TanStack Query** - Powerful data synchronization
- **Axios** - HTTP client
- **Context API** - Global state management

### Routing

- **React Router DOM** - Declarative routing

### Development Tools

- **ESLint** - Code quality and consistency
- **PostCSS** - CSS transformation
- **Autoprefixer** - Cross-browser compatibility

## Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── styles/          # Global styles
│   ├── App.tsx          # Root component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── .env.example         # Environment variables template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## Key Features Explained

### Authentication

Secure authentication system with:

- User login/logout
- Protected routes
- Persistent sessions
- Context-based state management

### Theme System

Flexible theming with:

- Light/dark mode toggle
- Persistent theme preferences
- Smooth transitions

### Analytics Dashboard

Interactive data visualizations featuring:

- Real-time charts and graphs
- Responsive design
- Multiple chart types via Recharts

### Animations

Delightful user experience with:

- Page transitions
- Floating effects
- Smooth interactions via Framer Motion

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_url
VITE_APP_TITLE=Your App Name
```

### Tailwind CSS

Customize your design system in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
};
```

## Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
