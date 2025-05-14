// routes/auto_generate_resume.js
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyA0dr6dPz2Na5qTpnYy0GjydUzBOk8C5KA");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/auto-generate", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      experience = [],
      skills,
      achievements = [],
      education = [],
    } = req.body;

    // Ensure that experience, education, and achievements are arrays before calling .map()
    const experienceText =
      experience && experience.length > 0
        ? experience
            .map((e) => `${e.job} at ${e.company} (${e.duration})`)
            .join(", ")
        : "No experience provided";

    const educationText =
      education && education.length > 0
        ? education
            .map((e) => `${e.degree} at ${e.institute} (${e.year})`)
            .join(", ")
        : "No education provided";

    const achievementsText =
      achievements && achievements.length > 0
        ? achievements.map((a) => `${a.project}, ${a.certification}`).join(", ")
        : "No achievements provided";

    // Create prompt to send to Gemini
    const prompt = `
      Given the following resume data:
      Name: ${name}
      Experience: ${experienceText}
      Education: ${educationText}
      Skills: ${skills}
      Achievements: ${achievementsText}

      Provide the following in this format exactly:
        Summary: <Write a professional resume summary in 3-4 sentences>

        Skills to Learn: <comma-separated list of 3 skills>

        Job Roles: <comma-separated list of 3 job roles>
    `;

    // Send the prompt to Gemini
    const result = await model.generateContent(prompt);

    // Ensure response is in the correct format
    const responseText = result.response.text().trim();

    const summaryMatch = responseText.match(
      /Summary:\s*([\s\S]*?)\n(?:Skills to Learn:|$)/i
    );
    const skillsMatch = responseText.match(
      /Skills to Learn:\s*([\s\S]*?)\n(?:Job Roles:|$)/i
    );
    const jobsMatch = responseText.match(/Job Roles:\s*([\s\S]*)/i);

    const summary = summaryMatch?.[1]?.trim() || "No summary generated.";
    const skillsToLearn = skillsMatch?.[1]?.trim() || "No skills suggested.";
    const jobs = jobsMatch?.[1]?.trim() || "No job roles suggested.";

    // Send json as response
    res.json({
      name,
      email,
      phone,
      summary,
      skills: skills,
      education,
      experience,
      achievements,
      skillsToLearn,
      jobRoles: jobs,
    });
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ message: "Failed to generate resume" });
  }
});

module.exports = router;
