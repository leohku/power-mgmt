# power-mgmt

External power management for PVE.

Built from RNCE Stack (pronounced "rinse"), an unopinionated template for building and quickly deploying web applications running on a single machine.

## Features
- GitHub Actions pipeline to deploy on any bare-metal machine or VM, even behind firewalls / VPNs
- Fully containerized setup, spin up a working local app by running `yarn local:start`
- Uses Typescript, React SPAs, and Express.js by default, unopinionated otherwise

## Deployment
To start an new deployment, tag a new release in your GitHub repo.

## Customization
Find and replace `dashboard` in the project repository to customize to your project name and domain.

## Requirements of remote deployment machine
- Key based SSH is enabled
- Tailscale is enabled and reachable by GitHub Runner (non-blocking ACL rules)
- Docker is enabled, user account is in `docker` group (no `sudo` to run containers)

## Assumptions
RNCE Stack
- That there is a `.env` file in `/express`, with a key `PORT`
- That there is both a certificate and key file in `/nginx/ssl`
- That there is a `/public` folder in `/nginx` on deployment (currently handled by Actions)
- That Node modules for `/spa` and `/express` are installed before local testing

`power-mgmt`
- That there is a volume named `power-mgmt-db` in both local and remote Docker machine.

**Note:** Having Docker rootless mode configured in remote SSH account's `.bashrc` is not recommended as containers deployed with this template uses Docker's "rootful" default mode. This can cause confusion as running `docker container ls` will return an empty list in SSH when in fact the container is running in "rootful" mode.
