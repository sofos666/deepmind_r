# DeepMind - Image-based Mood Analyzer

This project is a web application that allows you to upload an image representing your current mood. It uses Google Gemini's artificial intelligence to analyze the image and provide a brief psychological reflection.

## How It Works

1.  **Frontend (React)**: A clean and modern interface allows you to select and preview an image from your device. It supports both light and dark modes, and English/Spanish languages.
2.  **AI Analysis (Google Gemini)**: The image is sent directly to the Google Gemini API with a specific prompt to interpret its visual elements (colors, composition, metaphors) from a psychological perspective.
3.  **Result**: The application displays the interpretation generated by the AI, giving you a new perspective on your mood.

---

## Option 1: Run with Direct Connection to Gemini API (Provided Code)

The generated code is ready to use with a direct connection to the Google Gemini API.

### Requirements

*   A modern web browser.
*   A Google Gemini API key. You can get it from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Steps to Run

1.  **Configure API Key**: This project is designed to be run in an environment where environment variables are pre-configured. To run it locally easily, you can simulate this.
    *   Open the `index.html` file.
    *   Just before the closing `</body>` tag, add the following script to define the environment variable the application expects:
        ```html
        <script>
          // FOR LOCAL DEVELOPMENT ONLY! DO NOT DO THIS IN PRODUCTION.
          // Replace "YOUR_GEMINI_API_KEY" with your actual key.
          window.process = {
            env: {
              API_KEY: 'YOUR_GEMINI_API_KEY'
            }
          };
        </script>
        ```
2.  **Open the Application**: Simply open the `index.html` file in your browser. That's it! The application is completely self-contained and does not require a development server.

---

## Option 2: Integration with n8n

As you requested, here is how you can modify the flow to use n8n as a backend. This is ideal for not exposing your API key on the frontend and for building more complex workflows.

### 1. Host n8n for Free

The easiest way to get started with n8n for free is by using their cloud service.

*   **n8n Cloud**: Visit [n8n.io](https://n8n.io/) and sign up for their "Starter" plan. They offer a free tier that is sufficient for this project. They will give you a URL for your n8n instance (e.g., `https://your-name.n8n.cloud`).

### 2. Create the Workflow in n8n

In your n8n instance, create a new workflow with the following nodes:

**Node 1: Webhook (The Trigger)**
*   Create a "Webhook" node. This will be the entry point for data from your React app.
*   In the Webhook settings:
    *   **Authentication**: `None`
    *   **HTTP Method**: `POST`
    *   **Respond**: `Immediately` (so the app doesn't wait for the entire execution).
*   Copy the Test URL. You will need it for the React app.

**Node 2: Google Gemini (The Analyzer)**
*   Add a "Google Gemini" node.
*   **Authentication**: Connect your Google account or use "API Key". Paste your Gemini API key here. Now it's secure in n8n!
*   **Resource**: `Multimodal Content`
*   **Operation**: `Generate Content`
*   In the **Text** section, enter the prompt from the `translations.ts` file.
*   In the **Input Data** section, click the gear icon (Add Expression) and select: `Nodes` > `Webhook` > `Binary Data` > `data`. This tells Gemini to use the image that arrived via the webhook.

**Node 3: Webhook Response (The Response)**
*   *This step is more advanced and requires an asynchronous flow, but to get started, we will do it synchronously to make it easier.*
*   Change the **Respond** in Node 1 (Webhook) to `When last node finishes`.
*   Add a "Set" or "Respond to Webhook" node at the end.
*   In the final node, configure the body of the response to contain the Gemini text. Use an expression like: `{{ $json.text }}` referencing the output of the Gemini node.

### 3. Modify the Frontend Code (React)

Now, you need to change how the React app sends the information. You would modify `services/geminiService.ts` to call your n8n webhook URL instead of the Gemini API directly.
