
# 🧠 AI Content Analyzer — Humanizer, Plagiarism Checker & AI Detector

Welcome to **AI Content Analyzer**, a full-stack serverless application built for the AWS Lambda Hackathon.
This application empowers users to:

- 🧠 Humanize AI-generated text, transforming robotic language into natural, human-like content.
- 📚 Check for plagiarism, highlighting repetitive or potentially copied segments.
- 🤖 Detect AI-written content, giving confidence on originality.

It’s engineered using modern cloud-native architecture on AWS, leveraging **Lambda**, **API Gateway**, and **Amazon Bedrock’s Claude 3 Sonnet model**, with a responsive React frontend.

---

## 🚀 Features

✅ **Humanize Text**  
Paste robotic or stiff content and rewrite it instantly into natural human-like language.

✅ **Detect AI Content**  
Identify whether a given text is likely AI-generated, using intelligent prompt-based analysis.

✅ **Plagiarism Check**  
Spot repeated phrases or potential copying patterns to uphold originality.

---

## 🏗️ System Architecture

![Architecture Diagram](./docs/architecture.png)

### 📝 How It Works
- **React Frontend**  
  Built with Vite and Tailwind CSS, it provides an intuitive interface for users to submit text and see real-time results.

- **Amazon API Gateway**  
  Securely exposes three POST endpoints: `/humanize`, `/detect`, `/plagiarism`, each mapped to a Lambda function.

- **AWS Lambda Functions**  
  Stateless Node.js functions handle request parsing, prompt construction, and responses from Bedrock.

- **Amazon Bedrock (Claude 3 Sonnet)**  
  The core AI engine performing rewriting, detection, and plagiarism analysis.

---

## 🛠️ Tech Stack

| Layer             | Technology                                  |
|-------------------|---------------------------------------------|
| Frontend          | React, Vite, Tailwind CSS                   |
| Backend           | Node.js on AWS Lambda                      |
| API Layer         | Amazon API Gateway                         |
| AI Engine         | Claude 3 Sonnet via Amazon Bedrock          |
| Optional Hosting  | AWS Amplify / Netlify / Vercel              |

---

## 🔗 API Endpoints

| Endpoint       | Description               | Request Payload Example  |
|----------------|---------------------------|--------------------------|
| `/humanize`    | Returns humanized content | `{ "text": "..." }`      |
| `/detect`      | Detects AI-written text   | `{ "text": "..." }`      |
| `/plagiarism`  | Checks for plagiarism     | `{ "text": "..." }`      |

All APIs expect a `POST` request with a JSON body.

---

## 🔐 AWS IAM Permissions

Each Lambda function must have an IAM role attached with at least:

```json
{
  "Effect": "Allow",
  "Action": [
    "bedrock:InvokeModel",
    "logs:*"
  ],
  "Resource": "*"
}
```

---

## 📁 Project Structure

```
/ai-content-analyzer-project
│
├── frontend/             # React application
│   ├── src/
│   └── package.json
│
├── backend/              # Lambda functions
│   ├── humanizer.js
│   ├── detector.js
│   ├── plagChecker.js
│   └── package.json
│
├── docs/                 # Documentation assets
│   ├── architecture.png
│   └── screenshots.png
│
└── README.md             # This file
```

---

## ⚡ Local Development

### 🚀 Frontend

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

### ☁️ Lambda Deployment

- Each function (`humanizer.js`, `detector.js`, `plagChecker.js`) is zipped and uploaded to AWS Lambda via Console or using frameworks like SAM / Serverless.
- Connect each to its respective POST method in API Gateway.

---

## 🎥 Demo Video

[![Watch the Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

> 📝 Replace `YOUR_VIDEO_ID` with your actual YouTube ID.

---

## 🚀 Why AWS? (Hackathon Pitch)

✅ **Serverless Efficiency**  
No infrastructure to manage. AWS Lambda scales on demand with virtually zero maintenance.

✅ **Security & Scalability**  
API Gateway ensures secure HTTP interfaces with throttling, while Lambda + Bedrock effortlessly scale.

✅ **State-of-the-Art AI**  
Amazon Bedrock gives direct, fully managed access to Claude 3 Sonnet, offering superior NLP tasks without hosting your own models.

---

## 🌱 Future Enhancements

- Integrate **AWS Cognito** for user authentication.
- Store history and analysis logs in **Amazon DynamoDB**.
- Expand to accept PDF or DOC files and summarize them before analysis.
- Automate Lambda deployment using **AWS CDK** for full infrastructure-as-code.

---

## 👨‍💻 Developed By

**Your Name**  
- GitHub: [https://github.com/yourusername](https://github.com/yourusername)  
- LinkedIn: [https://linkedin.com/in/yourlinkedin](https://linkedin.com/in/yourlinkedin)

---

## 📜 License

Distributed under the MIT License. Feel free to use, adapt, and share!
