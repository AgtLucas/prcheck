# List of available commands

- List all my available repositories
```
prcheck list-repos
```

- List all pull requests from a repo
```
prcheck use <:repo> list-prs --user|-u <:user> --label|-l [<:labels>] --files|-f [<:extension>]
```

- List all files from a specific pull request
```
prcheck use <:repo> --pr|-p <:pr-number> list-files --extension|-e [<:extension>]
```

- List all comments from a specific pull request
```
prcheck use <:repo> --pr|-p <:pr-number> list-comments --user|-u <:user>
```

- List statuses from a specific pull request
```
prcheck use <:repo> --pr|-p <:pr-number> get-statuses
```
