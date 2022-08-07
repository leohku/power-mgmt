# power-mgmt

<img width="1068" alt="Screenshot 2022-08-08 at 3 37 36 AM" src="https://user-images.githubusercontent.com/63468786/183308124-1bc8f040-91fc-4b0b-b9e3-6caf41cf965a.png">

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
