const core = require('@actions/core');
const artifact = require('@actions/artifact');
const fs = require('fs');
const process = require('process');


async function main() {

    const artifactClient = artifact.create()
    const metadataFilename = core.getInput('metadataFilename')
    await artifactClient.downloadArtifact(core.getInput('artifactName'))
    const sourceJson = JSON.parse(fs.readFileSync(metadataFilename, 'utf-8'));
    const destinyStream = fs.createWriteStream(process.env.GITHUB_ENV, {flags:'a'});
    for (const k in sourceJson) if (sourceJson.hasOwnProperty(k)) {
        const envDefinition = k + '=' + sourceJson[k];
        core.info(envDefinition);
        destinyStream.write(envDefinition  + '\n');
    }
    fs.unlinkSync(metadataFilename)

}

main().catch(err => core.setFailed(err));