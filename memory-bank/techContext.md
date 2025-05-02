# Technical Context

## Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19
- **Styling**: Tailwind CSS, shadcn/ui component library
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage
- **AI**: OpenAI GPT-4 and Vision API
- **Deployment**: Vercel (planned)

## Languages & Frameworks
- **TypeScript**: Primary language for type safety
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **Firebase JS SDK**: For auth and storage integration
- **OpenAI Node SDK**: For AI integration

## Development Environment
- **Node.js**: v18+ runtime
- **npm/pnpm**: Package management
- **VS Code**: Recommended IDE
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control
- **Firebase Emulators**: Local development

## Build & Deployment
- **Development**: `npm run dev` for local development
- **Build**: `npm run build` for production builds
- **Linting**: `npm run lint` for code quality
- **Testing**: `npm run test` for testing
- **Deployment**: Vercel integration with GitHub

## Infrastructure
- **Firebase**: Authentication and storage
- **OpenAI API**: AI processing
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
  - @tailwindcss/forms: Latest
  - shadcn/ui components
  - lucide-react: Latest (for icons)
  
- **Utilities**:
  - zod: Latest (for validation)
  - react-hook-form: Latest (for forms)
  - nanoid: Latest (for IDs)

## Technical Constraints
- Next.js 15 App Router architecture requirements
- Firebase authentication limitations
- OpenAI API rate limits and costs
- Image upload size limitations
- Browser compatibility requirements
- Mobile responsiveness requirements

## Technical Debt
- Not applicable yet - new project

## Version Control Strategy
- GitHub repository
- Feature branch workflow
- Pull request reviews
- Semantic versioning for releases

## Code Organization
- **/app**: Next.js App Router pages and layouts
  - `/app/auth`: Authentication pages
  - `/app/chat`: Chat interface
  - `/app/api`: API routes
- **/components**: Reusable React components
  - `/components/ui`: UI components
  - `/components/auth`: Auth-related components
  - `/components/chat`: Chat-related components
- **/lib**: Utility functions and services
  - `/lib/firebase.ts`: Firebase initialization
  - `/lib/gpt.ts`: OpenAI API integration
- **/hooks**: Custom React hooks
  - `/hooks/useAuth.ts`: Authentication hook
  - `/hooks/useChat.ts`: Chat functionality hook
- **/types**: TypeScript type definitions
- **/public**: Static assets
- **/styles**: Global styles 