# Overview

This is a full-stack web application called "Markode" (ماركود) - an AI-powered platform for generating web applications and projects from natural language descriptions. The application supports both Arabic and English languages with a focus on serving Arabic-speaking developers. Users can describe their project ideas in plain language, and the AI generates complete, production-ready code with deployment capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Single-page application built with React 18+ using TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **shadcn/ui Component Library**: Modern, accessible UI components built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens and dark mode support
- **Wouter Router**: Lightweight client-side routing solution
- **TanStack Query**: Server state management for data fetching and caching
- **React Hook Form**: Form handling with Zod schema validation
- **Monaco Editor**: Code editor component for viewing and editing generated code
- **Internationalization**: Custom i18n solution supporting Arabic (RTL) and English (LTR) languages

## Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript
- **Session-based Authentication**: Secure user sessions using express-session with PostgreSQL storage
- **Replit Authentication**: OAuth integration with Replit's OpenID Connect service
- **AI Code Generation**: OpenAI API integration (GPT-5) for generating complete project structures
- **File System Management**: Dynamic code generation and file management capabilities

## Database Design
- **PostgreSQL with Drizzle ORM**: Type-safe database queries and migrations
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Core Tables**:
  - `users`: User profiles and authentication data
  - `projects`: Generated projects with metadata and source code
  - `templates`: Pre-built project templates
  - `sessions`: User session storage

## Authentication & Authorization
- **Replit OAuth Flow**: Seamless authentication through Replit's identity provider
- **Session Management**: Secure server-side sessions with CSRF protection
- **User Profile Management**: Automatic user profile creation and updates
- **Access Control**: Project ownership validation and authorization middleware

# External Dependencies

## AI Services
- **OpenAI API**: GPT-5 model for natural language to code generation
- **Code Generation Pipeline**: Structured prompts for generating complete project architectures

## Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Database Migrations**: Drizzle Kit for schema management and versioning

## Authentication
- **Replit OpenID Connect**: OAuth 2.0 authentication provider
- **Session Storage**: PostgreSQL-backed session management

## Development & Deployment
- **Replit Platform Integration**: Development environment plugins and banners
- **Vite Plugins**: Runtime error overlay and development tools
- **WebSocket Support**: Real-time features through Neon's serverless infrastructure

## UI & Styling
- **Google Fonts**: Custom font loading (Inter, Cairo, Amiri, Fira Code)
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Monaco Editor**: VS Code editor integration for code editing

## Monitoring & Analytics
- **Error Tracking**: Built-in error boundary handling
- **Request Logging**: Comprehensive API request and response logging
- **Performance Monitoring**: Client-side query caching and optimization