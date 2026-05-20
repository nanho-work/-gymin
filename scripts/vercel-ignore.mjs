import { execFileSync } from "node:child_process";

const webRelevantPaths = [
  "web/",
  "package.json",
  "package-lock.json",
  "vercel.json",
  "scripts/vercel-ignore.mjs"
];

function runGit(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  }).trim();
}

function canReadCommit(sha) {
  try {
    runGit(["cat-file", "-e", `${sha}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

function readChangedFiles() {
  const currentSha = process.env.VERCEL_GIT_COMMIT_SHA || "HEAD";
  const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA;

  if (previousSha && !/^0+$/.test(previousSha) && canReadCommit(previousSha)) {
    return runGit(["diff", "--name-only", previousSha, currentSha])
      .split("\n")
      .filter(Boolean);
  }

  try {
    return runGit(["diff", "--name-only", "HEAD^", "HEAD"])
      .split("\n")
      .filter(Boolean);
  } catch {
    return null;
  }
}

function isWebRelevant(filePath) {
  return webRelevantPaths.some((targetPath) => {
    if (targetPath.endsWith("/")) {
      return filePath.startsWith(targetPath);
    }

    return filePath === targetPath;
  });
}

const changedFiles = readChangedFiles();

if (!changedFiles) {
  console.log("Changed files could not be determined. Continue Vercel build.");
  process.exit(1);
}

const shouldBuildWeb = changedFiles.some(isWebRelevant);

if (shouldBuildWeb) {
  console.log("Web-related files changed. Continue Vercel build.");
  process.exit(1);
}

console.log("No web-related files changed. Skip Vercel build.");
process.exit(0);
