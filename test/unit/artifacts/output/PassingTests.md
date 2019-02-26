# PARAMETERLESS
[T1](?=a.pass())  
[T2](?=a.pass())

# SINGLE PARAMETER
[A](#v) [T3](?=a.pass(#v))

# MULTI PARAMETER
[B](#v) [C](#v2) [T4](?=a.pass(#v, #v2))
