# Technical Context

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