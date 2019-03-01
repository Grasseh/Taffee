# OUTPUT INTEGRATION TEST
This is the output integration test file.<br />
<br />
## PARAMETERLESS TESTS
Parameterless tests are the simplest supported form of tests.<br />
<br />
Passing parameterless tests are written in a simple form: [T1](t:a.pass()).<br />
Failing tests will always [T2](t: a.fail()) show the expected and real results.<br />
<br />
## SINGLE PARAMETER TESTS
Single parameter tests support text input declaration like links.<br />
Assigning a variable is done like so: [V1](var:var1)<br />
This will assign the value V1 to the parameter named var1 in the background map.<br />
Reassigning a variable is done by reusing the statement: [V2](var: var1). Parameter var1 now has a value of V2.<br />
This variable can now be passed to a test, either passing or failing.<br />
[T3](test:a.pass(var1))<br />
[T4](test: a.fail(var1))<br />
<br />
## MULTI PARAMETER TESTS
Multi parameter tests function in the same way as single parameter tests.<br />
First assign variables: [V1](variable:var1), [V2](variable: var2)<br />
[T5](t: a.pass(var1, var2))<br />
[T6](test: a.fail(var1, var2))
