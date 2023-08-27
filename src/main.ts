import * as core from '@actions/core'
import {execSync} from 'child_process'

type ActionInput = {
  comparedBranchName: string
  comparedScript: string
}

/* TODO
■機能部分
・compared-scriptをstringのみでなく「current」「target」のキーがあるオブジェクトを指定できるようにしたい
（そうすれば「こっちではこの変数の値がこうで、こっちではこの変数の値がこう」と別々の条件を指定できたりするようになるはず）

■品質部分
・脆弱性的な観点を面倒見る
・getInputに渡す引数、setOutputに渡す引数、enumなどでaction.ymlから自動生成させたい
*/
async function run(): Promise<void> {
  try {
    const input: ActionInput = {
      comparedBranchName: core.getInput('compared-branch-name'),
      comparedScript: core.getInput('compared-script')
    }

    // 入力内容表示
    core.info('\n[input]')
    core.info(
      JSON.stringify(
        {
          repository: process.env.GITHUB_REPOSITORY,
          currentBranchName: process.env.GITHUB_REF?.split('/').pop() || '',
          ...input
        },
        null,
        2
      )
    )

    // 実行
    const execInputScript = (): string => {
      return execSync(input.comparedScript).toString()
    }
    const currentBranchResult = execInputScript()
    execSync(
      `git fetch origin ${input.comparedBranchName} && git checkout ${input.comparedBranchName}`
    )
    const comparedBranchResult = execInputScript()

    // 結果表示
    core.info('\n[result]')
    core.info(
      JSON.stringify(
        {
          currentBranchResult,
          comparedBranchResult
        },
        null,
        2
      )
    )
    const output_isResultSame = currentBranchResult === comparedBranchResult
    core.setOutput('isResultSame', output_isResultSame.toString())
    core.setOutput('currentBranchResult', currentBranchResult)
    core.setOutput('comparedBranchResult', comparedBranchResult)
    core.info('\n[output]')
    core.info(
      JSON.stringify(
        {
          isResultSame: output_isResultSame.toString(),
          currentBranchResult,
          comparedBranchResult
        },
        null,
        2
      )
    )
    core.info(
      "\nAt next step, you can use this result like `if: steps.{YOUR_STE_ID}.outputs.isResultSame == 'true'"
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
