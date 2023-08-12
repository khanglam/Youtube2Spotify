# Use the official Python image as the base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the container's working directory
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Expose the port that your Flask app will run on
EXPOSE 5000

# Run the Flask app
CMD ["python", "./run.py"]
