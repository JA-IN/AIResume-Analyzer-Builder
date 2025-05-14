if (window.location.pathname.includes("upload.html")) {
  const fileinput = document.querySelector("input[type = file");
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    if (!fileinput.files.length) {
      e.preventDefault();
      console.log("script load succesfully");
      alert("please upload your file ");
      return;
    }
    e.preventDefault();
    // create formdata object and append the file
    const formdata = new FormData();
    formdata.append("resume", fileinput.files[0]);

    //send the file to the server using fetch
    const responce = await fetch(
      "http://localhost:2000/api/upload/upload-resume",
      {
        method: "POST",
        body: formdata,
      }
    );

    //handle the server responce
    const result = await responce.json();
    alert(result.message);
  });
}

// analyse resume section

document
  .getElementById("analyse-resume-btn")
  .addEventListener("click", async () => {
    try {
      const responce = await fetch(
        "http://localhost:2000/api/resume/analyze-resume",
        {
          method: "POST",
        }
      );
      const result = await responce.json();

      //formated result
      function renderAnalysis(result) {
        let html = `<h2>Resume Score: <span style="color: green;">${result.overallScore}/10</span></h2>`;
        html += `<div class="analysis-container">`;

        for (const [key, value] of Object.entries(result.analysis)) {
          const formattedKey = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
          html += `
      <div class="analysis-card">
        <h3>${formattedKey}</h3>
        <p><strong>Score:</strong> ${value.score}/10</p>
        <p><strong>Comment:</strong> ${value.comment}</p>
      </div>`;
        }

        html += `</div>`;
        document.getElementById("analyse-result").innerHTML = html;
      }

      if (responce.ok) {

          renderAnalysis(result);
      } else {
        alert("Failed to analyse the resume:" + result.message);
      }
    } catch (error) {
      console.error("failed to analyze resume:", error);
    }
  });
