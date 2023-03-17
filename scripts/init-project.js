import inquirer from 'inquirer';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
	{
		type: 'input',
		name: 'name',
		message: 'What is the project-name?',
	},
];

function executeCommand(command) {
	execSync(command, { stdio: 'inherit' });
}

inquirer.prompt(questions).then((answers) => {
	answers.name = answers.name.toLowerCase().replace(/ /g, '-');

	const { name: projectName } = answers;

	const dockerCompose = fs.readFileSync(path.join(__dirname, 'templates', 'docker-compose.yml'), 'utf8');

	const newDockerCompose = dockerCompose.replaceAll('${PROJECT_NAME}', projectName);

	fs.writeFileSync(path.join(__dirname, '..', 'docker-compose.yml'), newDockerCompose, 'utf8');

	executeCommand(`
        cd ${path.join(__dirname, '..', 'packages', 'client')} && 
        npx @vue/cli create . --no-git --skipGetStarted --bare
    `);
	executeCommand(`
        cd ${path.join(__dirname, '..', 'packages', 'server')} && 
        git clone https://github.com/thebetar/express-template . && 
        rm -rf .git
    `);
	// executeCommand(`
	//     docker run --name ${projectName}-db-container -v ${path.join(__dirname, '..', 'packages', 'db', 'data')} -p 27017:27017 -d mongo
	// `);
	executeCommand(`
		npm install
	`);

	console.log('Project name set to: ' + answers.name);
});
