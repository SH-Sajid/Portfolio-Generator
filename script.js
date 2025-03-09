document.addEventListener("DOMContentLoaded", function () {
    // Tab Switching for Login/Register
    const tabButtons = document.querySelectorAll(".tab-btn");
    const authForms = document.querySelectorAll(".auth-form");

    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            authForms.forEach(form => form.classList.remove("active"));

            this.classList.add("active");
            document.getElementById(this.dataset.tab + "-form").classList.add("active");
        });
    });

    // Password Toggle Visibility
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", function () {
            const passwordField = this.previousElementSibling;
            if (passwordField.type === "password") {
                passwordField.type = "text";
                this.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                passwordField.type = "password";
                this.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

    // Login Form Submission
    const loginForm = document.getElementById("login");
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        if (email && password) {
            document.getElementById("auth-container").classList.add("hidden");
            document.getElementById("portfolio-container").classList.remove("hidden");
        } else {
            alert("Please enter valid credentials!");
        }
    });

    // Portfolio Form Submission
    const portfolioForm = document.getElementById("portfolio-form");
    portfolioForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect form data for personal information
        const data = {
            fullName: document.getElementById("fullName").value,
            contact: document.getElementById("contact").value,
            bio: document.getElementById("bio").value,
            softSkills: document.getElementById("softSkills").value,
            technicalSkills: document.getElementById("technicalSkills").value,
            photo: document.getElementById("photo").files[0]
        };

        // Collect dynamic Education data
        const educationData = [];
        document.querySelectorAll('.education-section').forEach(section => {
            educationData.push({
                institution: section.querySelector('.institution').value,
                degree: section.querySelector('.degree').value,
                year: section.querySelector('.year').value,
                grade: section.querySelector('.grade').value
            });
        });

        // Collect dynamic Work Experience data
        const workExperienceData = [];
        document.querySelectorAll('.work-section').forEach(section => {
            workExperienceData.push({
                company: section.querySelector('.company').value,
                duration: section.querySelector('.duration').value,
                responsibilities: section.querySelector('.responsibilities').value
            });
        });

        // Collect dynamic Project data
        const projectData = [];
        document.querySelectorAll('.project-section').forEach(section => {
            projectData.push({
                projectName: section.querySelector('.projectName').value,
                projectDescription: section.querySelector('.projectDescription').value,
                projectLink: section.querySelector('.projectLink').value
            });
        });

        // Combine all the collected data into the final object
        const formData = {
            ...data,
            education: educationData,
            workExperience: workExperienceData,
            projects: projectData
        };

        const reader = new FileReader();
        reader.onloadend = function () {
            const photoBase64 = reader.result;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(16);
            doc.text(`Portfolio of ${formData.fullName}`, 20, 20);

            // Add photo to the PDF if available
            if (photoBase64) {
                doc.addImage(photoBase64, "JPEG", 20, 30, 50, 50);
            }

            doc.setFontSize(12);
            doc.text(`Contact: ${formData.contact}`, 20, 90);
            doc.text(`Bio: ${formData.bio}`, 20, 100);
            doc.text("Soft Skills:", 20, 120);
            doc.text(formData.softSkills, 20, 130);
            doc.text("Technical Skills:", 20, 150);
            doc.text(formData.technicalSkills, 20, 160);

            // Add Education Section
            let yOffset = 180;
            if (formData.education.length > 0) {
                doc.text("Education:", 20, yOffset);
                formData.education.forEach((edu, index) => {
                    yOffset += 10;
                    doc.text(`Institution: ${edu.institution}`, 20, yOffset);
                    yOffset += 10;
                    doc.text(`Degree: ${edu.degree}`, 20, yOffset);
                    yOffset += 10;
                    doc.text(`Year: ${edu.year}`, 20, yOffset);
                    yOffset += 10;
                    doc.text(`Grade: ${edu.grade}`, 20, yOffset);
                    yOffset += 10;
                });
            }

            // Add Work Experience Section
            if (formData.workExperience.length > 0) {
                yOffset += 20;
                doc.text("Work Experience:", 20, yOffset);
                formData.workExperience.forEach(work => {
                    yOffset += 10;
                    doc.text(`Company: ${work.company}`, 20, yOffset);
                    yOffset += 10;
                    doc.text(`Duration: ${work.duration}`, 20, yOffset);
                    yOffset += 10;
                    doc.text(`Responsibilities: ${work.responsibilities}`, 20, yOffset);
                    yOffset += 10;
                });
            }

            // Add Projects Section
            if (formData.projects.length > 0) {
                yOffset += 20;
                doc.text("Projects/Publications:", 20, yOffset);
                formData.projects.forEach(proj => {
                    yOffset += 10;
                    doc.text(`Project Name: ${proj.projectName}`, 20, yOffset);
                    yOffset += 10;
                    doc.text(`Description: ${proj.projectDescription}`, 20, yOffset);
                    yOffset += 10;
                    if (proj.projectLink) {
                        doc.text(`Link: ${proj.projectLink}`, 20, yOffset);
                        yOffset += 10;
                    }
                });
            }

            // Generate PDF
            doc.save("portfolio.pdf");
        };

        if (formData.photo) {
            reader.readAsDataURL(formData.photo);
        }
    });

    // Function to dynamically add sections
    function addSection(containerId, templateClass) {
        const container = document.getElementById(containerId);
        const newSection = document.querySelector(`.${templateClass}`).cloneNode(true);
        newSection.classList.remove("template");
        container.appendChild(newSection);
    }

    document.getElementById("add-education").addEventListener("click", function () {
        addSection("education-container", "education-section");
    });

    document.getElementById("add-work").addEventListener("click", function () {
        addSection("work-container", "work-section");
    });

    document.getElementById("add-project").addEventListener("click", function () {
        addSection("project-container", "project-section");
    });
});
