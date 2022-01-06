# Copy settings form AWS Secret Manager

This action read AWS Secret Manager by tag and store file to configured directory 

## Inputs

## `AWS_ACCESS_KEY_ID`

**Required** AWS Access key.  Default `null`.

## `AWS_SECRET_ACCESS_KEY`

**Required** AWS Secret Access key.  Default `null`.

## `AWS_REGION`

**Required** AWS Region where stored secret manager.  Default `null`.


## `SAVE_TO_DIR`

**Required** Directory path to store json with settings.  Default `null`.

## Outputs

## `file_names`

Stored file names

## Example usage

```yaml
- name: someName 
  uses: vdvpie22/github-action-job-copy-settings-from-aws-secret-manager@v1.0.0
  with:   
    AWS_ACCESS_KEY_ID: '*****'
    AWS_SECRET_ACCESS_KEY: '*****'
    AWS_REGION: 'eu-west-2'
    SAVE_TO_DIR: /tmp/

```
