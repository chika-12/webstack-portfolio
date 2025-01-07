Blog Post Management System
Description
This is a Blog Post Management System built with Node.js, Express, EJS, and In-Memory Database. It allows users to create, edit, delete, view blog posts, and login to access the functionality. This project aims to showcase how to build a simple CRUD (Create, Read, Update, Delete) application with user authentication.

Features
User Authentication: Allows only authenticated users to create, edit, delete, or view blog posts.
Create Post: Users can create new blog posts by providing a title, content, and author.
Edit Post: Users can edit existing posts by updating their title, content, or author.
Delete Post: Users can delete a blog post.
View Post: Users can view a detailed page for each post.
Login: Secure login with session management.
Technologies Used
Backend: Node.js, Express.js
Frontend: EJS (Embedded JavaScript)
Database: In-memory (posts are stored in the server’s memory)
Authentication: Express-session for managing user sessions
Project Setup
Prerequisites
Before running the project, ensure that you have Node.js and npm installed on your local machine.

You can check if you have Node.js installed by running:

bash
Copy code
node -v
npm -v
If you don’t have Node.js, you can download it from here.

Getting Started
Clone the repository:
bash
Copy code
git clone https://github.com/yourusername/blog-post-management.git
Navigate to the project directory:
bash
Copy code
cd blog-post-management
Install the required dependencies:
bash
Copy code
npm install
Start the server:
bash
Copy code
npm start
The app will be running on http://localhost:4000 for the backend and http://localhost:3000 for the frontend.

Running in Development Mode
To run the project in development mode with automatic reloading, use the following command:

bash
Copy code
npm run dev
API Endpoints
Authentication
POST /login: Logs in the user with the provided username and password.
GET /logout: Logs out the user.
Posts
GET /api/posts: Returns all blog posts.
GET /api/posts/:id: Returns a specific blog post by its ID.
POST /api/posts: Creates a new blog post.
PATCH /api/posts/:id: Updates an existing blog post by ID.
DELETE /api/posts/:id: Deletes a specific blog post by ID.
Views (Frontend)
GET /: Displays all blog posts in a list.
GET /posts/:id: Displays the full content of a specific blog post.
GET /new: Displays the form to create a new blog post.
GET /edit/:id: Displays the form to edit an existing blog post.
File Structure
php
Copy code
├── public/                # Static assets like CSS and JS
├── views/                 # EJS templates for rendering HTML
│   ├── editPost.ejs       # Edit post form
│   ├── login.ejs          # Login page
│   ├── modify.ejs         # Form for creating/editing posts
│   ├── posts.ejs          # Posts list view
│   ├── viewPost.ejs       # View specific post
├── server.js              # Frontend server (for rendering views)
├── index.js               # Backend server (API and logic)
├── package.json           # Project dependencies and metadata
└── README.md              # Project documentation (this file)
Contributing
If you'd like to contribute to this project, feel free to open an issue or submit a pull request. Here are some ways you can contribute:

Report bugs or suggest features
Submit pull requests with bug fixes, documentation improvements, or new features
Review and test pull requests
License
This project is licensed under the MIT License - see the LICENSE file for details.

Notes:
Customization: This README is a template and can be adjusted based on any further specific requirements you may have for the project.
Deployment: You can add additional sections if you deploy the app on platforms like Heroku, DigitalOcean, or any other cloud service, along with the deployment instructions.
This should provide a detailed, easy-to-understand README for your blog post management system project.
