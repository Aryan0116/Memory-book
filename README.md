 📚 Memory Book - Digital Slam Book Platform

A modern, beautiful digital slam book application where you can create personalized memory books, collect responses from friends and family, and cherish memories forever.

![Memory Book Banner](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80)

## ✨ Features

### 🎨 **Beautiful Themes**
- **Gradient Sunset** - Warm orange to pink gradient
- **Ocean Breeze** - Cool blue to teal gradient  
- **Forest Dream** - Green to blue nature gradient
- **Purple Magic** - Purple to pink gradient
- **Cherry Blossom** - Pink to rose gradient
- **Midnight** - Dark blue to purple gradient
- **Golden Hour** - Yellow to orange gradient
- **Emerald** - Green to emerald gradient

### 📝 **Flexible Question Types**
- **Text Questions** - Open-ended responses
- **Multiple Choice** - Select from predefined options
- **Rating/Scale** - 1-10 rating system
- **Yes/No** - Simple binary questions
- **File Upload** - Share documents and files
- **Image Upload** - Add photos and memories

### 🔒 **Privacy & Security**
- End-to-end encryption for all responses
- Secure user authentication
- Private response viewing
- Data protection compliance

### 📊 **Analytics & Insights**
- Real-time response tracking
- View count analytics
- Response statistics
- Export capabilities

### 📱 **Modern Experience**
- Fully responsive design
- Mobile-first approach
- Beautiful animations
- Intuitive user interface
- QR code sharing
- WhatsApp integration


## 🎯 How to Use

### Creating Your First Memory Book

1. **Sign Up/Login** - Create your account or sign in
2. **Click "Create New"** - Start building your memory book
3. **Choose a Theme** - Select from 8 beautiful gradient themes
4. **Add Questions** - Create personalized questions with different types
5. **Customize Settings** - Set required fields and options
6. **Publish & Share** - Get your unique link and QR code

### Sharing Your Memory Book

- **Direct Link** - Copy and share the unique URL
- **QR Code** - Generate and print QR codes for easy access
- **WhatsApp** - Share directly via WhatsApp with a personalized message
- **Social Media** - Share on any platform

### Managing Responses

- **View Responses** - Access all collected memories in one place
- **Analytics** - Track views, responses, and engagement
- **Export Data** - Download responses for backup
- **Privacy Controls** - Manage who can access your memory book

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── DragDropQuestionBuilder.tsx
│   ├── QuestionBuilder.tsx
│   └── SharePopup.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication logic
│   ├── useResponses.ts  # Response management
│   └── useSlamBooks.ts  # Memory book operations
├── pages/               # Page components
│   ├── Auth.tsx         # Authentication page
│   ├── CreateSlamBook.tsx  # Create memory book
│   ├── Dashboard.tsx    # User dashboard
│   ├── Index.tsx        # Landing page
│   ├── Preview.tsx      # Preview memory book
│   ├── QRCodePage.tsx   # QR code generation
│   ├── SlamBookShare.tsx # Public sharing page
│   └── ViewResponses.tsx # Response viewing
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── integrations/        # External service integrations
└── lib/                # Shared libraries
```


## 📈 Analytics

Track your memory book performance:
- **Views** - How many people visited
- **Responses** - How many people participated  
- **Completion Rate** - Response quality metrics
- **Popular Questions** - Most answered questions

## 🔐 Security Features

- **Encrypted Storage** - All responses are encrypted
- **Secure Authentication** - Email/password with Supabase
- **Data Privacy** - GDPR compliant
- **Access Control** - Private by default
- **Secure File Uploads** - Validated file types


<div align="center">

### 🌟 Star this repo if you found it helpful!

**Made with ❤️ by the Memory Book team**

</div>