# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy production build
COPY dist/ .

# Install production dependencies
RUN npm install --only=production

# Expose port
EXPOSE 5001

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S hackgen -u 1001
USER hackgen

# Start the application
CMD ["npm", "start"]