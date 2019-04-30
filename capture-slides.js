const mri = require("mri");
const mkdirp = require("mkdirp");
const path = require("path");
const puppeteer = require("puppeteer"); // TODO: Use puppeteer-core instead as it's lighter?
const argv = process.argv.slice(2);

captureSlides();

async function captureSlides() {
  const { source, target } = mri(argv, {
    default: {
      verbose: false,
    },
    boolean: ["verbose"],
    string: ["source", "target"],
  });

  if (!source) {
    return console.error("Missing source");
  }

  if (!target) {
    return console.error("Missing target");
  }

  console.log(source, target);

  try {
    // https://stackoverflow.com/questions/48013969/how-to-maximise-screen-use-in-pupeteer-non-headless
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    mkdirp.sync(target);

    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(source);

    // TODO: Generalize
    await page.screenshot({ path: path.join(target, "0.png") });
    await page.keyboard.press("ArrowRight");
    await page.screenshot({ path: path.join(target, "1.png") });
    await page.keyboard.press("ArrowRight");
    await page.screenshot({ path: path.join(target, "2.png") });
  } catch (err) {
    console.error(err);
  }

  process.exit();
}
