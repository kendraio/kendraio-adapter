# Kendraio Adapter Configs

Hosted via GitHub Pages at
https://kendraio.github.io/kendraio-adapter/config.json

## Building
The JSON is built when changes are pushed to GitHub, thanks to GitHub pages automatic 
running of Jekyll on the repo before publishing to GitHub pages.

In order to build locally for testing, you need to install Jekyll, and then run:

    jekyll s

## What is an Adapter?

Adapters provide configuration for other Kendraio projects (such as App, CLI, etc) to integrate with third party service providers and data formats and schemas. 

Within Kendraio Adapter we are assembling a library of API clients that will enable the Kendraio App (and any third party service provider) to plug into the APIs of existing media service providers. We are creating API clients that do not already exist and also assessing/testing those that do. 

## Why create an Adapter?

If you represent a third-party service that wishes to integrate with the Kendraio ecosystem, or make use of the shared technology we are developing, then you will need to create an Adapter. 
The Adapter methodology is in its early stages and under active development. For now, the presence of an Adapter within this repo is a starting point towards a more meaningful integration with the Kendraio ecosystem. It will be a place to store configuration related to how a particular service is accessed, the features provided by a service, and the data formats and schemas supported by the service.

## How to create an Adapter

### Step 1: Fork the repo

The first step to integrating with Kendraio Adapter is to create a fork of the repository. More information on how to do this is available here:

https://help.github.com/articles/fork-a-repo

### Step 2: Create the Adapter information file

From the forked repo you should create a sub-folder and a file under the `tree/master/adapters` folder. The folder name must follow the "machine name" format using only lowercase alphanumeric characters and the middle dash character (`-`). 
Within the folder create a file called `adapter.yaml`. See the examples within this repo for details. For example, [this adapter file](https://github.com/kendraio/kendraio-adapter/blob/master/adapters/schema/adapter.yaml) for [Schema.org](http://schema.org). The minimum required information to start with is:

    name: must match the sub-folder name (lower case, no spaces)
    title: Service name as shown in user interfaces and listings (mixed case, spaces permitted)
    description: A brief description of the service
    infoUrl: A link to find more information about the service
    maintainer: Name of the organisation responsible for maintaining the Adapter
    supportUrl: A link for where to get support regarding this Adapter or service integration

### Step 3: Submit a Pull Request

Once you have created the file with the Adapter information in your forked repository, submit a pull request to get it merged across into the main repository. You can find information on submitting pull requests here:

https://help.github.com/articles/about-pull-requests/

Please include the following information in the pull request:

TBC: Template for pull request
