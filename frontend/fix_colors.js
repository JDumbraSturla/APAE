const fs = require('fs');

const files = [
  'src/ProfilePage.jsx',
  'src/SettingsPage.jsx', 
  'src/AdminDashboard.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove color references
  content = content.replace(/\{ backgroundColor: colors\.background \}/g, '{}');
  content = content.replace(/\{ backgroundColor: colors\.surface \}/g, '{}');
  content = content.replace(/\{ backgroundColor: colors\.surface, borderBottomColor: colors\.border \}/g, '{}');
  content = content.replace(/\{ color: colors\.text, fontSize: fontSize \+ 12 \}/g, '{}');
  content = content.replace(/\{ color: colors\.text, fontSize: fontSize \+ 8 \}/g, '{}');
  content = content.replace(/\{ color: colors\.text, fontSize: fontSize \+ 4 \}/g, '{}');
  content = content.replace(/\{ color: colors\.text, fontSize: fontSize \+ 2 \}/g, '{}');
  content = content.replace(/\{ color: colors\.text, fontSize \}/g, '{}');
  content = content.replace(/\{ color: colors\.textSecondary, fontSize: fontSize - 2 \}/g, '{}');
  content = content.replace(/\{ color: colors\.textSecondary, fontSize \}/g, '{}');
  content = content.replace(/color={colors\.textSecondary}/g, 'color="#9ca3af"');
  content = content.replace(/\{ backgroundColor: colors\.primary \}/g, '{ backgroundColor: "#15803d" }');
  content = content.replace(/\{ backgroundColor: colors\.error \}/g, '{ backgroundColor: "#dc2626" }');
  
  // Remove style arrays with only color/fontSize
  content = content.replace(/style={\[styles\.(\w+), \{\}\]}/g, 'style={styles.$1}');
  
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
});