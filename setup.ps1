Write-Host "🚀 Starting project setup..."

# تثبيت pnpm
npm install -g pnpm

# تثبيت جميع الحزم
pnpm install

# React + Router
pnpm add react react-dom react-router-dom

# shadcn/ui + tailwind + motion
pnpm add @radix-ui/react-icons framer-motion lucide-react tailwindcss postcss autoprefixer @shadcn/ui class-variance-authority tailwind-variants

# react-query
pnpm add @tanstack/react-query

# TypeScript + types
pnpm add -D typescript @types/react @types/react-dom

# dotenv
pnpm add dotenv

Write-Host "✅ Project setup completed!"
