function message(dispatch, message, timeout) {
  dispatch("message", { message, timeout });
}

export { message };
