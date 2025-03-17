# Auth0 Starter

A modern Next.js application with Auth0 authentication integration and a comprehensive UI component library.

## Features

- 🔐 Auth0 Authentication
- ⚡ Next.js 15 with React 19
- 🎨 Beautifully designed UI components with Radix UI
- 🌙 Dark mode support with next-themes
- 📱 Fully responsive design
- 🧩 Type-safe with TypeScript
- 📋 Form validation with React Hook Form
- 🔄 Data visualization with Recharts
- 🎭 Animation with tailwindcss-animate

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Authentication**: [Auth0](https://auth0.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or Yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mahezsh/auth0-starter.git
cd auth0-starter
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with your Auth0 credentials:

```
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_CALLBACK_URL=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_AUTH0_LOGOUT_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Auth0 Configuration

1. Create an Auth0 account if you don't have one at [auth0.com](https://auth0.com/)
2. Create a new application in the Auth0 dashboard
3. Set the following URLs in your Auth0 application settings:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
4. Copy your Auth0 domain and client ID to your `.env` file

## Project Structure

```
auth0-starter/
├── components/     # UI components
├── hooks/          # Custom hooks
├── lib/            # Utility functions and shared logic
├── public/         # Static assets
├── styles/         # Global styles
└── types/          # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm start` - Runs the built app in production mode
- `npm run lint` - Lints the codebase

## Deployment

This project can be deployed on [Vercel](https://vercel.com/) with minimal configuration:

```bash
npm i -g vercel
vercel
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[mahezsh](https://github.com/mahezsh)

---

Made with ❤️ using Next.js and Auth0
