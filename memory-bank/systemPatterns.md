# System Patterns

## Architecture Overview
Broqui Bot Next follows a modern Next.js 15 architecture with App Router using server components and client components appropriately:
- **Client-side**: UI components, form handling, interactivity, image handling
- **Server-side**: Authentication, API calls, data processing
- **Firebase**: User management, Firestore for data and image storage
- **OpenAI**: GPT-4 and Vision API integration with food topic constraints
- **Memory System**: User preference persistence with priority for health information

## Design Patterns
- **Authentication Pattern**: Route protection with Firebase Auth
- **Container/Presentational Pattern**: Separating logic from UI
- **Provider Pattern**: Context providers for auth and chat state
- **Custom Hook Pattern**: Encapsulating complex logic in reusable hooks
- **Streaming Pattern**: For AI response streaming
- **Repository Pattern**: For Firebase Firestore interaction
- **Compound Key Pattern**: Using timestamp + index for unique React keys
- **Memory Extraction Pattern**: Using AI to extract and summarize user preferences
- **Priority Tagging Pattern**: Highlighting critical health information within memory
- **Keyword Detection Pattern**: Scanning messages for dietary restriction keywords
- **Async Processing Pattern**: Using setTimeout for non-blocking memory updates
- **Referrer-Based Security Pattern**: Allowing internal API calls while blocking external access

## Component Structure
- **Layout Components**: Page layouts, containers
- **Feature Components**: Auth forms, Chat interface, Memory management
- **UI Components**: Buttons, inputs, cards from shadcn/ui
- **Composite Components**: Combining UI components for specific features
- **HOCs**: For route protection and auth requirements
- **Memory Components**: For visualizing and managing user memory

## Data Flow
1. **Authentication Flow**:
   - User credentials → Firebase Auth → JWT Token → Client State
   - Protected routes check auth state before rendering

2. **Chat Flow**:
   - User input → Client State → Server API Route → OpenAI API → Response Stream → Client Display
   - Messages stored in Firestore with subcollections
   - Chat history retrieved and displayed with proper sorting
   - Keyword detection for allergies → Priority memory updates

3. **Image Upload Flow**:
   - Image Selection → Client Validation → Base64 Encoding → Firestore Storage → OpenAI Vision API → Analysis Display
   - Images stored directly in Firestore documents as base64 strings

4. **Memory Flow**:
   - User chat messages → Keyword detection → Priority assignment → Response processing → Async memory update → Firestore storage → System prompt enhancement
   - Memory incorporated into each chat prompt for continuity
   - Health information prioritized in prompt formatting with visual highlighting
   - Different update timing based on content criticality (100ms for allergies, 200ms for regular)

## State Management
- **Auth State**: Firebase Auth state with custom hook
- **Chat State**: React state with Firebase synchronization
- **UI State**: Local component state for UI elements
- **Form State**: Controlled components for input handling
- **Upload State**: Upload progress and status tracking with optimistic UI updates
- **Memory State**: User preference persistence with background updates
- **Dietary Restriction State**: Detection and prioritization of health information

## API Organization
- **/api/chat**: OpenAI GPT interface with food constraint enforcement, memory integration, and allergy detection
- **/api/vision**: Image analysis with OpenAI Vision, memory integration, and allergy detection
- **/api/memory**: Endpoints for memory management (get, update, clear, aggregate)
- **/api/upload**: Image processing and optimization (planned)
- **/api/auth**: Authentication helpers
- **Middleware**: Intelligent routing and security for production vs development environments
- Firebase SDK for direct client-side auth and Firestore operations
- OpenAI SDK for server-side API calls with content moderation

## Error Handling
- Client-side form validation
- API error boundaries with appropriate user feedback
- Graceful degradation with fallback UI
- User-friendly error messages for common failures
- Retry mechanisms for network issues
- Comprehensive error logging
- Memory extraction fallbacks for error cases
- Non-blocking memory operations to prevent cascade failures

## Security Model
- Firebase Authentication for identity management
- Firestore security rules for data access control
- Server-side API key protection for OpenAI calls
- Content validation and sanitization
- Rate limiting to prevent abuse
- Input validation for all user-submitted content
- User-specific memory isolation
- Referrer-based API protection for internal vs external requests
- Environment-aware middleware for production security

## Testing Strategy
- Component testing with React Testing Library
- API route testing with mocks
- E2E testing for critical flows
- Authentication flow testing
- Accessibility testing
- Image handling and storage testing
- Memory extraction and persistence testing
- Keyword detection validation for dietary restrictions
- Middleware security testing for referrer validation

## Performance Considerations
- Memory extraction batching for efficient processing
- Memory size constraints to avoid prompts bloat
- Image optimization before storage (planned)
- Response streaming for faster perceived performance
- Lazy loading of non-critical components
- Optimistic UI updates for better UX
- Efficient Firestore query patterns
- Message batching for large history retrieval
- Asynchronous memory processing to prevent response blocking
- Priority-based update queuing for critical vs non-critical information 