# Health Information System

A comprehensive health management platform built with Next.js and Supabase for managing clients, health programs, and enrollments.

## Live Demo

The application is deployed and accessible at: [https://health-info-system-kauz.onrender.com](https://health-info-system-kauz.onrender.com)

## Features

- **Client Management**: Register, view, and manage client information
- **Program Management**: Create and manage health programs
- **Enrollment System**: Enroll clients in various health programs
- **Dashboard**: Overview of system statistics and quick actions
- **API Documentation**: Built-in API documentation for developers
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with sorting and filtering capabilities

## Screenshots

### Dashboard
![Dashboard](/public/dashboard%20pasge.png)
*Main dashboard with system statistics and quick access to key features*

### Clients View
![Clients View](/public/clients%20view%20page.png)
*List of clients with search and sorting capabilities*

### Client Registration
![Register Client](/public/register%20client.png)
*Form for registering new clients with validation*

### Client Details
![Client Details](/public/Client%20details.png)
*Detailed view of client information and enrolled programs*

### Programs Page
![Programs Page](/public/programs%20page.png)
*List of available health programs*

### Create Program
![Create Program](/public/create%20a%20programs.png)
*Form for creating new health programs*

### Enroll Client
![Enroll Client](/public/enroll%20clients%20to%20a%20program.png)
*Interface for enrolling clients in health programs*

### API Documentation
![API Documentation](/public/api%20documentations%20page.png)
*Built-in documentation for the system's API endpoints*

## Technology Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, Headless UI
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/health-info-system.git
cd health-info-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The system uses the following main tables:
- `clients`: Stores client information
- `programs`: Contains health program details
- `enrollments`: Manages the relationship between clients and programs

## API Endpoints

The system provides RESTful API endpoints for:
- Client management (`/api/client`)
- Program management (`/api/program`)
- Enrollment management (`/api/enrollment`)
- System statistics (`/api/stats`)

Detailed API documentation is available at `/api-docs` within the application.

## Deployment

The application is deployed on Render at [https://health-info-system-kauz.onrender.com](https://health-info-system-kauz.onrender.com).

To deploy your own instance:
1. Create a new Web Service on Render
2. Connect your repository
3. Set the build command to `npm run build`
4. Set the start command to `npm start`
5. Add the environment variables from your `.env.local` file

## Future Enhancements

- User authentication and role-based access
- Advanced reporting and analytics
- Email notifications for enrollments
- Mobile application integration
- Offline support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [Supabase](https://supabase.io) - The open source Firebase alternative
- [Headless UI](https://headlessui.dev) - Unstyled, accessible UI components
