![OSD-cli](https://github.com/nardote/osd-cli/blob/main/assets/logo.png "OSD-cli Logo")

# OSD-cli (Orchestration Software Development)

OSD gives you back control over AI-generated code. Instead of dealing with hard-to-manage "black boxes," OSD structures your development through clear, versionable design prompts — stored in individual .osd files — for each module of your application. Define the global context and language guidelines in a central configuration file (.osd), and watch the tool orchestrate predictable source code creation along with the corresponding tests in your preferred language. Need to modify, regenerate, or understand a functionality? Just review or tweak its prompt. With OSD-cli, prompts become the backbone of an agile, maintainable, and self-documented development process — restoring control and clarity in the AI era.

## Installation
Install osd-cli as global:

```bash
npm i -g @orquestation/cli
```

## Project Setup

Create a folder for your new project:

```bash
mkdir new-project
```

Create a `.env` file with the `AI_API_KEY` variable (currently only works with Gemini, you can get a free key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)):

```bash
AI_API_KEY=XXXXXXXXXXXX
```

Initialize OSD in your new project:

```bash
cd new-project
osd-cli -i
```

At this point, OSD will create some folders and a file:

```
__tests__
__osd__
.osd
```

Now just create the folder where the code will be stored, e.g., `src`.

## Hello World

Create a file inside the `__osd__` folder named `index.js.osd` with the following content:

```json
{
    "prompt": "generate a function that logs Hello World to the console"
}
```
or
```yaml
prompt: >
  generate a function that logs Hello World to the console
```

IMPORTANT: The folder structure generated inside `__osd__` will be mirrored in the `src` folder.

Run the `osd-cli` command at the root of the project:

```bash
/user/new-project > osd-cli
```

You can now see your first code inside `./src`.

## General Configuration File

The general configuration file (`.osd`) defines some settings to help adapt to existing projects.

```json
{
  "prompt": "# The project is in Python 3.13. Keep in mind: - do not add the main entry point to each file",
  
  "promptFolder": "__osd__",
  "testFolder": "__tests__",
  "srcFolder": "src"
}
```
or
```yaml
prompt: >
  # The project is in Python 3.13. Keep in mind: - do not add the main entry point to each file

promptFolder: __osd__
testFolder: __tests__
srcFolder: src
```

IMPORTANT: If this file doesn’t exist, OSD will not recognize the project.

### `.osd` Configuration

You can change this file to adapt it to your workflow.

| Setting      | Description                                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| prompt       | Defines the conditions for how you want the AI to work. You should define the language and general requirements for the generated code. |
| promptFolder | This is where the .osd files are created, which are then used to generate code, tests, and the folder structure in `src`.               |
| testFolder   | Folder where test files will be created.                                                                                                |
| srcFolder    | Folder where the code will be generated.                                                                                                |

### .env

In the `.env` file, you can set the variable `OSD_DEBUG=true` to activate debug mode.

# Blocked files

You can block OSD from generating code again. This can be done by adding the parameter block set to true in the desired file within the __osd__ folder.

```json
{
    "prompt": "generate a function that logs Hello World to the console",
    "block": true
}
```
or
```yaml
prompt: >
  generate a function that logs Hello World to the console
block: true
```


# Create osd files from code
if you have a src folder with code, you can create osd files from it
```bash
osd-cli -s
```


# ignore blocked files
if you want to ignore blocked files, you can use the -i option
```bash
osd-cli -i
```

