# List of available commands

- List all my available repositories
```
prcheck list-repos
```

- Reset github auth config
```
prcheck re-auth
```

- List all pull requests from a repo
```
prcheck list-prs <user/:repo> --author|-a <:user> --label|-l [<:labels>] --extesion|-e [<:extension>]
```

- TODO: List all files from a specific pull request
```
prcheck list-files <:repo> <:pr-number> --extension|-e [<:extension>]
```

- TODO: List all comments from a specific pull request
```
prcheck list-comments <:repo> <:pr-number> --author|-a <:user>
```

- TODO: List statuses from a specific pull request
```
prcheck get-statuses <:repo> <:pr-number>
```
