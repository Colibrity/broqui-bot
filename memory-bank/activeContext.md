# Active Context

## Current Focus
The Broqui Bot has a functioning chat interface with Firebase integration and user memory system. The app successfully sends and receives messages, handles image uploads as base64 strings in Firestore, enforces food-related topic constraints with the OpenAI API, and maintains persistent memory of user preferences and dietary restrictions. Current focus is on optimizing the memory system, image handling, and improving the user experience with better error handling and loading states.

## Recent Changes
- Implemented a comprehensive user memory system that persists between conversations
- Created memory-test page for viewing and managing user memory
- Added prioritization for health-related information such as allergies
- Fixed React key rendering issues by implementing unique compound keys using timestamps and indices
- Removed mock data system and fully integrated with Firebase
- Modified image handling to store images directly in Firestore as base64 strings instead of using Firebase Storage
- Implemented proper saving of both user questions and AI responses to Firestore
- Added proper error handling throughout the chat flow
- Fixed chat history sorting and display

## Next Steps
1. Further optimize the memory system for more accurate information extraction
2. Add memory visualization improvements on the memory test page
3. Optimize image handling to prevent hitting Firestore document size limits
4. Implement image compression before storage to reduce data size
5. Add better loading indicators and user feedback throughout the app
6. Develop user profile management functionality
7. Expand history features with search and filtering capabilities

## Active Decisions
- Memory management strategy: Storing user memory summary in a dedicated Firestore collection with automatic updates after each conversation
- Health information prioritization: Highlighting allergies and dietary restrictions in system prompts
- Image handling strategy: Using base64 encoding stored directly in Firestore instead of Firebase Storage due to free plan limitations
- Message ID generation: Using timestamp-based unique IDs combined with indices to avoid React key conflicts
- UI optimization: Improved rendering performance with proper key handling for message components
- Authentication flow: Firestore security rules enforce user-specific data access

## Open Questions
- How to balance between concise memory and comprehensive user information?
- What's the optimal frequency for memory refreshing and summarization?
- What's the best approach to optimize base64 image storage without hitting Firestore document size limits?
- How to implement efficient image compression without degrading quality significantly?
- What's the optimal strategy for handling large chat histories with many images?
- How to implement rate limiting for OpenAI API calls as user base grows?

## Current Challenges
- Ensuring accurate extraction of important user information for the memory system
- Balancing memory size constraints with comprehensive information retention
- Optimizing image storage within Firestore's free tier limitations
- Ensuring application performance with increasing amounts of chat data
- Handling network issues gracefully with proper error states
- Balancing optimistic UI updates with actual backend state

## Implementation Notes
- User memory is stored in a dedicated 'userMemories' collection in Firestore
- Memory summary is generated using OpenAI with specific formatting for allergies and health info
- Base64 encoding is used for images to work with Firebase free plan without requiring Storage
- Server-side API routes handle OpenAI calls securely with API key protection
- Unique React keys now use compound identifiers (message ID + timestamp + index) to avoid conflicts
- Chat messages are stored as subcollections in Firestore for efficient access and organization
- System prompt includes user memory with highlighted health information
- Memory testing page allows visualization and management of user memory 