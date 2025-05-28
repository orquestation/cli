![OSD-cli](https://github.com/nardote/osd-cli/blob/main/assets/logo.png "OSD-cli Logo")

# OSD-cli (Orchestration Software Development)

OSD gives you back control over AI-generated code. Instead of dealing with hard-to-manage "black boxes," OSD structures your development through clear, versionable design prompts — stored in individual .osd files — for each module of your application. Define the global context and language guidelines in a central configuration file (.osd), and watch the tool orchestrate predictable source code creation along with the corresponding tests in your preferred language. Need to modify, regenerate, or understand a functionality? Just review or tweak its prompt. With OSD-cli, prompts become the backbone of an agile, maintainable, and self-documented development process — restoring control and clarity in the AI era.

## Installation
Install osd-cli as global:

```bash
npm i -g @orquestation/cli
```

## Project Setup

In your proyect add enviroment variable `AI_API_KEY` (currently only works with Gemini, you can get a free key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)):

```bash
AI_API_KEY=XXXXXXXXXXXX
```

# Initialize OSD 
Your have 2 options from a new project o preexisting project

## New project
Create your proyect folder and initialize OSD

```bash
mkdir new-project
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

### Hello World

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

## Preexisting project
### Initialize OSD
```bash
cd your-project
osd-cli -i
```
At this point, OSD will create some folders and a file:

```
__tests__
__osd__
.osd
```

Take time to configure src path in the .osd file

### Create osd files from code
```bash
osd-cli -s
```

When finish processing, you will have a `__osd__` folder with osd files and a `src` folder with the code.



# General Configuration File

The general configuration file (/your-project/.osd) is responsible for defining the project's overall behavior. Here, you can specify which libraries you want to use or special conditions when generating code. You can also define folder paths.

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

**IMPORTANT:** If this file doesn’t exist, OSD will not recognize the project.

### Parameters

| Setting      | Description| Required |
| ------------ | ------------ | ------------ |
| prompt       | Defines the conditions for how you want the AI to work. You should define the language and general requirements for the generated code. | true |
| promptFolder | This is where the .osd files are created, which are then used to generate code, tests, and the folder structure in `src`. | true |
| testFolder   | Folder where test files will be created. | true |
| srcFolder    | Folder where the code will be generated. | true |



### Individual `.osd` file (in `__osd__` folder)

| Setting      | Description  | Type | Values | Default | Required |
| ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
| prompt       | Define what code the AI should generate. Explain in detail. | string |  |  | true |
| block | Its purpose is to stop the AI from regenerating the code. | boolean | true / false | false | false |
| direction   | You can define the direction in which files are generated. For example, you might have code you prefer to write manually, while the AI handles generating the OSD file, or vice versa. The default is osd-code. | string | osd-code / code-osd | osd-code | false |


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

# Ignore blocked files
if you want to ignore blocked files, you can use the -i option
```bash
osd-cli -i
```

### DEBUG MODE

In the `.env` file, you can set the variable `OSD_DEBUG=true` to activate debug mode.
