## How to contribute to this UABC-web!

There are some basic guidelines to be adhered to when contributing to this project. Please read the following sections
carefully.

### Pull Requests

**All** changes to the project must be made through a pull request. This includes changes to the documentation, code,
and tests. The reason for this is to ensure that all changes are reviewed by at least one other person before they are
merged in, and to make sure that our `master` branch is always in a healthy state.

When raising a PR the following is a good read for a _good_ PR:
https://www.atlassian.com/blog/git/written-unwritten-guide-pull-requests


### Issues

All code, with the exception of emergency fixes should come from
an [issue](http://aha.io/roadmapping/guide/agile/what-is-issue-tracking). This is to ensure that the work being done is
being tracked and it is clear what the purpose of the needed code changes are. Please refer to
the [UABC project board](https://github.com/UoaWDCC/uabc-web/projects?query=is%3Aopen) for more information.

### Branches

When working on a new feature or bug fix, you should always create a new branch from the `master` branch. Generally the
workflow for this will be something like:

```bash
git checkout master
git pull
# You need to replace <issue number> with the issue number you are working on
git checkout -b <issue number>-<branch-name>
```

### Yamada UI Themes

You can use the Yamada CLI to generate types for tokens of your customized theme, such as colors and font sizes. You may also use this to refer to the theme tokens in your code.

```bash
pnpm theme
```