# System Patterns

## Architecture Overview
Broqui Bot Next follows a modern Next.js 15 architecture with App Router using server components and client components appropriately:
- **Client-side**: UI components, form handling, interactivity
- **Server-side**: Authentication, API calls, data processing
- **Firebase**: User management, image storage
- **OpenAI**: GPT-4 and Vision API integration

## Design Patterns
- **Authentication Pattern**: Route protection with Firebase Auth
- **Container/Presentational Pattern**: Separating logic from UI
- **Provider Pattern**: Context providers for auth and chat state
- **Custom Hook Pattern**: Encapsulating complex logic in reusable hooks
- **Streaming Pattern**: For AI response streaming
- **Repository Pattern**: For Firebase interaction

## Component Structure
- **Layout Components**: Page layouts, containers
- **Feature Components**: Auth forms, Chat interface
- **UI Components**: Buttons, inputs, cards from shadcn/ui
- **Composite Components**: Combining UI components for specific features
- **HOCs**: For route protection and auth requirements

## Data Flow
1. **Authentication Flow**:
   - User credentials → Firebase Auth → JWT Token → Client State
   - Protected routes check auth state before rendering

2. **Chat Flow**:
   - User input → Client State → Server API Route → OpenAI API → Response Stream → Client Display
   - Message history maintained in client state

3. **Image Upload Flow**:
   - Image Selection → Client Validation → Firebase Storage → URL Generation → OpenAI Vision API → Analysis Display

## State Management
- **Auth State**: Firebase Auth state with custom hook
- **Chat State**: React state with Context API
- **UI State**: Local component state for UI elements
- **Form State**: Form libraries for input handling
- **Upload State**: Upload progress and status tracking

## API Organization
- **/api/chat**: OpenAI GPT interface
- **/api/upload**: Image upload handling
- **/api/auth**: Authentication helpers
- Firebase SDK for direct client-side auth
- OpenAI SDK for server-side API calls

## Error Handling
- Client-side form validation
- API error boundaries
- Graceful degradation
- User-friendly error messages
- Retry mechanisms for transient errors
- Logging for debugging

## Security Model
- Firebase Authentication for identity management
- JWT tokens for session management
- Server-side API key protection
- Content validation before processing
- Rate limiting to prevent abuse
- Input sanitization

## Testing Strategy
- Component testing with React Testing Library
- API route testing with mocks
- E2E testing for critical flows
- Authentication flow testing
- Accessibility testing

## Performance Considerations
- Image optimization before upload
- Response streaming for faster perceived performance
- Lazy loading of non-critical components
- Optimistic UI updates
- Efficient state management
- API response caching where appropriate 