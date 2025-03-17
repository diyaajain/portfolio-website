async function fetchGitHubData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/events/public`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return [];
    }
}

async function addGitHubGraph() {
    const username = 'diyaajain';
    
    // Find the social-links div
    const socialLinks = document.querySelector('.social-links');

    // Create GitHub activity section
    const githubActivity = document.createElement('div');
    githubActivity.className = 'github-activity';
    githubActivity.innerHTML = `
        <h3>GitHub Contributions</h3>
        <div class="github-stats">
            <div class="scroll-container">
                <button class="scroll-btn left-btn">&lt;</button>
                <div id="contribution-calendar" class="interactive-calendar">
                    <div class="tooltip" style="display: none;"></div>
                </div>
                <button class="scroll-btn right-btn">&gt;</button>
            </div>
        </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .github-stats {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            background: #f8f9fa;
            position: relative;
        }
        .scroll-container {
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
        }
        .interactive-calendar {
            margin-bottom: 20px;
            position: relative;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-behavior: smooth;
        }
        .interactive-calendar::-webkit-scrollbar {
            display: none;
        }
        .interactive-calendar iframe {
            transition: all 0.3s ease;
            min-width: 722px;
        }
        .scroll-btn {
            position: absolute;
            z-index: 2;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s;
            opacity: 0.7;
        }
        .scroll-btn:hover {
            opacity: 1;
        }
        .left-btn {
            left: 0;
        }
        .right-btn {
            right: 0;
        }
        .tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(styles);

    // Create and add the GitHub contribution graph iframe
    const calendarContainer = githubActivity.querySelector('#contribution-calendar');
    const tooltip = calendarContainer.querySelector('.tooltip');
    const iframe = document.createElement('iframe');
    iframe.src = `https://ghchart.rshah.org/${username}`;
    iframe.style.cssText = 'width: 100%; height: 100px; border: none; overflow: hidden;';
    iframe.title = 'GitHub Contribution Graph';
    calendarContainer.appendChild(iframe);

    // Add interactive hover effect
    iframe.onload = () => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const squares = iframeDoc.querySelectorAll('rect');

        squares.forEach(square => {
            square.addEventListener('mouseover', (e) => {
                const date = square.getAttribute('data-date');
                const count = square.getAttribute('data-count');
                const level = square.getAttribute('data-level');

                tooltip.style.display = 'block';
                tooltip.style.left = `${e.pageX - calendarContainer.offsetLeft + 10}px`;
                tooltip.style.top = `${e.pageY - calendarContainer.offsetTop - 30}px`;
                tooltip.innerHTML = `
                    <strong>${date}</strong><br>
                    ${count} contributions
                    <br>
                    Activity Level: ${level}
                `;
            });

            square.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
            });
        });
    };

    socialLinks.appendChild(githubActivity);

    // Add scroll button functionality
    const leftBtn = githubActivity.querySelector('.left-btn');
    const rightBtn = githubActivity.querySelector('.right-btn');
    const calendar = calendarContainer;

    leftBtn.addEventListener('click', () => {
        calendar.scrollBy({ left: -200, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        calendar.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Update button visibility based on scroll position
    calendar.addEventListener('scroll', () => {
        leftBtn.style.opacity = calendar.scrollLeft > 0 ? '0.7' : '0';
        rightBtn.style.opacity = 
            calendar.scrollLeft < (calendar.scrollWidth - calendar.clientWidth) ? '0.7' : '0';
    });

    // Initial button state
    setTimeout(() => {
        rightBtn.style.opacity = 
            calendar.scrollWidth > calendar.clientWidth ? '0.7' : '0';
        leftBtn.style.opacity = '0';
    }, 100);
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', addGitHubGraph);