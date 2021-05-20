# gogofast

**Requires [gotta-go-fast](https://github.com/callum-oakley/gotta-go-fast) installed**.

Practice on the command line your touch typing skills with snippets stored as gists.

It will pick a random gist with the `#gogofast` tag in the description.

If a gist has multiple files in it, it will go through all the files in a single session one after the other.

It receives `username` as a single argument:

```
npx gogofast <username>
```

## Example

```
npx gogofast MauricioRobayo
```

## Tip

Create an alias on your `.bashrc` file (or your preferred shell):

```
alias ggf='npx --quiet gogofast <username>'
```

Use it as `ggf` and profit.

## TODO

- [ ] Add pagination when the returned gists exceeds 100.
- [ ] Add support for `PARAGRAPH MODE` based on the gist file extension, if extension is `.txt` then use `PARAGRAPH MODE`.

## Acknowledgments

[gotta-go-fast](https://github.com/callum-oakley/gotta-go-fast)
