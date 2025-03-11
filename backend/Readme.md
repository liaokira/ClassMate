# Running the Backend

Within the `backend` folder, run `docker compose up --build`

To initialize/reset the contents of the database, run `sh init_db.sh`

The application will be available at http://localhost:3010.

# ClassMate Backend API Documentation

## Overview
This document describes the available endpoints in the ClassMate Backend API, including their input parameters, response formats, and functionality.

## Base URL
```
http://localhost:3010/v0
```

## Authentication
Some endpoints require authentication using a Bearer Token (JWT).

---

## Endpoints

### User Authentication

#### `POST /register`
**Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string"
  }
  ```
- **Responses:**
  - `201`: Successful registration, returns user data.
    ```json
    {
      "name": "string",
      "accessToken": "string"
    }
    ```
  - `400`: User already exists.

#### `POST /login`
**Description:** Logs in a user and returns an authentication token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - `200`: Successful login, returns user data.
    ```json
    {
      "name": "string",
      "accessToken": "string"
    }
    ```
  - `401`: Invalid credentials.

---

### Study Groups

#### `GET /group`
**Description:** Retrieves all available study groups.
- **Authentication Required:** Yes
- **Responses:**
  - `200`: Returns an array of study groups.
    ```json
    [
      {
        "group_name": "string",
        "group_description": "string",
        "color": "string",
        "associated_class": "string"
      }
    ]
    ```

#### `POST /group`
**Description:** Creates a new study group.
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  {
    "group_name": "string",
    "group_description": "string",
    "color": "string",
    "associated_class": "string"
  }
  ```
- **Responses:**
  - `201`: Study group created.
    ```json
    {
      "id": "uuid"
    }
    ```
  - `400`: Invalid request data.

#### `GET /group/discovery`
**Description:** Retrieves all groups the user is not a member of.
- **Authentication Required:** Yes
- **Responses:**
  - `200`: Returns an array of available study groups.
    ```json
    [
      {
        "group_name": "string",
        "group_description": "string",
        "color": "string",
        "associated_class": "string"
      }
    ]
    ```

#### `GET /group/{id}`
**Description:** Retrieves information about a specific study group by ID.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the study group.
- **Responses:**
  - `200`: Returns study group details.
    ```json
    {
      "id": "uuid",
      "group_name": "string",
      "color": "string",
      "associated_class": "string",
      "members": [
        {
          "id": "uuid",
          "name": "string"
        }
      ]
    }
    ```
  - `404`: Study group not found.

#### `PUT /group/{id}`
**Description:** Updates the information of a study group given an ID.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the study group.
- **Request Body:**
  ```json
  {
    "group_name": "string",
    "group_description": "string",
    "color": "string",
    "associated_class": "string"
  }
  ```
- **Responses:**
  - `200`: Study group successfully updated.
  - `404`: Study group not found.

#### `POST /group/{id}/join`
**Description:** Joins a study group.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the study group.
- **Request Body:**
  ```json
  {
    "member_id": "uuid"
  }
  ```
- **Responses:**
  - `200`: Successfully joined the study group.
  - `400`: User is already a member.
  - `404`: Group not found.

#### `DELETE /group/{id}/leave`
**Description:** Leaves a study group.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the study group.
- **Request Body:**
  ```json
  {
    "member_id": "uuid"
  }
  ```
- **Responses:**
  - `200`: Successfully left the study group.
  - `400`: User is not a member.
  - `404`: Group not found.

#### `GET /group/{groupId}/membership/{userId}`
**Description:** Checks if a user is a member of a study group.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `groupId`: UUID of the study group.
  - `userId`: UUID of the user.
- **Responses:**
  - `200`: Membership check result.
    ```json
    {
      "member": true
    }
    ```
  - `404`: User or group not found.

#### `GET /group/search`
**Description:** Searches for study groups by name.
- **Authentication Required:** Yes
- **Query Parameters:**
  - `searchFor`: String keyword to search.
- **Responses:**
  - `200`: List of matching study groups.
    ```json
    [
      {
        "group_name": "string",
        "group_description": "string",
        "color": "string",
        "associated_class": "string"
      }
    ]
    ```
  - `404`: No study groups found.

#### `GET /group/{id}/image`
**Description:** Retrieves the image associated with a study group.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the study group.
- **Responses:**
  - `200`: Returns image data.
    ```json
    {
      "image": "binary"
    }
    ```
  - `404`: Image not found.

#### `PUT /group/{id}/image`
**Description:** Uploads a new image for a study group.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the study group.
- **Request Body:**
  ```json
  {
    "image": "binary"
  }
  ```
- **Responses:**
  - `200`: Image uploaded successfully.
  - `404`: Group not found.

#### `GET /group/{id}/messages`
**Description:** Retrieves messages from a study group.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the study group.
- **Responses:**
  - `200`: Returns an array of messages.
    ```json
    [
      {
        "sender_id": "uuid",
        "sender_name": "string",
        "group_id": "uuid",
        "message": "string",
        "timestamp": "string"
      }
    ]
    ```
  - `404`: Group not found.

### User Profiles

#### `GET /profile/{id}`
**Description:** Retrieves a user's profile by ID.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the user.
- **Responses:**
  - `200`: Returns user profile details.
    ```json
    {
      "id": "uuid",
      "bio": "string",
      "full_name": "string"
    }
    ```
  - `404`: User not found.

#### `PUT /profile/{id}`
**Description:** Updates a user's profile.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the user.
- **Request Body:**
  ```json
  {
    "bio": "string",
    "full_name": "string"
  }
  ```
- **Responses:**
  - `200`: Profile updated.
  - `201`: Profile created.
  - `404`: User not found.

#### `GET /profile/{id}/image`
**Description:** Retrieves the profile image of a user.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the user.
- **Responses:**
  - `200`: Returns image data.
    ```json
    {
      "image": "binary"
    }
    ```
  - `404`: Image not found.

#### `PUT /profile/{id}/image`
**Description:** Uploads a new profile image for a user.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the user.
- **Request Body:**
  ```json
  {
    "image": "binary"
  }
  ```
- **Responses:**
  - `200`: Image uploaded successfully.
  - `404`: User not found.

#### `GET /profile/{id}/groups`
**Description:** Retrieves all study groups a user is in.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the user.
- **Responses:**
  - `200`: List of study groups.
    ```json
    [
      {
        "group_name": "string",
        "group_description": "string",
        "color": "string",
        "associated_class": "string"
      }
    ]
    ```
  - `404`: User not found.

#### `GET /profile/{id}/classes`
**Description:** Retrieves all classes a user is enrolled in.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the user.
- **Responses:**
  - `200`: List of classes.
    ```json
    [
      {
        "id": "uuid",
        "class_name": "string",
        "start_time": 0,
        "end_time": 1440
      }
    ]
    ```
  - `404`: User not found.

### Classes

#### `DELETE /profile/{id}/classes/{classId}`
**Description:** Removes a class from a user's profile.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the user.
  - `classId`: UUID of the class to remove.
- **Responses:**
  - `200`: Class removed successfully.
    ```json
    {
      "message": "Class removed successfully"
    }
    ```
  - `404`: Class not found for the user.

#### `GET /classes`
**Description:** Retrieves a list of all classes stored in the database.
- **Authentication Required:** Yes
- **Responses:**
  - `200`: Returns an array of classes.
    ```json
    [
      {
        "id": "uuid",
        "class_name": "string"
      }
    ]
    ```
  - `404`: No classes found.

---

### Messages

#### `GET /users/{id}/{recipientId}/messages`
**Description:** Retrieves messages exchanged between two users.
- **Authentication Required:** Yes
- **Path Parameters:**
  - `id`: UUID of the sender.
  - `recipientId`: UUID of the recipient.
- **Responses:**
  - `200`: Returns an array of messages.
    ```json
    [
      {
        "sender_id": "uuid",
        "sender_name": "string",
        "recipient_id": "uuid",
        "message": "string",
        "timestamp": "string"
      }
    ]
    ```
  - `404`: Messages not found.

---

### Friend Management

#### `GET /users/searchFriend`
**Description:** Checks if a user is friends with another user.
- **Authentication Required:** Yes
- **Query Parameters:**
  - `userId`: UUID of the logged-in user.
  - `email`: Email of the friend to check.
- **Responses:**
  - `200`: Users are friends.
    ```json
    {
      "id": "uuid",
      "full_name": "string",
      "email": "string"
    }
    ```
  - `404`: Users are not friends.

#### `GET /users/search`
**Description:** Searches for a user by email.
- **Authentication Required:** Yes
- **Query Parameters:**
  - `email`: Email of the user to search for.
- **Responses:**
  - `200`: User found.
    ```json
    {
      "user": {
        "id": "uuid",
        "full_name": "string",
        "email": "string"
      }
    }
    ```
  - `404`: User not found.

#### `PUT /users/addFriend`
**Description:** Adds a user as a friend.
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  {
    "userId": "uuid",
    "id": "uuid",
    "full_name": "string",
    "email": "string"
  }
  ```
- **Responses:**
  - `201`: Friend added successfully.
    ```json
    {
      "message": "Friend added"
    }
    ```
  - `409`: Already friends.

#### `GET /users/getFriends`
**Description:** Retrieves a list of a user’s friends.
- **Authentication Required:** Yes
- **Query Parameters:**
  - `userId`: UUID of the logged-in user.
- **Responses:**
  - `200`: List of friends.
    ```json
    {
      "friends": [
        {
          "id": "uuid",
          "full_name": "string",
          "email": "string"
        }
      ]
    }
    ```
  - `400`: Missing userId.