# SkillSync API Documentation

## Courses

### Get All Courses

- **URL**: `/api/courses`
- **Method**: `GET`
- **Description**: Retrieves a list of all available courses.
- **Response**: Array of course objects

### Get Course by ID

- **URL**: `/api/courses/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific course.
- **Parameters**: 
  - `id`: Course ID
- **Response**: Course object

### Create Course

- **URL**: `/api/courses`
- **Method**: `POST`
- **Description**: Creates a new course.
- **Body**: Course object
- **Response**: Created course object

## Collaboration

### Join Project

- **URL**: `/api/collaboration/join`
- **Method**: `POST`
- **Description**: Joins a collaborative project.
- **Body**: 
  - `projectId`: string
  - `userId`: string
- **Response**: Success message

### Leave Project

- **URL**: `/api/collaboration/leave`
- **Method**: `POST`
- **Description**: Leaves a collaborative project.
- **Body**: 
  - `projectId`: string
  - `userId`: string
- **Response**: Success message

### Send Update

- **URL**: `/api/collaboration/update`
- **Method**: `POST`
- **Description**: Sends an update to a collaborative project.
- **Body**: 
  - `projectId`: string
  - `userId`: string
  - `update`: object
- **Response**: Success message

## Mentorship

### Get Mentors

- **URL**: `/api/mentorship/mentors`
- **Method**: `GET`
- **Description**: Retrieves a list of available mentors.
- **Response**: Array of mentor objects

### Request Mentor

- **URL**: `/api/mentorship/request`
- **Method**: `POST`
- **Description**: Sends a mentorship request.
- **Body**: 
  - `mentorId`: string
- **Response**: Success message

### Get Mentorship Requests

- **URL**: `/api/mentorship/requests`
- **Method**: `GET`
- **Description**: Retrieves mentorship requests for a mentor.
- **Response**: Array of mentorship request objects

### Accept Mentorship Request

- **URL**: `/api/mentorship/accept`
- **Method**: `POST`
- **Description**: Accepts a mentorship request.
- **Body**: 
  - `requestId`: string
- **Response**: Success message

... (continue documenting other endpoints)