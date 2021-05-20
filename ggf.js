import commandExists from "command-exists";
import axios from "axios";
import { Octokit } from "octokit";
import tmp from "tmp";
import fs from "fs";
import child_process from "child_process";

const octokit = new Octokit();
const username = "MauricioRobayo";
const PER_PAGE_RESULTS = 100;
const GGF_TAG = "#ggf";

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
        `Got more than a ${PER_PAGE_RESULTS} results. Need to paginate!`
      );
    }

    const snippets = gists.data.filter((gist) =>
      gist.description?.includes(GGF_TAG)
    );

    if (snippets.length === 0) {
      console.log(`No gists with tag '${GGF_TAG}' found!`);
      process.exit();
    }

    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    const [{ raw_url: rawUrl }] = Object.values(randomSnippet.files);
    const { data } = await axios.get(rawUrl);
    const { name: filename } = tmp.fileSync();
    const height = data.split("\n").length;
    fs.writeFileSync(filename, data);

    child_process.spawn("gotta-go-fast", [`--height=${height}`, filename], {
      stdio: "inherit",
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
