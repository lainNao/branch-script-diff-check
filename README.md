# lainNao/branch-script-diff-check

GitHub actions for comparing shell script results across two branches

## Usage

```yml
name: 'test'

on:
  pull_request:

jobs:
  sample-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: lainNao/branch-script-diff-check@v1
        id: compare
        with:
          compared-branch-name: ${{ github.event.pull_request.base.ref }} # edit this value if you want
          compared-script: ls # edit this shell script as you like
      - name: run if compare result is same
        if: steps.compare.outputs.isResultSame == 'true'
        run: echo "ls result is same!"
      - name: run if compare result is not same
        if: steps.compare.outputs.isResultSame == 'false'
        run: echo "ls result is not same!"
```
