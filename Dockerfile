# The docker file is divided into two parts
# because in production you dont need a lot of 
# files of the build step.
# To make the production image slimmer only the 
# necessary compiled files are copied.

# Create the build image
FROM node:lts-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build && ls /app/build  

# Create the production image
FROM node:lts-alpine AS production
COPY --from=build /app/build .
COPY --from=build /app/package.json . 
COPY --from=build /app/package-lock.json . 
