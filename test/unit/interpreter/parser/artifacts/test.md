[](invoker: NiceInvoker)
[](m: ../NiceModule.ext)
# PARAMETERLESS
[T1](t: a.pass())  
[T2](t: a.pass())

# SINGLE PARAMETER
[A](v:v) [T3](test: a.pass(v))

# MULTI PARAMETER
[B](v: v) [C](variable: v2) [T4](test: a.pass(v, v2))