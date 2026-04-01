import chalk from "chalk";

// Uber Eats brand: #06C167 (green)
export const uberGreen = chalk.hex("#06C167");
export const uberGreenBold = chalk.hex("#06C167").bold;

// Semantic colors
export const success = chalk.green;
export const error = chalk.red;
export const warn = chalk.yellow;
export const hint = chalk.cyan;
export const dim = chalk.dim;
export const bold = chalk.bold;

// Status indicators
export const ok = (msg: string) => `  ${success("\u2713")} ${msg}`;
export const fail = (msg: string) => `  ${error("error")} ${msg}`;
export const warning = (msg: string) => `  ${warn("warning")} ${msg}`;
export const info = (msg: string) => `  ${dim("\u2022")} ${msg}`;

export { chalk };
