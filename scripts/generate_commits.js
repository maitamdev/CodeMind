const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOTAL_COMMITS = 300;
const DAYS_BACK = 180; // Spread across the last 6 months

const verbs = ['feat', 'fix', 'refactor', 'chore', 'style', 'perf'];
const scopes = ['ui', 'auth', 'api', 'core', 'db', 'components', 'hooks', 'utils', 'pages', 'layout'];
const actions = ['implement', 'update', 'optimize', 'refactor', 'fix issue in', 'add support for', 'clean up', 'enhance', 'integrate'];
const targets = ['login flow', 'dashboard layout', 'user profile', 'database schema', 'error handling', 'loading states', 'navigation menu', 'data fetching', 'responsive design', 'animations', 'SEO meta tags', 'state management', 'API endpoints', 'unit tests'];

function getRandomMessage() {
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const scope = scopes[Math.floor(Math.random() * scopes.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];
    return `${verb}(${scope}): ${action} ${target}`;
}

// Generate an array of dates from past to present to make the history look chronological
const dates = [];
const now = new Date().getTime();
const past = now - (DAYS_BACK * 24 * 60 * 60 * 1000);

for (let i = 0; i < TOTAL_COMMITS; i++) {
    const randomTime = past + Math.random() * (now - past);
    dates.push(randomTime);
}

// Sort dates so commits are chronological
dates.sort((a, b) => a - b);

const logFile = path.join(__dirname, '..', 'docs', 'COMMIT_HISTORY.md');
const dir = path.dirname(logFile);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '# Auto-generated Commit History\n\n');
}

console.log(`Starting generation of ${TOTAL_COMMITS} commits over the last ${DAYS_BACK} days...`);

for (let i = 0; i < TOTAL_COMMITS; i++) {
    const commitDate = new Date(dates[i]).toISOString();
    const commitMsg = getRandomMessage();
    
    // Append to file
    fs.appendFileSync(logFile, `- ${commitDate}: ${commitMsg}\n`);
    
    try {
        execSync(`git add ${logFile}`);
        
        // Use environment variables for git commit date
        const env = { 
            ...process.env, 
            GIT_AUTHOR_DATE: commitDate,
            GIT_COMMITTER_DATE: commitDate
        };
        
        execSync(`git commit -m "${commitMsg}"`, { env, stdio: 'ignore' });
        
        if ((i + 1) % 50 === 0) {
            console.log(`Progress: ${i + 1}/${TOTAL_COMMITS} commits created.`);
        }
    } catch (e) {
        console.error(`Failed at commit ${i + 1}:`, e.message);
    }
}

console.log('Done! Now run `git push` to see your graph turn green!');
