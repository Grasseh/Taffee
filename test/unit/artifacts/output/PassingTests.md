# PARAMETERLESS
[T1](?=a.pass())  
[T2](?=a.pass())

# SINGLE PARAMETER
[A](#var) [T3](?=a.pass(#var))

# MULTI PARAMETER
[B](#var) [C](#var2) [T4](?=a.pass(#var, #var2))
