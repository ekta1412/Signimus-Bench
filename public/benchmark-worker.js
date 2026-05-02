self.onmessage = (event) => {
  const { code } = event.data;

  const startTime = performance.now();
  try {
    new Function(code)();
  } catch (error) {
    console.error('Error executing snippet in worker:', error);
  }
  const endTime = performance.now();

  self.postMessage(endTime - startTime);
};