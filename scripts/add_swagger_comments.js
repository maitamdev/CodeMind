const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('route.ts') || file.endsWith('route.js')) {
            results.push(file);
        }
    });
    return results;
}

const routes = walk(apiDir);
let updatedCount = 0;

routes.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.includes('@swagger')) {
        return; // Already has swagger doc
    }

    // Extract path relative to /api/
    // e.g. src/app/api/auth/login/route.ts -> /api/auth/login
    const relativePath = filePath.replace(/\\/g, '/').split('/src/app')[1].replace('/route.ts', '').replace('/route.js', '');
    const folderName = relativePath.split('/')[2] || 'General';

    // Find exports for GET, POST, PUT, DELETE, PATCH
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    let modified = false;
    methods.forEach(method => {
        const regex = new RegExp(`export\\s+(?:async\\s+)?function\\s+${method}\\s*\\(`, 'g');
        if (regex.test(content)) {
            const swaggerDoc = `
/**
 * @swagger
 * ${relativePath}:
 *   ${method.toLowerCase()}:
 *     tags:
 *       - ${folderName.charAt(0).toUpperCase() + folderName.slice(1)}
 *     summary: API endpoint for ${relativePath}
 *     description: Tự động sinh tài liệu cho ${method} ${relativePath}. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
`;
            content = content.replace(regex, `${swaggerDoc.trim()}\nexport async function ${method}(`);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        updatedCount++;
        console.log(`Added Swagger docs to: ${relativePath}`);
    }
});

console.log(`Done! Automatically documented ${updatedCount} API routes.`);
