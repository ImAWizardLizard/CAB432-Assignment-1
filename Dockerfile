FROM node:dubnium

# Copy app source   
COPY . /src

# Set the work directory to /src
WORKDIR /src

# Install the dependencies
RUN npm install

# Set environment variable port to 80
ENV PORT=80

# Expose the applicatoin to the outside world
EXPOSE 80

# Start command as per package.json
CMD ["npm", "start"]
