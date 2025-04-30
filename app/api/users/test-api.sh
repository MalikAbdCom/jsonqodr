#!/bin/bash

# Set the base URL for the API
BASE_URL="http://localhost:3000/api/users"

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== JSONPlaceholder Clone API Testing Script ===${NC}\n"

# Function to display section headers
section() {
  echo -e "\n${YELLOW}=== $1 ===${NC}"
}

# Function to make API requests and format the output
request() {
  local method=$1
  local url=$2
  local data=$3
  
  echo -e "${GREEN}> $method $url${NC}"
  if [ -n "$data" ]; then
    echo -e "${GREEN}> Request Body: $data${NC}"
    response=$(curl -s -X "$method" -H "Content-Type: application/json" -d "$data" "$url")
  else
    response=$(curl -s -X "$method" "$url")
  fi
  
  # Format the JSON response
  echo -e "${BLUE}> Response:${NC}"
  echo "$response" | jq . || echo "$response"
  echo ""
}

# 1. GET all users
section "GET All Users"
request "GET" "$BASE_URL"

# 2. GET all users with limit
section "GET Users with Limit"
request "GET" "$BASE_URL?_limit=2"

# 3. POST - Create a new user
section "POST Create New User"
request "POST" "$BASE_URL" '{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "1-770-736-8031",
  "website": "johndoe.com",
  "street": "123 Main St",
  "city": "New York",
  "zipcode": "10001",
  "companyName": "Acme Inc"
}'

# Store the ID of the newly created user for further operations
NEW_USER_ID=$(echo "$response" | jq '.id')

if [ -z "$NEW_USER_ID" ] || [ "$NEW_USER_ID" = "null" ]; then
  echo -e "${RED}Failed to get ID of the new user. Using ID 1 for further tests.${NC}"
  NEW_USER_ID=1
fi

# 4. GET - Retrieve a specific user
section "GET User by ID"
request "GET" "$BASE_URL/$NEW_USER_ID"

# 5. PUT - Update a user (full update)
section "PUT Update User"
request "PUT" "$BASE_URL/$NEW_USER_ID" '{
  "name": "John Updated",
  "username": "johnupdated",
  "email": "john.updated@example.com",
  "phone": "1-770-736-8032",
  "website": "johnupdated.com",
  "street": "456 Updated St",
  "city": "Boston",
  "zipcode": "02101",
  "companyName": "Updated Inc"
}'

# 6. PATCH - Partially update a user
section "PATCH Partially Update User"
request "PATCH" "$BASE_URL/$NEW_USER_ID" '{
  "name": "John Patched",
  "website": "johnpatched.com"
}'

# 7. DELETE - Delete a user
section "DELETE User"
request "DELETE" "$BASE_URL/$NEW_USER_ID"

# 8. Verify deletion
section "Verify Deletion"
request "GET" "$BASE_URL/$NEW_USER_ID"

echo -e "${BLUE}=== API Testing Completed ===${NC}"
