#!/usr/bin/env bun

import simpleGit from 'simple-git';
import OpenAI from 'openai';
import inquirer from 'inquirer';

if (!process.env["OPENAI_API_KEY"]) {
  console.error("Please set the OPENAI_API_KEY environment variable.");
  process.exit(1);
}

const git = simpleGit();
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"]
});

const commitMessage = process.argv.slice(2).join(" ");

if (!commitMessage) {
  console.error("Please enter a commit message.");
  process.exit(1);
}

const SYSTEM_PROMPT = `
Translate the given string to English in a way that is suitable for a commit message.
Make the first word a verb in the present tense.
Capitalize the first letter.
There is no need for a period at the end of the sentence.`;

async function commit() {
  try {
    const status = await git.status();

    if (status.staged.length === 0) {
      if (status.files.length === 0) {
        console.error("変更されたファイルがありません。");
        process.exit(1);
      }

      console.log(status.files.map(file => file.path).join("\n"));

      const answers = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'files',
          message: 'ステージに上げるファイルを選んでください:',
          choices: status.files.map(file => file.path),
        },
      ]);

      if (answers.files.length === 0) {
        console.error("ステージに上げるファイルが選択されていません。");
        process.exit(1);
      }

      await git.add(answers.files);
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: commitMessage }],
      temperature: 0,
    });

    const translation = res.choices[0].message.content;

    if (!translation) {
      console.error("Translation failed.");
      process.exit(1);
    }

    await git.commit(translation);
    console.log("Commit successful:", translation);
  } catch (err) {
    console.error("Commit failed:", err);
  }
}

await commit();
