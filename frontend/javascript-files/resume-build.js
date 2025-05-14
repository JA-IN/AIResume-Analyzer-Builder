
document.addEventListener("DOMContentLoaded", () => {
  // Form submit event
  document.getElementById("resumeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,

      education: [
        {
          degree: document.getElementById("degree").value,
          institute: document.getElementById("institution").value,
          year: document.getElementById("year").value,
        },
      ],
      experience: [
        {
          job: document.getElementById("job").value,
          company: document.getElementById("company").value,
          duration: document.getElementById("duration").value,
        },
      ],
      achievements: [
        {
          project: document.getElementById("project").value,
          certification: document.getElementById("certifications").value,
        },
      ],
      skills: document.getElementById("skills").value,
    };

    try {
      const response = await fetch("http://localhost:2000/api/resumeForm/auto-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      const resumeHTML = `
        <div class="container">
          <h1>${result.name}</h1>
          <p class="contact-info">${result.email} | ${result.phone}</p>

          <div class="section">
            <h2>Professional Summary</h2>
            <p>${result.summary}</p>
          </div>

          <div class="section">
            <h2>Skills</h2>
            <p>${result.skills}</p>
          </div>

          <div class="section">
            <h2>Education</h2>
            <ul>
              ${result.education
                .map((e) => `<li>${e.degree} at ${e.institute} (${e.year})</li>`)
                .join("")}
            </ul>
          </div>

          <div class="section">
            <h2>Experience</h2>
            <ul>
              ${result.experience
                .map((e) => `<li>${e.job} at ${e.company} (${e.duration})</li>`)
                .join("")}
            </ul>
          </div>

          <div class="section">
            <h2>Achievements</h2>
            <ul>
              ${result.achievements
                .map((a) => `<li>Project: ${a.project}, Certification: ${a.certification}</li>`)
                .join("")}
            </ul>
          </div>

          <div class="section highlight">
            <h2>AI Suggestions</h2>
            <p><strong>Skills to Learn:</strong> ${result.skillsToLearn}</p>
            <p><strong>Suggested Job Roles:</strong> ${result.jobRoles}</p>
          </div>
        </div>
      `;

      document.getElementById("resume-content").innerHTML = resumeHTML;
      document.getElementById("generated-resume-section").style.display = "block";

      // ✅ Add event listener after resume is rendered
      const downloadBtn = document.getElementById("downloadResume");
      downloadBtn.addEventListener("click", () => {
        const resumeElement = document.getElementById("resume-content");

        html2canvas(resumeElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          // const { jsPDF } = window.jspdf;
          // const pdf = new jsPDF("p", "mm", "a4");
          const pdf = new jspdf.jsPDF("p", "mm", "a4");

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("my-resume.pdf");
        });
      });

    } catch (error) {
      console.error("Error generating resume:", error);
    }
  });
});
