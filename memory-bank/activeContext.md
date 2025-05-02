# Active Context

## Current Focus
The Broqui Bot has a functioning chat interface with Firebase integration. The app successfully sends and receives messages, handles image uploads as base64 strings in Firestore, and enforces food-related topic constraints with the OpenAI API. Current focus is on optimizing image handling and improving the user experience with better error handling and loading states.

## Recent Changes
- Fixed React key rendering issues by implementing unique compound keys using timestamps and indices
- Removed mock data system and fully integrated with Firebase
- Modified image handling to store images directly in Firestore as base64 strings instead of using Firebase Storage
- Implemented proper saving of both user questions and AI responses to Firestore
- Added proper error handling throughout the chat flow
- Fixed chat history sorting and display

## Next Steps
1. Optimize image handling to prevent hitting Firestore document size limits
2. Implement image compression before storage to reduce data size
3. Add better loading indicators and user feedback throughout the app
4. Develop user profile management functionality
5. Expand history features with search and filtering capabilities

## Active Decisions
- Image handling strategy: Using base64 encoding stored directly in Firestore instead of Firebase Storage due to free plan limitations
- Message ID generation: Using timestamp-based unique IDs combined with indices to avoid React key conflicts
- UI optimization: Improved rendering performance with proper key handling for message components
- Authentication flow: Firestore security rules enforce user-specific data access

## Open Questions
- What's the best approach to optimize base64 image storage without hitting Firestore document size limits?
- How to implement efficient image compression without degrading quality significantly?
- What's the optimal strategy for handling large chat histories with many images?
- How to implement rate limiting for OpenAI API calls as user base grows?

## Current Challenges
- Optimizing image storage within Firestore's free tier limitations
- Ensuring application performance with increasing amounts of chat data
- Handling network issues gracefully with proper error states
- Balancing optimistic UI updates with actual backend state

## Implementation Notes
- Base64 encoding is used for images to work with Firebase free plan without requiring Storage
- Server-side API routes handle OpenAI calls securely with API key protection
- Unique React keys now use compound identifiers (message ID + timestamp + index) to avoid conflicts
- Chat messages are stored as subcollections in Firestore for efficient access and organization
- System prompt successfully enforces food-related constraints on AI responses 