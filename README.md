# translate-commit

Translate non-English commit messages in GPT into English and commit them.

## Usage

Add OPENAI_API_KEY to the shell environment variable and set the KEY issued under your account.

```bash
# Install
npm install -g translate-commit

# Run
translate-commit <commit-message>

# or
gtc <commit-message>
```

This project was created using `bun init` in bun v0.6.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

<!--- publish command
bun build src/index.ts --outfile=dist/cli.js --minify --target=node
chmod +x dist/cli.js

npm login
npm publish --access public

-->
