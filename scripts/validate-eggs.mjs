import fs from 'fs';
import path from 'path';
const root = process.cwd();
const requiredVars = ['GIT_REPO','GIT_BRANCH','APP_DIR','MAIN_FILE','STARTUP_COMMAND','STARTUP_ARGS','AUTO_INSTALL_DEPS','AUTO_UPDATE','USER_UPLOAD','DISCORD_TOKEN'];
for (const file of fs.readdirSync('eggs', { recursive: true }).filter(f => f.endsWith('.json'))) {
  const egg = JSON.parse(fs.readFileSync(path.join(root, 'eggs', file), 'utf8'));
  for (const field of ['meta','name','author','docker_images','startup','config','scripts','variables']) if (!(field in egg)) throw new Error(`Missing ${field} in ${file}`);
  if (egg.meta.version !== 'PTDL_v2') throw new Error(`Invalid PTDL version in ${file}`);
  const envs = egg.variables.map(v => v.env_variable);
  for (const v of requiredVars) if (!envs.includes(v)) throw new Error(`Missing variable ${v} in ${file}`);
  if (new Set(envs).size !== envs.length) throw new Error(`Duplicate variables in ${file}`);
  const appDir = egg.variables.find(v => v.env_variable === 'APP_DIR').default_value;
  if (!fs.existsSync(path.join(root, appDir))) throw new Error(`APP_DIR does not exist for ${file}: ${appDir}`);
  if (!egg.config.startup.done.includes('[Maszynka] Runtime ready')) throw new Error(`Startup marker missing in ${file}`);
  for (const image of Object.values(egg.docker_images)) if (!image.startsWith('ghcr.io/parkervcp/yolks:')) throw new Error(`Unexpected image ${image}`);
}
console.log('Egg validation passed');
