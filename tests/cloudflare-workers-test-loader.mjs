export async function resolve(specifier, context, nextResolve) {
  if (specifier === "cloudflare:workers") {
    return {
      url: "data:text/javascript,export%20const%20tracing%20%3D%20undefined",
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}
