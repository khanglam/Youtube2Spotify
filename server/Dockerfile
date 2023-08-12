# Use the official Python image as the base image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the container's working directory
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Expose the port that your Flask app will run on
ENV PORT=5000
EXPOSE $PORT

# Run the Flask app
CMD ["python", "./run.py"]
