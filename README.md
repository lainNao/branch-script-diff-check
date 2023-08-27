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
      # 1, Use with two args, "compared-branch-name", "compared-script".
      - uses: lainNao/branch-script-diff-check@v1
        id: compare
        with:
          compared-branch-name: ${{ github.event.pull_request.base.ref }} # Edit this value if you want.
          compared-script: ls # This shell script runs on current and compared branch. Edit this script as you like.
      # 2, Then you can get the results "isResultSame", "currentBranchResult", "comparedBranchResult",
      #    and can access these through `steps.YOUR_STEP_ID.outputs.~`.
      - name: run if compare result is same
        if: steps.compare.outputs.isResultSame == 'true'
        run: echo "ls result is same!"
      - name: run if compare result is not same
        if: steps.compare.outputs.isResultSame == 'false'
        run: echo "ls result is not same!"
      - name: echo current branch result
        run: echo ${{ steps.compare.outputs.currentBranchResult }}
      - name: echo compared branch result
        run: echo ${{ steps.compare.outputs.comparedBranchResult }}
```

## Use case

- By using isResultSame:
  - you can run step if some script (like git command, node command, etc) result has changed.
- By using currentBranchResult, comparedBranchResult:
  - you can run step if some script result has changed from A to B, 0 to 1, false to true, etc. Based on the script you provide, any changes can be compared.
