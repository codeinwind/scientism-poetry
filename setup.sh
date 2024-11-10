#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Scientism Poetry project...${NC}\n"

# Create environment files
echo -e "${BLUE}Creating environment files...${NC}"

# Backend .env
if [ ! -f "./backend/.env" ]; then
    cp ./backend/.env.example ./backend/.env
    echo -e "${GREEN}Created backend/.env${NC}"
else
    echo -e "${GREEN}backend/.env already exists${NC}"
fi

# Frontend .env
if [ ! -f "./frontend/.env" ]; then
    cp ./frontend/.env.example ./frontend/.env
    echo -e "${GREEN}Created frontend/.env${NC}"
else
    echo -e "${GREEN}frontend/.env already exists${NC}"
fi

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"

# Root dependencies
echo -e "\n${BLUE}Installing root dependencies...${NC}"
npm install

# Backend dependencies
echo -e "\n${BLUE}Installing backend dependencies...${NC}"
cd backend && npm install
cd ..

# Frontend dependencies
echo -e "\n${BLUE}Installing frontend dependencies...${NC}"
cd frontend && npm install
cd ..

echo -e "\n${GREEN}Setup completed successfully!${NC}"
echo -e "\nTo start the development servers:"
echo -e "1. Make sure MongoDB is running"
echo -e "2. Run ${BLUE}npm run dev${NC} in the root directory"
echo -e "\nThe application will be available at:"
echo -e "- Frontend: http://localhost:3000"
echo -e "- Backend: http://localhost:5000"
