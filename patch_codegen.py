import sys

with open("src/codegen.js", "r") as f:
    content = f.read()

# Pass env to handler in genRouteReg
content = content.replace(
    "handler: async function(__tezz_request, __tezz_params) {",
    "handler: async function(__tezz_request, __tezz_params, env) {"
)

# Call handler with env in genWorkerServer
content = content.replace(
    "const __result = await __route.handler(__request, __params);",
    "const __result = await __route.handler(__request, __params, env);"
)

# And in Node server, we pass global env (already defined) or nothing, but let's pass it anyway:
# wait, in Node server there's no `env` parameter to pass except the global one, so passing `env` works since `env` is in scope.

with open("src/codegen.js", "w") as f:
    f.write(content)

print("codegen.js patched")
