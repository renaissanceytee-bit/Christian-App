# Development Container Configuration

This directory contains the GitHub Codespaces configuration for the Christian App project.

## What's Configured

- **Base Image**: Node.js 18 (matches CI/CD workflow)
- **Extensions**: 
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript and React development tools
  - GitHub Copilot
- **Port Forwarding**:
  - Port 5173: Vite development server (frontend)
  - Port 4000: Backend API server (optional)
- **Auto Setup**: Dependencies are automatically installed on container creation

## Using Codespaces

1. Click the "Code" button in the GitHub repository
2. Select "Codespaces" tab
3. Click "Create codespace on [branch-name]"
4. Wait for the environment to build (first time takes a few minutes)
5. Once ready, run `npm run dev` to start the development server
6. Optionally, run `npm run start:push-server` in a new terminal for the backend

## Local Development with Dev Containers

If you have Docker and VS Code installed locally:

1. Install the "Dev Containers" extension in VS Code
2. Open the repository in VS Code
3. Press F1 and select "Dev Containers: Reopen in Container"
4. VS Code will build and connect to the development container

## Customization

To modify the configuration, edit `.devcontainer/devcontainer.json` and rebuild the container.
