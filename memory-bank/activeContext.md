# Active Context

## Current Focus
The Broqui Bot has a functioning chat interface with Firebase integration and user memory system. The app successfully sends and receives messages, handles image uploads as base64 strings in Firestore, enforces food-related topic constraints with the OpenAI API, and maintains persistent memory of user preferences and dietary restrictions. Current focus is on fixing and enhancing the memory system functionality, particularly in production environments, improving automatic detection of dietary restrictions, and ensuring memory updates are reliably processed.

## Recent Changes
- Fixed memory API access in production by updating middleware to allow internal calls
- Enhanced memory update mechanism to use `forceFullMemoryUpdate` instead of `refreshUserMemory`
- Implemented detection of allergy-related keywords in user messages for priority memory updates
- Added asynchronous memory processing with setTimeout to prevent blocking API responses
- Removed direct production blocks in API endpoint routes, replacing them with smarter referrer checks
- Fixed memory-test page to correctly work with selected chats
- Optimized middleware to differentiate between direct API access and internal application calls
- Added specific detection for terms related to dietary restrictions: "allergies", "intolerance", "cannot eat", "can't eat"
- Improved memory priority handling to ensure health information is prominently displayed in AI responses

## Next Steps
1. Implement image compression before storage to reduce data size
2. Add better loading indicators and user feedback throughout the app
3. Develop user profile management functionality
4. Expand history features with search and filtering capabilities
5. Implement pagination for chat history to handle larger conversation volumes
6. Create more comprehensive testing of the memory system in production environments

## Active Decisions
- Memory updating strategy: Using non-blocking setTimeout for asynchronous updates after response generation
- API protection strategy: Using referrer-based checks in middleware instead of environment blocks in API routes
- Allergy detection approach: Scanning messages for specific keywords that indicate dietary restrictions
- Memory prioritization: Using different update timing based on content criticality (100ms for allergies, 200ms for regular updates)
- Memory processing model: Using full chat history processing via `forceFullMemoryUpdate` for more reliable memory creation

## Open Questions
- What additional keywords should be monitored for dietary restriction detection?
- How to implement more sophisticated memory extraction algorithms that can identify implicit health information?
- What's the optimal approach to optimize base64 image storage without hitting Firestore document size limits?
- How to implement efficient image compression without degrading quality significantly?
- What's the optimal strategy for handling large chat histories with many images?

## Current Challenges
- Ensuring memory updates work reliably in both development and production environments
- Balancing memory size constraints with comprehensive information retention
- Optimizing image storage within Firestore's free tier limitations
- Ensuring memory is updated promptly after critical health information is shared
- Managing potentially large memory summaries without degrading chat response performance
- Ensuring correct middleware behavior with various origin contexts

## Implementation Notes
- User memory is stored in a dedicated 'userMemories' collection in Firestore
- Memory summary is generated using OpenAI with specific formatting for allergies and health info
- Memory updates are triggered after every chat message and image analysis completion
- API routes for memory operations use referrer-checks in middleware to allow internal app calls in production
- Health-related information is detected via keyword scanning and processed with higher priority
- Chat and Vision API routes both implement the same memory update logic for consistency
- Non-blocking asynchronous memory updates via setTimeout avoid slowing down the user experience 