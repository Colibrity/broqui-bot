# Technical Context

## Core Technologies
- **Next.js 15**: Using App Router for advanced routing patterns
- **React 18**: For dynamic UI components and state management
- **TypeScript**: For type-safe code and improved developer experience
- **Firebase Authentication**: For user account management
- **Firebase Firestore**: For storing chats, messages, and user memory
- **OpenAI API**: Using GPT-4 for chat processing and summarization
- **OpenAI Vision API**: For image analysis of food-related content
- **Tailwind CSS**: For utility-first styling throughout the application
- **shadcn/ui**: For pre-built accessible UI components
- **Zod**: For type validation and schema checking
- **Streaming Responses**: For progressive loading of AI responses
- **Sonner**: For toast notifications
- **Next-Themes**: For dark/light mode support

## Development Environment
- **Node.js**: Runtime environment for development
- **pnpm**: Package manager for faster dependency installation
- **ESLint**: For code quality and consistency
- **Prettier**: For code formatting
- **VS Code**: Recommended editor with project-specific settings
- **TypeScript**: For static type-checking
- **CI/CD**: GitHub Actions for automated deployment
- **Vercel**: For hosting and deployment

## API Integrations
- **OpenAI API**: 
  - GPT-4 for text processing and memory extraction
  - GPT-4 Vision for image analysis
  - System prompts include memory for context-aware responses
  - Custom enforcement of food topic constraints
  - Detection of allergies and dietary restrictions

- **Firebase**:
  - Authentication for user accounts
  - Firestore for data storage
  - Real-time updates for chat interface
  - Document structure with subcollections for messages
  - User-specific memory storage in dedicated collection

## Security Architecture
- **Authentication**: Firebase Auth for secure user authentication
- **Authorization**: Firestore rules for user-specific data access
- **API Protection**:
  - Environment variables for API keys
  - Server-side OpenAI API calls to protect API key
  - Next.js middleware for route protection
  - Referrer-based API access control for internal vs external requests
  - Environment-aware middleware to differentiate production vs development behavior
- **Data Validation**:
  - Input sanitization for all user inputs
  - TypeScript interfaces for type safety
  - Zod schemas for runtime validation

## Memory System Architecture
- **Storage**: User memory stored in Firestore `userMemories` collection
- **Extraction**:
  - OpenAI processes conversations to extract key user information
  - Priorities health information with specific formatting
  - Memory summarization reduces token count while preserving critical details
- **Utilization**:
  - Memory injected into system prompts for contextual awareness
  - Health warnings formatted prominently with visual markers
  - Client-side memory display for testing and verification
- **Update Mechanisms**:
  - Keyword detection for dietary restrictions in user messages
  - Asynchronous processing with setTimeout for non-blocking updates
  - Priority-based handling (100ms for allergies, 200ms for regular updates)
  - Full chat history processing for comprehensive memory building

## Database Schema
- **Collections**:
  - `users`: User profile information
  - `chats`: Chat metadata
  - `chats/{chatId}/messages`: Subcollection for messages
  - `userMemories`: User memory summaries
- **Document Structure**:
  - Chat: `{id, title, userId, createdAt, updatedAt}`
  - Message: `{id, role, content, timestamp, images}`
  - UserMemory: `{userId, summary, preferences, lastUpdated, createdAt}`

## Image Handling
- **Storage**: Base64 encoded images directly in Firestore
- **Upload**: Client-side base64 conversion
- **Processing**: 
  - Direct passing to OpenAI Vision API
  - Storage in message documents
- **Limitations**:
  - Firestore document size limits (1MB)
  - Need for compression (planned)

## Middleware and Route Protection
- **Authentication Check**: Routes protected based on user authentication state
- **Memory-test Protection**: Only accessible in development mode, redirects to /chat in production
- **API Protection**:
  - Memory API endpoints allow internal application calls via referrer checking
  - Blocks direct external access to prevent abuse
  - Environment-aware behavior (development vs production)
- **Next.js Middleware**: Centralized routing and protection logic

## Error Handling Strategy
- **User Feedback**: Toast notifications for success/error states
- **Error Boundaries**: React error boundaries for component-level errors
- **API Error Handling**: Structured error responses with appropriate HTTP status codes
- **Logging**: Console logging for development, structured logging for production
- **Retry Logic**: For transient failures in API calls

## Performance Optimizations
- **Response Streaming**: For faster perceived performance
- **Lazy Loading**: For non-critical components
- **Batched Updates**: For message lists and chat history
- **Memory Token Limits**: Constrained memory size to avoid prompt token limits
- **Asynchronous Processing**: Non-blocking memory updates
- **Priority-based Updates**: Different timing for critical vs non-critical information

## Deployment Strategy
- **Production**: Vercel hosting with continuous deployment
- **Environment Variables**: Secured in Vercel dashboard
- **Preview Deployments**: For PR review
- **Production Checks**: Middleware secures sensitive routes and APIs

## Constraints and Limitations
- **OpenAI Costs**: API usage optimization to manage costs
- **Firebase Free Tier**: Working within Firestore document size and query limitations
- **Memory Size**: Balancing detail vs token count in prompts
- **Image Storage**: Managing base64 size vs Firestore limits

## Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19
- **Styling**: Tailwind CSS, shadcn/ui component library
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (with base64 image storage)
- **AI**: OpenAI GPT-4 and Vision API with food topic constraints
- **Deployment**: Vercel (planned)

## Languages & Frameworks
- **TypeScript**: Primary language for type safety
- **Next.js 15**: React framework with App Router
- **React 19**: UI library with server and client components
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **Firebase JS SDK**: For auth and Firestore integration
- **OpenAI Node SDK**: For AI integration with streaming

## Development Environment
- **Node.js**: v18+ runtime
- **npm/yarn**: Package management
- **VS Code**: Recommended IDE
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control
- **Firebase Emulators**: Local development

## Build & Deployment
- **Development**: `yarn dev` for local development
- **Build**: `yarn build` for production builds
- **Linting**: `yarn lint` for code quality
- **Testing**: `yarn test` for testing (planned)
- **Deployment**: Vercel integration with GitHub

## Infrastructure
- **Firebase**: Authentication and Firestore database
- **OpenAI API**: AI processing with GPT-4 and Vision API
- **Vercel**: Hosting and deployment
- **GitHub**: Code repository

## Dependencies
- **Core**:
  - next: ^15.0.0
  - react: ^19.0.0
  - react-dom: ^19.0.0
  - firebase: ^10.0.0
  - openai: ^4.0.0
  
- **UI**:
  - tailwindcss: ^3.3.0
  - @tailwindcss/typography: Latest
  - shadcn/ui components
  - lucide-react: Latest (for icons)
  - date-fns: Latest (for date formatting)
  
- **Utilities**:
  - zod: Latest (for validation)
  - nanoid: Latest (for IDs)
  - client-only: Latest (for client components)

## Technical Constraints
- Next.js 15 App Router architecture requirements
- Firebase free tier limitations (no Firebase Storage usage)
- Firebase Firestore document size limits (1MB per document)
- OpenAI API rate limits and costs
- Image upload size limitations for base64 encoding
- Browser compatibility requirements
- Mobile responsiveness requirements

## Technical Debt
- Need to implement image compression before storage
- Optimization of base64 image storage to avoid Firestore limits
- Improved loading states for better user experience
- Pagination for chat history with large collections

## Version Control Strategy
- GitHub repository
- Feature branch workflow
- Pull request reviews
- Semantic versioning for releases

## Code Organization
- **/src/app**: Next.js App Router pages and layouts
  - `/app/auth`: Authentication pages
  - `/app/chat`: Chat interface with image handling
  - `/app/history`: Chat history view
  - `/app/api`: API routes for OpenAI communication
- **/src/components**: Reusable React components
  - `/components/ui`: UI components from shadcn
  - `/components/layout`: Layout components
- **/src/lib**: Utility functions and services
  - `/lib/firebase.ts`: Firebase initialization
  - `/lib/gpt.ts`: OpenAI API integration
  - `/lib/chatService.ts`: Chat data management with Firestore
  - `/lib/utils.ts`: Utility functions
- **/src/hooks**: Custom React hooks
  - `/hooks/useAuth.ts`: Authentication hook
- **/public**: Static assets including placeholder images
- **/memory-bank**: Project documentation

## API Endpoints
- **/api/chat**: Handles OpenAI interactions with proper constraints
  - POST: Sends user messages to OpenAI and returns responses
- **/api/upload** (planned): Image optimization endpoint
  - POST: Will process and compress images before storage

## Data Storage Strategy
- **Users**: Firebase Authentication with user profiles
- **Chats**: Firestore collection with user-specific chats
- **Messages**: Firestore subcollections within each chat document
- **Images**: Base64 encoded strings stored directly in message documents
- **History**: Firestore queries with sorting and filters 