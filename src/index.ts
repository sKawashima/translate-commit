import simpleGit from 'simple-git';
import OpenAI from 'openai';

if (!process.env["OPENAI_API_KEY"]) {
  console.error("Please set the OPENAI_API_KEY environment variable.");
  process.exit(1);
}

const git = simpleGit();
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"]
});

const commitMessage = process.argv[2];

if (!commitMessage) {
  console.error("Please enter a commit message.");
  process.exit(1);
}

const SYSTEM_PROMPT = `
Please translate the provided string into English.
Make the first letter capitalized.
The period at the end of the sentence is not necessary.`;

async function commit() {
  try {
    const status = await git.status();
    if (status.staged.length === 0) {
      console.error("There are no changes staged.");
      process.exit(1);
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

commit();
