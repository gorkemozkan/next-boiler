# Next.js Boilerplate

A modern Next.js boilerplate with TypeScript, Tailwind CSS, and more.

## Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS 4
- 🔐 Authentication with JWT
- 🗄️ Database with Drizzle ORM
- 📱 Responsive design
- 🚀 Optimized for performance

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your environment variables
4. Run the development server: `npm run dev`

## Code Quality with Biome

This project uses [Biome](https://biomejs.dev/) for fast formatting, linting, and code quality checks.

### Available Scripts

- `npm run format` - Check code formatting
- `npm run format:fix` - Fix code formatting automatically
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix auto-fixable issues
- `npm run check` - Run both formatting and linting checks
- `npm run check:fix` - Fix all auto-fixable issues

### VS Code Integration

Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for VS Code to get:
- Format on save
- Real-time linting
- Auto-fix on save
- Import organization

### Configuration

Biome is configured via `biome.json` with:
- 2-space indentation
- Single quotes
- 100 character line width
- Strict TypeScript rules
- Import organization

## Database

- Run migrations: `npm run db:migrate`
- Generate types: `npm run db:generate`
- Open studio: `npm run db:studio`

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run check` to ensure code quality
5. Submit a pull request

## License

MIT
