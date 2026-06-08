export const createFixture = () => {
  let capturedError: Error | null = null;

  return {
    captureError(error: Error) {
      capturedError = error;
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(capturedError).toBeTruthy();
      expect(capturedError).toBeInstanceOf(expectedErrorClass);
    },
  };
};
