// Import jsPDF
const { jsPDF } = window.jspdf;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Tab Functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            tabBtns.forEach(tb => tb.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            btn.classList.add('active');
            const formId = btn.getAttribute('data-tab') + '-form';
            document.getElementById(formId).classList.add('active');
        });
    });
    
    // Authentication forms
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const portfolioContainer = document.getElementById('portfolio-container');
    const authContainer = document.getElementById('auth-container');
    
    // Make sure we're loading users from localStorage properly
    let users = [];
    try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }
    } catch (e) {
        console.error('Error loading users from localStorage:', e);
        users = [];
    }
    
    // Debugging: Log loaded users (remove in production)
    console.log('Loaded users:', users);
    
    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const passwordError = document.getElementById('password-error');
        
        // Password validation
        if (password !== confirmPassword) {
            passwordError.style.display = 'block';
            return;
        } else {
            passwordError.style.display = 'none';
        }
        
        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            showMessage('User already exists. Please login.', 'error');
            return;
        }
        
        // Save new user
        users.push({ email, password });
        
        // Ensure users are being saved to localStorage
        try {
            localStorage.setItem('users', JSON.stringify(users));
            console.log('User registered:', email); // Debug
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            showMessage('Registration failed. Please try again.', 'error');
            return;
        }
        
        showMessage('Registration successful! Please login.', 'success');
        
        // Reset form and switch to login tab
        registerForm.reset();
        document.querySelector('[data-tab="login"]').click();
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        console.log('Login attempt:', email); // Debug
        
        // Load fresh user data from localStorage
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                users = JSON.parse(storedUsers);
            }
        } catch (e) {
            console.error('Error loading users from localStorage:', e);
        }
        
        // Check credentials
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            // Successfully logged in
            console.log('Login successful for:', email); // Debug
            showMessage('Login successful!', 'success');
            
            // Store logged in user in session
            sessionStorage.setItem('currentUser', email);
            
            // Hide auth forms and show portfolio form
            setTimeout(() => {
                authContainer.classList.add('hidden');
                portfolioContainer.classList.remove('hidden');
            }, 1000); // Small delay to see the success message
        } else {
            console.log('Login failed for:', email); // Debug
            showMessage('Invalid credentials. Please try again.', 'error');
        }
    });
    
    // Check if user is already logged in (on page refresh)
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        authContainer.classList.add('hidden');
        portfolioContainer.classList.remove('hidden');
    }
    
    // Show message function
    function showMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Add to auth container
        authContainer.appendChild(messageElement);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
    
    // Photo upload preview
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');
    
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Dynamic form fields - Education
    let educationCount = 1;
    function addEducation() {
        educationCount++;
        const educationSection = document.getElementById('education-section');
        
        const newEducation = document.createElement('div');
        newEducation.className = 'education-item';
        newEducation.innerHTML = `
            <hr style="margin: 20px 0;">
            <h4>Education ${educationCount}</h4>
            <div class="form-group">
                <label for="institution${educationCount}">Institution</label>
                <input type="text" id="institution${educationCount}" class="institution" placeholder="Institution">
            </div>
            <div class="form-group">
                <label for="degree${educationCount}">Degree</label>
                <input type="text" id="degree${educationCount}" class="degree" placeholder="Degree">
            </div>
            <div class="form-group">
                <label for="year${educationCount}">Year</label>
                <input type="text" id="year${educationCount}" class="year" placeholder="Year">
            </div>
            <div class="form-group">
                <label for="grade${educationCount}">Grade/GPA</label>
                <input type="text" id="grade${educationCount}" class="grade" placeholder="Grade/GPA">
            </div>
        `;
        
        // Insert before the "Add More" button
        educationSection.insertBefore(newEducation, educationSection.querySelector('.btn-add'));
    }
    window.addEducation = addEducation;
    
    // Dynamic form fields - Work Experience
    let workCount = 1;
    function addWorkExperience() {
        workCount++;
        const workSection = document.getElementById('work-experience-section');
        
        const newWork = document.createElement('div');
        newWork.className = 'work-item';
        newWork.innerHTML = `
            <hr style="margin: 20px 0;">
            <h4>Work Experience ${workCount}</h4>
            <div class="form-group">
                <label for="company${workCount}">Company Name</label>
                <input type="text" id="company${workCount}" class="company" required>
            </div>
            <div class="form-group">
                <label for="duration${workCount}">Duration</label>
                <input type="text" id="duration${workCount}" class="duration" required>
            </div>
            <div class="form-group">
                <label for="responsibilities${workCount}">Job Responsibilities</label>
                <textarea id="responsibilities${workCount}" class="responsibilities" rows="3" required></textarea>
            </div>
        `;
        
        // Insert before the "Add More" button
        workSection.insertBefore(newWork, workSection.querySelector('.btn-add'));
    }
    window.addWorkExperience = addWorkExperience;
    
    // Dynamic form fields - Projects
    let projectCount = 1;
    function addProject() {
        projectCount++;
        const projectSection = document.getElementById('project-section');
        
        const newProject = document.createElement('div');
        newProject.className = 'project-item';
        newProject.innerHTML = `
            <hr style="margin: 20px 0;">
            <h4>Project ${projectCount}</h4>
            <div class="form-group">
                <label for="projectName${projectCount}">Project Name</label>
                <input type="text" id="projectName${projectCount}" class="projectName" placeholder="Project Name">
            </div>
            <div class="form-group">
                <label for="projectDescription${projectCount}">Description</label>
                <textarea id="projectDescription${projectCount}" class="projectDescription" rows="3" placeholder="Description"></textarea>
            </div>
            <div class="form-group">
                <label for="projectLink${projectCount}">Link (Optional)</label>
                <input type="text" id="projectLink${projectCount}" class="projectLink" placeholder="Link">
            </div>
        `;
        
        // Insert before the "Add More" button
        projectSection.insertBefore(newProject, projectSection.querySelector('.btn-add'));
    }
    window.addProject = addProject;
    
    // Portfolio form submission and PDF generation
    const portfolioForm = document.getElementById('portfolio-form');
    
    portfolioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect all form data
        const portfolioData = {
            personal: {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                contact: document.getElementById('contact').value,
                photo: photoPreview.src,
                bio: document.getElementById('bio').value
            },
            skills: {
                soft: document.getElementById('softSkills').value,
                technical: document.getElementById('technicalSkills').value
            },
            education: collectEducation(),
            workExperience: collectWorkExperience(),
            projects: collectProjects()
        };
        
        // Generate PDF
        generatePDF(portfolioData);
    });
    
    // Collect all education items
    function collectEducation() {
        const education = [];
        
        // Original education item
        const originalInstitution = document.getElementById('institution').value;
        if (originalInstitution) {
            education.push({
                institution: originalInstitution,
                degree: document.getElementById('degree').value,
                year: document.getElementById('year').value,
                grade: document.getElementById('grade').value
            });
        }
        
        // Added education items
        const educationItems = document.querySelectorAll('.education-item');
        educationItems.forEach((item, index) => {
            const institutionInput = item.querySelector('.institution');
            if (institutionInput && institutionInput.value) {
                education.push({
                    institution: institutionInput.value,
                    degree: item.querySelector('.degree').value,
                    year: item.querySelector('.year').value,
                    grade: item.querySelector('.grade').value
                });
            }
        });
        
        return education;
    }
    
    // Collect all work experience items
    function collectWorkExperience() {
        const workExperience = [];
        
        // Original work experience
        workExperience.push({
            company: document.getElementById('company').value,
            duration: document.getElementById('duration').value,
            responsibilities: document.getElementById('responsibilities').value
        });
        
        // Added work experiences
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach((item, index) => {
            workExperience.push({
                company: item.querySelector('.company').value,
                duration: item.querySelector('.duration').value,
                responsibilities: item.querySelector('.responsibilities').value
            });
        });
        
        return workExperience;
    }
    
    // Collect all project items
    function collectProjects() {
        const projects = [];
        
        // Original project
        const originalProjectName = document.getElementById('projectName').value;
        if (originalProjectName) {
            projects.push({
                name: originalProjectName,
                description: document.getElementById('projectDescription').value,
                link: document.getElementById('projectLink').value
            });
        }
        
        // Added projects
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((item, index) => {
            const projectNameInput = item.querySelector('.projectName');
            if (projectNameInput && projectNameInput.value) {
                projects.push({
                    name: projectNameInput.value,
                    description: item.querySelector('.projectDescription').value,
                    link: item.querySelector('.projectLink').value
                });
            }
        });
        
        return projects;
    }
    
    // Generate PDF function
    function generatePDF(data) {
        // Create new PDF document
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPos = 20;
        
        // Set title
        doc.setFontSize(24);
        doc.setTextColor(44, 62, 80); // #2c3e50
        doc.text(data.personal.fullName, pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(52, 152, 219); // #3498db
        doc.text(data.personal.email, pageWidth / 2, yPos, { align: 'center' });
        // Contact info
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(52, 152, 219); // #3498db
        doc.text(data.personal.contact, pageWidth / 2, yPos, { align: 'center' });
        
        // Add photo if available
        if (data.personal.photo && data.personal.photo !== '') {
            yPos += 10;
            try {
                doc.addImage(data.personal.photo, 'JPEG', (pageWidth / 2) - 25, yPos, 50, 50);
                yPos += 55;
            } catch(e) {
                console.error('Error adding image to PDF:', e);
                // Continue without the image
            }
        }
        
        // Bio
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(51, 51, 51); // #333333
        doc.text('About Me', 20, yPos);
        yPos += 5;
        doc.setFontSize(10);
        
        // Split bio into multiple lines
        const bioLines = doc.splitTextToSize(data.personal.bio, pageWidth - 40);
        doc.text(bioLines, 20, yPos);
        yPos += bioLines.length * 5 + 10;
        
        // Skills
        doc.setFontSize(12);
        doc.setTextColor(51, 51, 51); // #333333
        doc.text('Skills', 20, yPos);
        yPos += 5;
        
        // Soft Skills
        doc.setFontSize(10);
        doc.setTextColor(44, 62, 80); // #2c3e50
        doc.text('Soft Skills:', 20, yPos);
        doc.setTextColor(51, 51, 51); // #333333
        const softSkillsText = data.skills.soft || 'None specified';
        doc.text(softSkillsText, 60, yPos);
        yPos += 8;
        
        // Technical Skills
        doc.setTextColor(44, 62, 80); // #2c3e50
        doc.text('Technical Skills:', 20, yPos);
        doc.setTextColor(51, 51, 51); // #333333
        const technicalSkillsText = data.skills.technical || 'None specified';
        doc.text(technicalSkillsText, 60, yPos);
        yPos += 15;
        
        // Education
        if (data.education.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(51, 51, 51); // #333333
            doc.text('Education', 20, yPos);
            yPos += 8;
            
            data.education.forEach(edu => {
                // Check for new page
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(10);
                doc.setTextColor(44, 62, 80); // #2c3e50
                doc.text(edu.institution, 20, yPos);
                
                doc.setTextColor(51, 51, 51); // #333333
                doc.text(`${edu.degree} (${edu.year})`, 20, yPos + 5);
                
                doc.setTextColor(44, 62, 80); // #2c3e50
                doc.text('Grade/GPA:', 20, yPos + 10);
                doc.setTextColor(51, 51, 51); // #333333
                doc.text(edu.grade, 60, yPos + 10);
                
                yPos += 20;
            });
        }
        
        // Work Experience
        if (data.workExperience.length > 0) {
            // Check for new page
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(51, 51, 51); // #333333
            doc.text('Work Experience', 20, yPos);
            yPos += 8;
            
            data.workExperience.forEach(work => {
                // Check for new page
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(10);
                doc.setTextColor(44, 62, 80); // #2c3e50
                doc.text(work.company, 20, yPos);
                
                doc.setTextColor(51, 51, 51); // #333333
                doc.text(work.duration, 20, yPos + 5);
                
                doc.setTextColor(44, 62, 80); // #2c3e50
                doc.text('Responsibilities:', 20, yPos + 10);
                
                // Split responsibilities into multiple lines
                const respLines = doc.splitTextToSize(work.responsibilities, pageWidth - 40);
                doc.setTextColor(51, 51, 51); // #333333
                doc.text(respLines, 20, yPos + 15);
                
                yPos += 20 + respLines.length * 5;
            });
        }
        
        // Projects/Publications
        if (data.projects.length > 0) {
            // Check for new page
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(51, 51, 51); // #333333
            doc.text('Projects & Publications', 20, yPos);
            yPos += 8;
            
            data.projects.forEach(project => {
                // Check for new page
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(10);
                doc.setTextColor(44, 62, 80); // #2c3e50
                doc.text(project.name, 20, yPos);
                
                // Split description into multiple lines
                const descLines = doc.splitTextToSize(project.description, pageWidth - 40);
                doc.setTextColor(51, 51, 51); // #333333
                doc.text(descLines, 20, yPos + 5);
                
                // Add link if available
                if (project.link) {
                    doc.setTextColor(52, 152, 219); // #3498db
                    doc.text(project.link, 20, yPos + 10 + descLines.length * 5);
                    yPos += 15 + descLines.length * 5;
                } else {
                    yPos += 10 + descLines.length * 5;
                }
            });
        }
        
        // Generate PDF file name based on user's name
        const fileName = data.personal.fullName.replace(/\s+/g, '_').toLowerCase() + '_portfolio.pdf';
        
        // Save the PDF
        doc.save(fileName);
        
        // Show success message
        showPortfolioMessage('Portfolio PDF generated successfully!', 'success');
    }
    
    // Show message function for portfolio form
    function showPortfolioMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.portfolio-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message portfolio-message ${type}`;
        messageElement.textContent = message;
        
        // Add to portfolio container
        portfolioContainer.appendChild(messageElement);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
});
