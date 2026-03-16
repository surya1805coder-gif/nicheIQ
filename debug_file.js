const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'components', 'CompareTray.tsx');
console.log('Checking path:', filePath);
if (fs.existsSync(filePath)) {
  console.log('File EXISTS');
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('File size:', content.length);
  console.log('First 50 chars:', content.substring(0, 50).replace(/\n/g, '\\n'));
} else {
  console.log('File DOES NOT EXIST');
  const dirPath = path.join(process.cwd(), 'src', 'components');
  console.log('Directory contents of', dirPath, ':');
  console.log(fs.readdirSync(dirPath));
}
