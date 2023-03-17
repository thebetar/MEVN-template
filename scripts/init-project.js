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

function createClient(projectName) {
	executeCommand(`
        cd ${path.join(__dirname, '..', 'packages', 'client')} && 
        npm create vue@latest . --no-git --skipGetStarted --bare
    `);

	executeCommand(`
		cp ${path.join(__dirname, 'templates', 'client', 'Dockerfile')} ${path.join(__dirname, '..', 'packages', 'client')}
	`);

	const clientNginxConfig = fs.readFileSync(path.join(__dirname, 'templates', 'client', 'nginx.conf'), 'utf8');
	const newClientNginxConfig = clientNginxConfig.replaceAll('${PROJECT_NAME}', projectName);
	fs.writeFileSync(path.join(__dirname, '..', 'packages', 'client', 'nginx.conf'), newClientNginxConfig, 'utf8');
}

function createServer() {
	executeCommand(`
	cd ${path.join(__dirname, '..', 'packages', 'server')} && 
	git clone https://github.com/thebetar/express-template . && 
	rm -rf .git
`);
}

function createDb(projectName) {
	executeCommand(`
	    docker run --name ${projectName}-db-container -v ${path.join(__dirname, '..', 'packages', 'db', 'data')} -p 27017:27017 -d mongo
	`);
}

inquirer.prompt(questions).then((answers) => {
	answers.name = answers.name.toLowerCase().replace(/ /g, '-');

	const { name: projectName } = answers;

	const dockerCompose = fs.readFileSync(path.join(__dirname, 'templates', 'docker-compose.yml'), 'utf8');
	const newDockerCompose = dockerCompose.replaceAll('${PROJECT_NAME}', projectName);
	fs.writeFileSync(path.join(__dirname, '..', 'docker-compose.yml'), newDockerCompose, 'utf8');

	createClient(projectName);
	createServer();
	createDb(projectName);

	executeCommand(`
		npm install
	`);

	console.log('Project name set to: ' + answers.name);
});
