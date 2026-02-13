# Todo Application

This is a modern, responsive Todo Application built with React (and related frontend technologies) designed to help users efficiently manage daily tasks. The application focuses on clean UI, intuitive state management, and scalable component architecture.

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

## Screenshot of Key Features

### Todo List View
![Todo List](screenshots/Todo%20list.png)
*Main todo list with pagination, search, and filtering functionality*

### Todo Details Page
![Todo Details](screenshots/todo%20details.png)
*Individual todo details with full information and navigation back to list*

### 404 Error Page
![404 Page](screenshots/todo%20404%20page.png)
*Custom 404 page for undefined routes with navigation options*




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
- Due dates and reminders with notifications
- Priority levels (High, Medium, Low) with visual indicators
- Recurring todos and templates
- Collaboration features (shared lists, permissions)
- Analytics dashboard (productivity stats, completion rates)
- Voice input for quick todo creation
- Integration with calendar apps (Google Calendar, Outlook)
- Bulk actions (mark multiple as complete, delete, move)
- Undo/redo functionality for actions
- Custom themes and color schemes
- Advanced search with multiple filters (date range, priority, category)
- Todo history and activity log
- Backup and cloud sync across devices
- Keyboard shortcuts for power users
- Progressive Web App enhancements (installable, push notifications)
- Integration with external services (Slack, Trello, etc.)
- Todo sharing via links with view/edit permissions
- Time tracking for tasks
- Subtasks and nested todo items
- File attachments for todos

