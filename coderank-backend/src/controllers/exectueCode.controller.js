import { db } from "../libs/db.js";
import {
  submitBatch,
  pollBatchResults,
  getLanguageName,
} from "../libs/judge0.libs.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    // validate the test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missing test cases" });
    }

    // prepare each test case for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // send the batch submission to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // Poll judge0 for the results of the batch submission
    const results = await pollBatchResults(tokens);

    console.log("Result-------------");
    console.log(results);

    // analyze the test case
    // for each test case, check if the expected output matches the actual output
    // for example if the expected output is 10 and the actual output is 10, then the test case is passed
    // if the expected output is 10 and the actual output is 20, then the test case is failed.
    // if the expected output is 10 and the actual output is null, then the test case is failed.
    // for this we have to loop through each test case using map.

    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      // console.log(`Testcase #${i+1}`);
      // console.log(`Input for testcase #${i+1}: ${stdin[i]}`)
      // console.log(`Expected Output for testcase #${i+1}: ${expected_output}`)
      // console.log(`Actual output for testcase #${i+1}: ${stdout}`)

      // console.log(`Matched testcase #${i+1}: ${passed}`)

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    console.log(detailedResults);

    // store submission summary
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // if allPassed = ture, then marks the particular problem as solved by the user
    if (allPassed) {
      // mark the problem as solved
      // check if the user has already solved the problem, for that we are using upsert method.
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        // if user already solved the problem, then update the solved field to true
        update: {},
        // if user has not solved the problem, then create a new record
        create: {
          userId,
          problemId,
        },
      });
    }

    // save the individual testcase result using detailedResults
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({ data: testCaseResults });

    // console.log("Submission: ", submission);
    // console.log("Test Case Results: ", testCaseResults);

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Code Executed! Successfully!",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error executing code:", error.message);
    res.status(500).json({ error: "Failed to execute code" });
  }
};
