export const createFixture = () => {
  let capturedError: Error | null = null;

  return {
    captureError(error: Error) {
      capturedError = error;
    },
    thenErrorShouldBe(expectedErrorClass: new (...args: never[]) => Error) {
      expect(capturedError).toBeTruthy();
      expect(capturedError).toBeInstanceOf(expectedErrorClass);
    },
  };
};
