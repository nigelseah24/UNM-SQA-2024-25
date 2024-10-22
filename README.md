# UNM-SQA-2024-25

A web application that displays a selection of YouTube videos related to AI tools and technologies that support software engineers in developing software faster and more reliably.

# Project Setup

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

### 4. Run FastAPI backend

To start the FastAPI server, run the following command in your terminal:

```bash
uvicorn main:app --reload
```

This command will:

- Launch the server at `http://127.0.0.1:8000`.
- Enable **hot reloading**, so the server will restart automatically when you make changes to your code.

### 5. Download Postman to Test the API (For testing only)

You can use [Postman](https://www.postman.com/downloads/) to easily test the API endpoints.

1. Download and install Postman.
2. Create a new request in Postman, choose the appropriate HTTP method (e.g., `POST`), and enter your API endpoint URL.
3. Provide the necessary input data (e.g., JSON payload that you can find in spellingCheckerSample.txt) and hit **Send**.
4. Review the API response directly within Postman.

Alternatively, you can use FastAPI's built-in interactive docs at `http://127.0.0.1:8000/docs` to explore and test the API.
