# Product Context

## Purpose
Broqui Bot Next exists to provide users with a specialized AI assistant focused exclusively on food-related topics. It combines text and image analysis to offer comprehensive food advice, recipes, nutritional information, and culinary guidance in an easily accessible chat interface.

## Problem Statement
- Users need reliable, accurate food information but general AI assistants may not provide specialized food knowledge
- Users want to analyze food images for identification, quality assessment, and nutritional information
- Users need a dedicated, focused assistant that won't stray into unrelated topics
- Accessing food expertise traditionally requires multiple different sources or applications

## Target Users
- Food enthusiasts seeking cooking advice and recipe suggestions
- Health-conscious individuals looking for nutritional information
- People with dietary restrictions needing ingredient verification
- Curious users who want to identify or learn about unfamiliar foods
- Home cooks requiring guidance on food preparation techniques

## User Experience Goals
- Simple, intuitive interface requiring minimal learning curve
- Secure and straightforward authentication process
- Responsive design that works well on both desktop and mobile devices
- Seamless image upload and analysis experience
- Fast, accurate AI responses that stay on-topic
- Persistent chat history for reference and continuity

## User Journeys
1. **Authentication Flow:**
   - User signs up with email/password
   - User logs in with credentials
   - User resets password if forgotten
   - Successful auth redirects to chat interface

2. **Chat Interaction Flow:**
   - User types food-related question
   - User receives relevant, focused response
   - User can follow up with additional questions
   - Chat history is saved automatically
   
3. **Image Analysis Flow:**
   - User uploads food image
   - Image is encoded and stored in Firestore
   - System processes and analyzes the image
   - Bot provides analysis of the food in the image

4. **History Management Flow:**
   - User views list of previous conversations
   - User selects conversation to continue
   - User can start new conversation at any time
   - Future: User will be able to search, filter, and manage history

## Product Features
- Email/password authentication with Firebase
- Protected chat interface for authenticated users only
- Text-based chat focused on food topics
- Image upload and analysis capability
- Food-specific AI responses with OpenAI GPT-4 and Vision API
- Topic constraint enforcement (non-food topics rejected)
- Chat history persistence in Firebase Firestore
- Base64 image storage directly in Firestore

## Implemented Features
- Secure authentication flow with Firebase
- Food-focused chat interface with OpenAI integration
- Image upload and analysis capabilities
- Persistent chat history with Firestore
- Strict topic enforcement for food-only responses
- Responsive design for all device types

## Business Requirements
- Secure user authentication and data handling
- AI chat responses limited to food-related topics only
- Image processing capability for food analysis
- Responsive interface across device types
- Proper error handling and user feedback
- Efficient data storage within free tier limitations

## Market Context
- Competes with general AI assistants but with specialized food focus
- Provides combined text and image analysis capabilities in one interface
- Differentiated by strict topic enforcement and specialization
- Appeals to growing interest in culinary exploration and health-conscious eating

## User Feedback Priorities
- Image optimization to improve storage efficiency
- More comprehensive food knowledge and recipe suggestions
- Search functionality for chat history
- Expanded food analysis features
- Export capabilities for recipes and advice 