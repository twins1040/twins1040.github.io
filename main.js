async function loadContent() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    
    // Load profile
    document.querySelector('.profile-name').textContent = data.profile.name;
    document.querySelector('.profile-email').href = `mailto:${data.profile.email}`;
    document.querySelector('.profile-email').textContent = data.profile.email;
    document.querySelector('.profile-github').href = data.profile.github;
    document.querySelector('.profile-github').textContent = data.profile.github;
    document.querySelector('.profile-img').src = data.profile.image;

    // Load education
    const educationContainer = document.querySelector('#education-container');
    data.education.forEach(edu => {
      const eduHtml = `
        <div class="row">
          <div class="col-md-3 col-12 text-md-right">
            <h4 class="gray">${edu.period}</h4>
          </div>
          <div class="col-md-9 col-12">
            <h4>${edu.school}</h4>
            <i class="gray">${edu.major}</i>
          </div>
        </div>
      `;
      educationContainer.insertAdjacentHTML('beforeend', eduHtml);
    });

    // Load experience
    const experienceContainer = document.querySelector('#experience-container');
    data.experience.forEach(exp => {
      const skillsHtml = exp.skills ? 
        `<div>${exp.skills.map(skill => `<span class="badge badge-secondary">${skill}</span>`).join(' ')}</div>` : '';
      const detailsHtml = exp.details ?
        `<ul class="pt-3">
          ${exp.details.map(detail => `<li>${detail}</li>`).join('')}
          ${exp.skills ? `<li><strong>Skill Keywords</strong></li>${skillsHtml}` : ''}
        </ul>` : '';

      const expHtml = `
        <div class="row">
          <div class="col-md-3 col-12 text-md-right">
            <div class="row">
              <div class="col-md-12 col">
                <h4 class="gray">${exp.period}<br/></h4>
              </div>
              ${exp.duration ? `
              <div class="col-md-12 col-3 text-center text-md-right">
                <span class="badge badge-info">${exp.duration}</span>
              </div>` : ''}
            </div>
          </div>
          <div class="col-md-9 col-12">
            <h4>${exp.company}</h4>
            ${exp.position ? `<i class="gray">${exp.position}</i>` : ''}
            ${detailsHtml}
          </div>
        </div>
        <hr />
      `;
      experienceContainer.insertAdjacentHTML('beforeend', expHtml);
    });

    // Load projects
    const projectsContainer = document.querySelector('#projects-container');
    data.projects.forEach(project => {
      let detailsHtml = '<ul class="pt-3">';
      
      // Add website link if exists
      if (project.website) {
        detailsHtml += `<li><strong><a href="${project.website}" target="_blank">${project.website}</a></strong></li>`;
      }
      
      // Add github link if exists
      if (project.github) {
        detailsHtml += `<li><a href="${project.github}" target="_blank">${project.github}</a></li>`;
      }
      
      project.details.forEach(detail => {
        if (typeof detail === 'object' && detail.title) {
          // Handle nested details with features
          detailsHtml += `<li>
            <strong>${detail.title}</strong>
            <ul>
              ${detail.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </li>`;
        } else {
          detailsHtml += `<li>${detail}</li>`;
        }
      });
      
      // Add API URL if exists
      if (project.api_url) {
        const apiLinkText = detail => detail.title === 'Backend' && 
          detail.features.some(f => f.includes('api 서버')) ? 'api 서버' : project.api_url;
        detailsHtml = detailsHtml.replace(
          'api 서버',
          `<a href="${project.api_url}" target="_blank">api 서버</a>`
        );
      }
      
      // Add presentation link if exists
      if (project.presentation) {
        detailsHtml += `<li><a href="${project.presentation}">최종 발표 자료</a></li>`;
      }
      
      detailsHtml += '</ul>';

      const projectHtml = `
        <div class="row">
          <div class="col-md-3 col-12 text-md-right">
            <h4 class="gray">${project.period}</h4>
          </div>
          <div class="col-md-9 col-12">
            <h4>${project.title}</h4>
            <i class="gray">${project.company}</i>
            ${detailsHtml}
          </div>
        </div>
        <hr />
      `;
      projectsContainer.insertAdjacentHTML('beforeend', projectHtml);
    });

    // Load skills
    const skillsContainer = document.querySelector('#skills-container');
    
    // Add tooltip explanation for skill levels
    const tooltipHtml = `
      <div class="row pb-3">
        <div class="col">
          <h2>
            <span class="blue">SKILLS</span>
            <small data-toggle="tooltip" title="1: 기초 수준, 2: 취미 개발 수준, 3: Production 개발 가능 수준">
              <i class="fa fa-question-circle" aria-hidden="true"></i>
            </small>
          </h2>
        </div>
      </div>
    `;
    skillsContainer.insertAdjacentHTML('beforeend', tooltipHtml);

    // Load each skill category
    Object.entries(data.skills).forEach(([category, categoryData]) => {
      let skillsHtml = '';
      
      if (category === 'etc') {
        // Handle etc category differently
        skillsHtml = `
          <div class="row">
            <div class="col-12 col-md-3 text-md-right">
              <h4 class="gray">${categoryData.title}</h4>
            </div>
            <div class="col-12 col-md-9">
              <div class="row">
                <div class="col">
                  <ul>
                    ${categoryData.columnOne.map(skill => `<li>${skill}</li>`).join('')}
                  </ul>
                </div>
                <div class="col">
                  <ul>
                    ${categoryData.columnTwo.map(skill => `<li>${skill}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        // Handle other categories
        skillsHtml = `
          <div class="row">
            <div class="col-12 col-md-3 text-md-right">
              <h4 class="gray">${categoryData.title}</h4>
            </div>
            <div class="col-12 col-md-9">
              <div class="row">
                <div class="col">
                  <ul>
                    ${categoryData.skills.slice(0, Math.ceil(categoryData.skills.length/2)).map(skill => `
                      <li>
                        <span class="badge badge-pill badge-${skill.level === 3 ? 'primary' : 'secondary'}">${skill.level}</span>
                        ${skill.name}
                      </li>
                    `).join('')}
                  </ul>
                </div>
                ${categoryData.skills.length > Math.ceil(categoryData.skills.length/2) ? `
                  <div class="col">
                    <ul>
                      ${categoryData.skills.slice(Math.ceil(categoryData.skills.length/2)).map(skill => `
                        <li>
                          <span class="badge badge-pill badge-${skill.level === 3 ? 'primary' : 'secondary'}">${skill.level}</span>
                          ${skill.name}
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }

      skillsContainer.insertAdjacentHTML('beforeend', skillsHtml);
      if (category !== 'etc') {
        skillsContainer.insertAdjacentHTML('beforeend', '<hr />');
      }
    });

    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();

  } catch (error) {
    console.error('Error loading content:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadContent);
