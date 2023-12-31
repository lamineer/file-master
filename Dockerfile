# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

FROM node:latest

WORKDIR /usr/src/app

COPY ./backend /usr/src/app/

WORKDIR /usr/src/app/backend

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
#RUN --mount=type=bind,source=package.json,target=package.json \
#    --mount=type=bind,source=package-lock.json,target=package-lock.json \
#    --mount=type=cache,target=/root/.npm \
#    npm ci --omit=dev

RUN npm install

#RUN chown -R node:node /usr/src/app/backend
#RUN chmod -R 755 /usr/src/app/backend
# Run the application as a non-root user.
#USER node

EXPOSE 80

# Run the application.
CMD [ "npm", "start" ]
