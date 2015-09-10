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
prcheck use <:repo> list-prs --user|-u <:user> --label|-l [<:labels>] --files|-f [<:extension>]
```

- List all files from a specific pull request
```
prcheck use <:repo> list-files <:pr-number> --extension|-e [<:extension>]
```

- List all comments from a specific pull request
```
prcheck use <:repo> list-comments <:pr-number> --user|-u <:user>
```

- List statuses from a specific pull request
```
prcheck use <:repo> get-statuses <:pr-number>
```
