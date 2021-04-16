import * as core from '@actions/core'
import * as fs from 'fs'
import { deploy } from './utils'
try {
  (async () => {
    const environment = core.getInput('environment');
    const serviceName = core.getInput('service');
    const manifest = core.getInput('manifest');
    const repo = core.getInput('repository');
    const registry = core.getInput('registry') || process.env['CONTAINERREGISTRY'];
    const namespace = core.getInput('namespace') || process.env['NAMESPACE'];
    const tag = core.getInput('tag') || process.env['TAG'];
    const kubebot = process.env['KUBEBOT'];
    if (!kubebot) {
      throw new Error('kubebot url is needed!');
    }
    if (!fs.existsSync(manifest)) {
        throw new Error(`${manifest} not found`);
    }

    const url = `${kubebot}/deploy/${environment}/${namespace}/${serviceName}/${tag}?registry=${registry}&repository=${repo}`;
    await deploy(url, manifest);
  })();
} catch (error) {
  core.setFailed(error.message);
}