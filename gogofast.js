#!/usr/bin/env node

const commandExists = require("command-exists");
const axios = require("axios").default;
const { Octokit } = require("octokit");
const tmp = require("tmp");
const fs = require("fs");
const child_process = require("child_process");

const octokit = new Octokit();
const username = process.argv[2] || "MauricioRobayo";
const PER_PAGE_RESULTS = 100;
const GGF_TAG = "#gogofast";

const goGoFast = async (files) => {
  for (const [filename, fileDetails] of files) {
    const { data } = await axios.get(fileDetails.raw_url);
    const tmpFile = tmp.fileSync();
    fs.writeFileSync(tmpFile.name, data);

    const lines = data.split("\n");
    const height = lines.length;
    const width = Math.max(...lines.map((line) => line.length))

    const args = filename.endsWith(".txt")
      ? ["--paragraph", "--width=60", "--reflow", tmpFile.name]
      : [`--height=${height}`, `--width=${width}`, tmpFile.name];

    child_process.spawnSync("gotta-go-fast", args, {
      stdio: "inherit",
    });
  }
};

const start = async () => {
  try {
    await commandExists("gotta-go-fast");
  } catch (error) {
    console.error(
      "Please install gotta-go-fast: https://github.com/callum-oakley/gotta-go-fast/"
    );
    process.exit(1);
  }

  try {
    const gists = await octokit.request(`GET /users/${username}/gists`, {
      username,
      per_page: PER_PAGE_RESULTS,
    });

    if (gists.data.length > PER_PAGE_RESULTS) {
      console.log(
        `Got more than a ${PER_PAGE_RESULTS} results. Time to paginate!`
      );
    }

    const snippets = gists.data.filter((gist) => {
      if (gist.description) {
        return gist.description.includes(GGF_TAG);
      }
      return false;
    });

    if (snippets.length === 0) {
      console.log(`No gists with tag '${GGF_TAG}' found!`);
      process.exit(1);
    }

    const snippet =
      snippets.find(({ id }) => id === process.argv[3]) ||
      snippets[Math.floor(Math.random() * snippets.length)];

    await goGoFast(Object.entries(snippet.files));
  } catch (error) {
    if (error.status === 404) {
      console.error(`Could not find gists for username '${username}'!`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

start();
