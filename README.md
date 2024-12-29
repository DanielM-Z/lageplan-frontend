# To start frontend

npm run dev

# Site can be reached with

http://localhost:5173/

# Helper for docker

docker build -t frontend .
docker run -p 5173:3000 --name fc frontend

# Run this to access the backend while testing

$env:VITE_API_BASE_URL = "https://lageplan-backend-829485537619.europe-west3.run.app"
npm run dev
