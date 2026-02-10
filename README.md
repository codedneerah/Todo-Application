# Todo Application

Responsive Todo application built with React 19, showcasing advanced frontend engineering skills including API integration, routing, error handling, and accessibility.

## Features

- Todo List & Pagination: Display todos with pagination (10 items per page)
- Todo Details: Nested route for individual todo details with navigation back
- Error Handling: React Error Boundary with custom fallback UI and test route
- Basic UI/UX: Semantic HTML, accessibility attributes, responsive design, loading states
- Search & Filtering: Search by title and filter by completion status
- CRUD Operations: Create, update, and delete todos with forms and confirmation dialogs
- Authentication & User Management: Login/register flows with validation and protected routes
- Real-Time Notifications: WebSocket integration for live task updates
- Offline Capabilities: Service worker with caching and offline support

## Setup Instructions

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd todo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

5. Preview production build
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technology Choices and Reasoning

- React 19: Latest version with improved performance and new features
- Tanstack Query: Efficient server state management with caching and synchronization
- React Router v7: Modern routing with built-in data loading and error handling
- Tailwind CSS: Utility-first CSS framework for rapid UI development
- React Hook Form: Performant forms with minimal re-renders
- Vite: Fast build tool with HMR and optimized production builds
- Axios: Reliable HTTP client with interceptors and error handling

## GIFs of Key Features

- Todo List with Pagination: [Add GIF showing todo list with pagination controls]
- Search and Filtering: [Add GIF demonstrating search and filter functionality]
- CRUD Operations: [Add GIF showing create, edit, and delete operations]
- Authentication Flow: [Add GIF of login/register process]
- Real-time Updates: [Add GIF showing live task synchronization]

## Known Issues and Future Improvements

### Known Issues
- API rate limiting may affect performance during high usage
- Offline functionality is basic and could be enhanced

### Future Improvements
- User authentication and authorization
- Real-time notifications via WebSocket
- Advanced offline capabilities with service workers
- Dark mode toggle
- Drag and drop for todo reordering
- Categories and tags for todos
- Export/import functionality
- Mobile app version
