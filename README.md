# UNM-SQA-2024-25

A web application that displays a selection of YouTube videos related to AI tools and technologies that support software engineers in developing software faster and more reliably.

# Project Setup

## Frontend

Remember to change your directory to the /frontend directory first:

```bash
cd frontend
```

### 1. Install React dependencies:

```bash
npm install
```

### 2. Run the development build:

```bash
npm start
```

- Build will launch on http://localhost:3000

## Backend

Remember to change your directory to the /backend directory first:

```bash
cd backend
```

### 1. Create the Virtual Environment for Python 3.12.0:

Windows:

```bash
py -3.12 -m venv .venv
```

Mac:

```bash
python3.12 -m venv .venv
```

### 2. Activate the virtual environment:

Windows:

```bash
.\.venv\Scripts\Activate
```

Mac:

```bash
source .venv/bin/activate
```

---

To deactivate the virtual environment (if needed)

```bash
deactivate
```

### 3. Install python packages:

To install the required packages for this project, run the following command:

```bash
pip install -r requirements.txt
```

### 4. Create a .env file for YouTube API Key in the /backend directory:

Paste the following code into your .env file, replacing "YOUR_API_KEY" with the string of the actual api key:

```bash
YOUTUBE_API_KEY = "YOUR_API_KEY"
```

### 5. Run FastAPI backend

To start the FastAPI server, run the following command in your terminal:

```bash
uvicorn main:app --reload
```

This command will:

- Launch the server at `http://127.0.0.1:8000`.
- Enable **hot reloading**, so the server will restart automatically when you make changes to your code.

## Testing

### 1. Downloading Test Dependencies

Make sure that you are in the root directory `/UNM-SQA-2024-25`, then run the following command:

```bash
npm install
```

### 2. Run the Tests

Run the test cases by running the following command:

```bash
npm test
```

# Team Members

1. Nigel Seah Jun Yang (20514951)
2. Mohamed Armaan Farhan (20492238)
3. Chan Yan Chang (20512136)
