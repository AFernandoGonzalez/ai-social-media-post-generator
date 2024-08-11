# Quickcontentai

## Overview

The AI Social Media Post Generator is a SaaS platform designed to help businesses and individuals create high-quality, consistent, and engaging social media content across multiple platforms. Utilizing advanced AI technologies like ChatGPT and Vercel SDK AI, this tool generates tailored content, including text, hashtags, and call-to-action elements. It also offers multi-language support, ensuring that messages resonate with a global audience.

## Features

Features
--------

*   **Content Generation:** Create customized social media content for platforms like Instagram, Twitter, LinkedIn, and more.
    
*   **Review and Editing:** Review and customize the generated content to align with your brand voice and messaging.
                
*   **Platform-Specific Customization:** Tailor content specifically for different social media platforms to maximize engagement.
        
*   **Secure Authentication:** Utilize Firebase for secure user authentication and management.
        
*   **Audio Generation:** Convert text into speech and generate audio files, with the ability to edit and delete these files.
    

New Features
------------

### Audio Generation and Management

*   **Text-to-Speech Conversion:** Convert text into speech and generate downloadable audio files.
    
*   **Edit Audio File Names:** Update the names of generated audio files to better organize your content.
    
*   **Delete Audio Files:** Remove unwanted audio files directly from the platform.
    
*   **Pre-Signed URLs:** Use pre-signed URLs for secure and temporary access to audio files stored in Cloudflare R2.
Pre-Signed URLs: Use pre-signed URLs for secure and temporary access to audio files stored in Cloudflare R2.

## Getting Started

![quickcontentai_landing_vid](https://github.com/user-attachments/assets/2b66a51f-9af3-42db-b836-6afca2ca315f)

![Dashboard](https://github.com/user-attachments/assets/e6421bab-4d8b-4763-87f0-e003779f600d)

### Prerequisites

To run this project locally, you'll need the following installed on your machine:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (for database)
- A GitHub account

### Installation

Follow these steps to set up the project on your local machine:

#### 1. Clone the Repository

```bash
git clone https://github.com/username/ai-social-media-post-generator.git
cd ai-social-media-post-generator
```

#### 2. Install Frontend Dependencies

Navigate to the frontend directory and install the required dependencies:

```bash
cd frontend
npm install
```

#### 3. Install Backend Dependencies

Navigate to the backend directory and install the required dependencies:

```bash
cd ../backend
npm install
```

### Running the Project Locally

#### 1. Start the Backend Server

Ensure MongoDB is running on your local machine. Then, start the backend server:

```bash
cd backend
npm run dev
```

#### 2. Start the Frontend Development Server

In a new terminal window, start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend server should start on [http://localhost:3000](http://localhost:3000), and the backend server should be accessible on [http://localhost:8000](http://localhost:8000) by default.

## Usage

1. **Sign Up or Log In:** Start by creating an account or logging in with your existing credentials.
2. **Create a New Campaign:** Organize your content creation efforts by setting up a new campaign.
3. **Add Topics to Your Campaign:** Within your campaign, create topics to focus on specific themes or messages.
4. **Content Creation:**
   - **Select Platforms:** Choose the social media platforms you want to target for each topic.
   - **Upload Media:** Upload images, videos, or other media assets to enhance your posts.
   - **AI Content Generation:** Let the AI generate engaging content tailored to your selected platforms and topics.
   - **Text-to-Audio Conversion:** Use AI to convert text into audio content, adding another layer of engagement to your posts.
5. **Review, Edit, Delete:** Customize the AI-generated content to align with your brand's voice and messaging.


## Project Link

- [AI Social Media Post Generator](https://www.quickcontentai.com) 

## Contributing

If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vercel](https://vercel.com)
- [OpenAI](https://openai.com)
