FROM node:21.7.3-alpine

# Update
RUN apk update

# Install yt-dlp
RUN apk add yt-dlp

# Set the working directory
WORKDIR /app

# Copy the entrypoint script
COPY . ./

# install dependencies
RUN npm install

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]