import yargs from 'yargs';

const args = yargs
  .command("* <message>", "print a message received as an argument")
  .parseSync()

console.log(args.message)
