# @lainNao/branch-script-diff-check

GitHub actions for comparing shell Script results across two branches

## Usage

```yml
name: 'test'

on: # rebuild any PRs and main branch changes
  pull_request:

jobs:
  sample-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ./
        id: compare
        with:
          compared-branch-name: ${{ github.event.pull_request.base.ref }}
          compared-script: ls
      - name: run if compare result is same
        if: steps.compare.outputs.isResultSame == 'true'
        run: echo "ls result is same!"
      - name: run if compare result is not same
        if: steps.compare.outputs.isResultSame == 'false'
        run: echo "ls result is not same!"
```
