# multi-rajztabla

Multi_rajztabla is a real-time, multiplayer online whiteboard application that allows users to collaborate on a shared digital canvas.

## Technologies Used

- **Runtime Environment:**
  - Node.js

- **Backend:**
  - Express.js: Web application framework for Node.js
  - Socket.IO: For real-time, bidirectional communication

- **Database:**
  - MongoDB: NoSQL database for storing application data
  - Mongoose: MongoDB object modeling for Node.js

- **Security:**
  - bcrypt: For password hashing

- **Development Tools:**
  - nodemon: For automatic server restarts during development

## Installation

1. Ensure you have Node.js installed on your system.

2. Clone the repository: git clone https://github.com/qla0000/multi-rajztabla.git


3. Navigate to the project directory in terminal.

4. Install dependencies: npm install (in terminal)
    - bcrypt
    - express
    - mongodb
    - mongoose
    - socket.io
    - nodemon

5. You need the change the ip address in the server.js file (location: ../multi_rajztabla/srver.js:68-69) to host the server.

## Features

- Real-time collaborative whiteboard
- User authentication
- Persistent data storage with MongoDB

## Contributing

If you'd like to contribute to the project, please open a new issue or submit a pull request. :)
