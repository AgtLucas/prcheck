# PRCheck

> Command line tool to analyze pull requests data on Github

## Install

```sh
[sudo] npm install -g prcheck
```

## Usage

```sh
prcheck [command] [payload] [--flags]
```

## Dependencies

To run sucessfully you must have [NodeJS >= v4.0.0](https://nodejs.org/en/download) installed.

## Available Commands

- List commands and options help

```sh
prcheck --help, -h
```

- List your available repositories
```
prcheck list-repos
```

- Reconnect via Github OAuth
```
prcheck re-auth
```

- List all pull requests from a Github repository
```
prcheck list-prs <user/:repo> --authors|-a <:author> --extensions|-e [<:extension>]
```

## Contributing

Anyone can help make this project better - check out the [Contributing guide](CONTRIBUTING.md)!

## License

See the [License](LICENSE) file.
