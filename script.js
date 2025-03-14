// Theme handling
let theme = localStorage.getItem('theme') || 'light';
setTheme(theme);

const themeDots = document.getElementsByClassName('theme-dot');
Array.from(themeDots).forEach(dot => {
    dot.addEventListener('click', function() {
        const mode = this.dataset.mode;
        setTheme(mode);
    });
});

function setTheme(mode) {
    const themeStyle = document.getElementById('theme-style');
    themeStyle.href = `${mode}.css`;
    localStorage.setItem('theme', mode);
}

// GitHub Projects Integration
async function fetchGitHubProjects() {
    try {
        const username = 'diyaajain';
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        const projects = response.data
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        const projectsGrid = document.getElementById('github-projects');
        projectsGrid.innerHTML = projects
            .map(project => `
                <div class="project-card animate-fade-in">
                    <div class="project-content">
                        <h3 class="project-title">${project.name}</h3>
                        <p class="project-description">${project.description || 'No description available'}</p>
                        <div class="project-meta">
                            <span>⭐ ${project.stargazers_count}</span>
                            <span>🔄 ${new Date(project.updated_at).toLocaleDateString()}</span>
                        </div>
                        <a href="${project.html_url}" target="_blank" class="btn btn-primary">View Project</a>
                    </div>
                </div>
            `)
            .join('');
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        document.getElementById('github-projects').innerHTML = 
            '<p>Error loading projects. Please try again later.</p>';
    }
}

// Load GitHub projects when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);