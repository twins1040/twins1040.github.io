async function fetchData() {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
}

function renderExperience(experience) {
    const container = document.getElementById('experience');
    experience.reverse().forEach(exp => {
        const item = document.createElement('div');
        item.className = 'experience-item';
        
        item.innerHTML = `
            <div class="experience-header">
                <div>
                    <div class="primary-title">${exp.company}</div>
                    <div class="secondary-title">${exp.position}</div>
                    ${exp.skills ? `<div class="skills">
                        ${exp.skills.map(skill => `<span class="badge badge-light">${skill}</span>`).join(' ')}
                    </div>` : ''}
                </div>
                <div class="period">${exp.period}</div>
            </div>
            <ul class="details">
                ${exp.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        `;
        container.appendChild(item);
    });
}

function renderProjects(projects) {
    const container = document.getElementById('projects');
    projects.reverse().forEach(project => {
        const item = document.createElement('div');
        item.className = 'project-item';
        
        item.innerHTML = `
            <div class="project-header">
                <div>
                    <div class="primary-title">${project.title}</div>
                    <div class="secondary-title">${project.company}</div>
                </div>
                <div class="period">${project.period}</div>
            </div>
            <ul class="details">
                ${Array.isArray(project.details) 
                    ? project.details.map(detail => {
                        if (typeof detail === 'string') {
                            return `<li>${detail}</li>`;
                        } else {
                            return `
                                <li><strong>${detail.title}</strong></li>
                                <ul>
                                    ${Array.isArray(detail.features) 
                                        ? detail.features.map(feature => `<li>${feature}</li>`).join('')
                                        : ''}
                                </ul>
                            `;
                        }
                    }).join('')
                    : ''}
            </ul>
            ${project.github ? `<div><a href="${project.github}" target="_blank">GitHub</a></div>` : ''}
            ${project.website ? `<div><a href="${project.website}" target="_blank">Website</a></div>` : ''}
        `;
        container.appendChild(item);
    });
}

function renderSkills(skills) {
    const container = document.getElementById('skills');
    
    Object.entries(skills).forEach(([key, category]) => {
        if (key === 'etc') {
            const div = document.createElement('div');
            div.className = 'skill-category';
            div.innerHTML = `
                <h3>${category.title}</h3>
                <div class="skill-list">
                    ${[...category.columnOne, ...category.columnTwo]
                        .map(skill => `<div class="skill-item">${skill}</div>`)
                        .join('')}
                </div>
            `;
            container.appendChild(div);
        } else {
            const div = document.createElement('div');
            div.className = 'skill-category';
            div.innerHTML = `
                <h3>${category.title}</h3>
                <div class="skill-list">
                    ${category.skills
                        .map(skill => `
                            <div class="skill-item">
                                ${skill.name}
                                <span class="skill-level">${'★'.repeat(skill.level)}</span>
                            </div>
                        `)
                        .join('')}
                </div>
            `;
            container.appendChild(div);
        }
    });
}

function renderEducation(education) {
    const container = document.getElementById('education');
    education.forEach(edu => {
        const item = document.createElement('div');
        item.className = 'education-item';
        item.innerHTML = `
            <div class="experience-header">
                <div>
                    <div class="primary-title">${edu.school}</div>
                    <div class="secondary-title">${edu.major}</div>
                </div>
                <div class="period">${edu.period}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

async function init() {
    const data = await fetchData();
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderEducation(data.education);
}

document.addEventListener('DOMContentLoaded', init);
