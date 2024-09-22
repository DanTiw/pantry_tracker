# Smart Pantry Management App

An innovative pantry management solution that leverages modern web technologies and AI to streamline kitchen organization and meal planning.

## 🌟 Features

- **Real-time Inventory Tracking**: Keep your pantry stock up-to-date with ease
- **AI-Powered Recipe Suggestions**: Get creative meal ideas based on your available ingredients
- **User Authentication**: Secure and personalized experience for each user
- **Responsive Design**: Seamless usage on both mobile and desktop devices

## 🛠️ Tech Stack

- **Frontend**: Next.js
- **Database**: Firebase Realtime Database
- **Authentication**: Clerk
- **UI Components**: shadcn/ui
- **AI Model**: Llama 3.1

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account
- Clerk account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pantry-management-app.git
   ```

2. Navigate to the project directory:
   ```
   cd pantry-management-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase and Clerk credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

