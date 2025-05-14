// core modules
const express = require("express");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
//local files
const db = require("../database/db");
const upload_router = require("./upload_routes");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.Gemini_api_key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const router = express.Router();

router.post("/analyze-resume", async (req, res) => {
  const query = "SELECT * FROM RESUME ORDER BY ID DESC LIMIT 1";
  db.query(query, async (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (result.length === 0)
      return res.status(400).json({ message: "No resume found" });

    try {
      const filepath = result[0].FILEPATH;
      const databuffer = fs.readFileSync(path.resolve(filepath));
      const data = await pdfParse(databuffer);
      const resumeText = data.text;

      // const { resumeText } = req.body;
      const prompt = `
You are an AI resume evaluator trained to simulate an ATS (Applicant Tracking System) scoring mechanism.

Analyze this resume based on the following categories and score each out of 10. Also give a short comment for each:

1. **Keyword Relevance** — Check for the presence of the following:
   - **Soft Skills**: communication, leadership, teamwork, adaptability, creativity, problem solving, time management, attention to detail, critical thinking, interpersonal skills, collaboration, self-motivated
   - **Technical Skills**: python, java, javascript, html, css, sql, mysql, mongodb, react, node.js, angular, c++, data structures, algorithms, machine learning, data analysis, artificial intelligence, git, github, docker, aws, cloud computing, api development
   - **Tools & Platforms**: excel, ms office, git & github, powerpoint, word, tableau, power bi, google workspace, vscode, intellij, eclipse, jira, trello, asana, slack, confluence
   - **Education & Certifications**: b.tech, bsc, m.tech, msc, mba, diploma, coursera, udemy, edx, certification, aws certified, pmp, google certified, microsoft certified, data camp
   - **Achievements & Action Verbs**: increased, improved, reduced, achieved, managed, delivered, designed, developed, implemented, optimized, created, led, launched

2. **Grammar & Spelling**

3. **Section Completeness** — Ensure it has: Contact Info, Summary, Skills, Experience, Education, Certifications (if any)

4. **Use of Metrics & Action-Oriented Language** — Are accomplishments quantified (e.g., “increased revenue by 20%”)?

5. **Formatting & Readability** — Check layout simplicity, section order, font usage, and ATS-friendliness

6. **Experience Relevance** — Are job titles and duties relevant to technical roles?

Resume:
${resumeText}

Return the result in this JSON structure:
{
  keyword_relevance: { score: X, comment: "..." },
  grammar_spelling: { score: X, comment: "..." },
  section_completeness: { score: X, comment: "..." },
  metrics_usage: { score: X, comment: "..." },
  formatting: { score: X, comment: "..." },
  experience_relevance: { score: X, comment: "..." }
}

`;
      const geminiResult = await model.generateContent(prompt);
      const rawtext = geminiResult.response.text();
      //console.log("Raw Gemini response:", rawtext); no need because it works

      // Clean the raw response by removing the markdown code block (```json)
      const cleanText = rawtext
         .replace(/```json|```/g, '')               // remove backticks
         .replace(/^Raw Gemini response:\s*/i, '')  // remove the intro
        .replace(/```json\s*/, '') // Remove the opening ```json
        .replace(/```$/, '') // Remove the ending ```
        .replace(/^\s+|\s+$/g, '')    // Remove leading and trailing whitespaces
        .trim(); // Trim any leading or trailing spaces

       // console.log("Cleaned Gemini response:", cleanText);  no need because it works

      try {
        const analysis = JSON.parse(cleanText);

        // Calculate overall score (average of category scores)
      const overallScore = (
          (analysis.keyword_relevance.score +
          analysis.grammar_spelling.score +
          analysis.section_completeness.score +
          analysis.metrics_usage.score +
          analysis.formatting.score +
          analysis.experience_relevance.score) /6
          ).toFixed(2); // rounding to two decimal places

        res.status(200).json(
          {overallScore,
            analysis,
      });
      console.log("succesfully analyzed");
      } catch (parseError) {
        console.error("failed to parse Gemini JSON:", parseError);

        res.status(500).json({
          message: "Gemini returned invalid JSON",
          raw: rawtext,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error analyzing resume" });
    }
  });
});
module.exports = router;
