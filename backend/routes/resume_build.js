const express = require('express');
const router = express.Router();

function generateResumeHTML(data) {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f4f4f4;
            color: #333;
          }

          .resume-container {
            background: #fff;
            padding: 30px;
            max-width: 900px;
            margin: auto;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }

          h1 {
            font-size: 2em;
            margin-bottom: 5px;
          }

          .contact {
            margin-bottom: 20px;
          }

          .summary {
            margin-bottom: 30px;
          }

          .section {
            margin-bottom: 30px;
          }

          .section h2 {
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 15px;
            font-size: 1.2em;
            color: #444;
          }

          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          ul {
            list-style-type: none;
            padding: 0;
          }

          li {
            margin-bottom: 10px;
          }

          .skills {
            background: #efefef;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          <h1>${data.name}</h1>
          <div class="contact">
            <strong>Email:</strong> ${data.email} | <strong>Phone:</strong> ${data.phone}
          </div>

          <div class="summary">
            <h2>Summary</h2>
            <p>${data.summary || 'N/A'}</p>
          </div>

          <div class="grid-2">
            <div class="section">
              <h2>Education</h2>
              <ul>
                ${data.education.map(e => `
                  <li>${e.degree} at ${e.institute} (${e.year})</li>
                `).join('')}
              </ul>
            </div>

            <div class="section">
              <h2>Experience</h2>
              <ul>
                ${data.experience.map(exp => `
                  <li>${exp.job} at ${exp.company} (${exp.duration})</li>
                `).join('')}
              </ul>
            </div>
          </div>

          <div class="grid-2">
            <div class="section">
              <h2>Achievements</h2>
              <ul>
                ${data.achivements.map(a => `
                  <li><strong>Project:</strong> ${a.project}<br>
                      <strong>Certification:</strong> ${a.certification}</li>
                `).join('')}
              </ul>
            </div>

            <div class="section">
              <h2>Skills</h2>
              <p class="skills">${data.skills}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

router.post('/resume-build', (req, res) => {
  const html = generateResumeHTML(req.body);
  res.send(html);
});

module.exports = router;
