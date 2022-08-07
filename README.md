# power-mgmt

<img width="981" alt="Screenshot of power-mgmt" src="https://user-images.githubusercontent.com/63468786/183308989-e713cd1d-5289-4737-8919-839868a9af3d.png">

External power management for PVE.

Built from RNCE Stack (pronounced "rinse"), an unopinionated template for building and quickly deploying web applications running on a single machine.

**Note:** The database, in fact, is missing one state, tracking whether the user has manually shutdown the machine after it has turned on, but before cooldown period expires. Without which, the system will not be able to differentiate between ("grey dot", disabled button, shutdown during cooldown) and ("yellow dot", disabled button, booting up).

## Deployment
To start an new deployment, tag a new release in your GitHub repo.

## Assumptions
RNCE Stack
- That there is a `.env` file in `/express`, with a key `PORT`
- That there is both a certificate and key file in `/nginx/ssl`
- That there is a `/public` folder in `/nginx` on deployment (currently handled by Actions)
- That Node modules for `/spa` and `/express` are installed before local testing

`power-mgmt`
- That there is a volume named `power-mgmt-db` in both local and remote Docker machine.
