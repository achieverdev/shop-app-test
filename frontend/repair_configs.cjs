const fs = require('fs');
const path = require('path');

const files = {
    'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`,
    'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
};

for (const [name, content] of Object.entries(files)) {
    const filePath = path.join(__dirname, name);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', name);
}
