# Use Node.js as the base image
#FROM node:18
FROM node:latest

# Set working directory
WORKDIR /app


#COPY package.json
COPY ./package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Expose the necessary port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
