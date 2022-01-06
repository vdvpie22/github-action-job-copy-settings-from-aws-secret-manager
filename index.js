const core = require('@actions/core');
const github = require('@actions/github');
const Promise = require('bluebird');
const fs = require('fs').promises;
const AWS = require('aws-sdk');
const path = require("path");

async function main () {
	try {
		// Get Inputs
		const awsAccessKeyId = core.getInput('AWS_ACCESS_KEY_ID');
		const awsSecretAccessKey = core.getInput('AWS_SECRET_ACCESS_KEY');
		const awsRegion = core.getInput('AWS_REGION');
		const saveToDir = core.getInput('SAVE_TO_DIR');
		const serviceName = core.getInput('SERVICE_NAME');

		if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion || !saveToDir || !serviceName) {
			throw {message: 'Check parameters'};
		}
		AWS.config.setPromisesDependency(Promise);
		const secretsManager = new AWS.SecretsManager({
			apiVersion: '2017-10-17',
			accessKeyId: awsAccessKeyId,
			secretAccessKey: awsSecretAccessKey,
			region: awsRegion
		});

		const params = {
			Filters: [
				{
					Key: 'tag-key',
					Values: [
						'serviceName'
					]
				},
				{
					Key: 'tag-value',
					Values: [
						serviceName
					]
				},
			],
		};

		let fileNames = [];
		const secretsList = await secretsManager.listSecrets(params).promise();
		for (const secret of secretsList.SecretList) {
			const envTag = secret.Tags.find(el => (el.Key === 'env'));
			if (!envTag) {
				continue
			}
			const env = envTag.Value;

			const secretValue = await secretsManager.getSecretValue({  SecretId: secret.ARN }).promise();
			await fs.writeFile(path.join(saveToDir, `${env}_config.json`), secretValue.SecretString);
			fileNames.push(path.join(saveToDir, 'src', 'config',`${env}_config.json`));
		}

		console.log(fileNames);

		core.setOutput("file_names", JSON.stringify(fileNames));
		// Get the JSON webhook payload for the event that triggered the workflow
		// const payload = JSON.stringify(github.context.payload, undefined, 2)
		// console.log(`The event payload: ${payload}`);
	} catch (error) {
		core.setFailed(error.message);
	}
}

main().then();
