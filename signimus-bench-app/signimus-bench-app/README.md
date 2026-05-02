# signimus-bench-app

This is a Next.js application.

## Features

### Job Posting
- Users can post new job opportunities through the job posting form
- All job postings are stored in the Supabase database
- Users can view all job postings in a list format
- Users can click on individual job postings to see detailed information

### Bench List Management
- Users can view all bench resources in a table format
- Users can upload bench resources manually through a form
- Users can upload bench resources in bulk via CSV file
- A CSV template is provided for easy bulk uploading

### Authentication
- User registration and login functionality
- Protected routes for authenticated users only

## Key Pages

- `/tools/job-posting` - Post a new job
- `/job-postings` - View all job postings
- `/bench-list` - View all bench resources
- `/bench-list-upload` - Upload bench resources

## API Endpoints

- `POST /api/job-posting` - Create a new job posting
- `GET /api/job-postings` - Get all job postings
- `GET /api/job-postings/[id]` - Get a specific job posting
- `POST /api/bench-list/upload` - Upload bench resources
- `GET /api/bench-list` - Get all bench resources