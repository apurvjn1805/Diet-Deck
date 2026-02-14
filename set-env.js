import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// This script generates the environment files for Angular using Vercel Env Variables
const targetPath = './projects/app/src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
    production: true,
    supabaseUrl: '${process.env['SUPABASE_URL'] || 'YOUR_SUPABASE_URL'}',
    supabaseKey: '${process.env['SUPABASE_KEY'] || 'YOUR_SUPABASE_ANON_KEY'}'
};
`;

// Ensure directory exists
const dir = dirname(targetPath);
if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
}

console.log('👷 Generating production environment file...');
writeFileSync(targetPath, envConfigFile);
console.log(`✅ File generated at ${targetPath}`);
