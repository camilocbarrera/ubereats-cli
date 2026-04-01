import ora from "ora";
import { uberGreen } from "./chalk";

export async function withSpinner<T>(
  message: string,
  fn: () => Promise<T>,
): Promise<T> {
  const isTTY = process.stderr.isTTY;
  const spinner = ora({
    text: uberGreen(message),
    stream: process.stderr,
    isSilent: !isTTY,
  }).start();

  try {
    const result = await fn();
    spinner.stop();
    return result;
  } catch (err) {
    spinner.stop();
    throw err;
  }
}
