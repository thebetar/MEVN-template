const inquirer = require('inquirer');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const questions = [
	{
		type: 'input',
		name: 'name',
		message: 'What is the project-name?',
	},
];

inquirer.prompt(questions).then((answers) => {
	answers.name = answers.name.toLowerCase().replace(/ /g, '-');

	const { name: projectName } = answers;

	const dockerCompose = fs.readFileSync('./docker-compose.yml', 'utf8');

	const newDockerCompose = dockerCompose.replaceAll('${PROJECT_NAME}', projectName);

	fs.writeFileSync('./docker-compose.yml', newDockerCompose, 'utf8');

	execSync(`
        cd ${path.join(__dirname, 'packages', 'client')} && 
        vue create .
    `);
	execSync(`
        cd ${path.join(__dirname, 'packages', 'server')} && 
        git clone https://github.com/thebetar/express-template && 
        rm -rf .git
    `);
	execSync(`
        docker run --name ${projectName}-db-container -v ${path.join(__dirname, 'packages', 'db', 'data')} -p 27017:27017 -d mongo
    `);

	console.log('Project name set to: ' + answers.name);
});
