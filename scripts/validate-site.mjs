import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredPages = ["index.html", "products.html", "blog.html", "strategy.html", "marketing.html", "about.html", "privacy.html", "cart.html", "checkout.html", "order-confirmation.html"];
const checkoutPages = ["cart.html", "checkout.html", "order-confirmation.html"];
const requiredFiles = [...requiredPages, "css/style.css", "js/main.js", "README.md", ".nojekyll", "sitemap.xml", "robots.txt", "images/og-image.png", "images/favicon.svg"];
// Outbound links are limited to the canonical site and the social share endpoints. Remote src assets stay forbidden.
const allowedLinkHosts = ["mhasan142200-ai.github.io", "twitter.com", "www.facebook.com", "www.reddit.com", "wa.me"];
const errors = [];

const read = relativePath => readFileSync(join(root, relativePath), "utf8");

for (const file of requiredFiles) {
    if (!existsSync(join(root, file))) errors.push(`Missing required file: ${file}`);
}

const pages = requiredPages.filter(file => existsSync(join(root, file)));
for (const page of pages) {
    const html = read(page);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length) errors.push(`${page} has duplicate IDs: ${[...new Set(duplicates)].join(", ")}`);

    for (const match of html.matchAll(/(href|src)="([^"]+)"/g)) {
        const [, attribute, target] = match;
        if (/^(?:https?:)?\/\//.test(target)) {
            const host = new URL(target, "https://example.invalid").hostname;
            if (attribute === "src" || !allowedLinkHosts.includes(host)) {
                errors.push(`${page} loads a remote asset or link: ${target}`);
            }
            continue;
        }
        if (/^(?:#|mailto:|tel:)/.test(target)) continue;
        const localTarget = target.split(/[?#]/)[0];
        if (localTarget && !existsSync(join(root, localTarget))) {
            errors.push(`${page} references missing local file: ${localTarget}`);
        }
    }

    if (!html.includes('class="skip-link"')) errors.push(`${page} is missing the skip link.`);
    if (!html.includes('id="main-content"')) errors.push(`${page} is missing the main content target.`);
    if (!html.includes('aria-current="page"') && !html.includes('aria-current="step"')) errors.push(`${page} is missing the current-page navigation state.`);
    if (!html.includes('href="strategy.html"')) errors.push(`${page} is missing the Strategy navigation link.`);
    if (!html.includes('href="marketing.html"')) errors.push(`${page} is missing the Marketing navigation link.`);

    // On-page SEO
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || "";
    const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || "";
    if (!title) errors.push(`${page} is missing a meta title.`);
    if (description.length < 70 || description.length > 170) errors.push(`${page} meta description should be 70–170 characters (found ${description.length}).`);
    if ((html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${page} should have exactly one H1.`);
    if (checkoutPages.includes(page)) {
        if (!html.includes('<meta name="robots" content="noindex')) errors.push(`${page} should be marked noindex.`);
    } else {
        for (const tag of ['rel="canonical"', 'property="og:title"', 'property="og:description"', 'property="og:image"', 'name="twitter:card"']) {
            if (!html.includes(tag)) errors.push(`${page} is missing SEO tag: ${tag}`);
        }
    }
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
        if (!/\salt="/.test(image[0])) errors.push(`${page} has an image without alt text: ${image[0]}`);
    }

    // Social media share links
    const socialLinks = (html.match(/data-social-share=/g) || []).length;
    if (socialLinks !== 4) errors.push(`${page} should have 4 social share links, found ${socialLinks}.`);
}

const script = read("js/main.js");
try {
    new Function(script);
} catch (error) {
    errors.push(`JavaScript syntax error: ${error.message}`);
}

const productCount = (script.match(/\n\s*id:\s*\d+,/g) || []).length;
if (productCount < 5) errors.push(`Product catalog has ${productCount} products; at least 5 are required.`);
if (productCount !== 6) errors.push(`Expected 6 NovaTech products, found ${productCount}.`);

const about = read("about.html");
const roster = [
    ["Nadeem Hassan", "Hass3285", "169093285"],
    ["Elias Zubaidi", "Zuba5051", "169065051"],
    ["Awale Hussein", "Huss8976", "169038976"],
    ["Hasan Muhammad", "Hasa9724", "169099724"],
    ["Omeed Attayi", "atta0147", "169060147"]
];

// Nadeem Hassan authored an Assignment 1 blog post but is no longer part of the current team.
const currentTeam = roster.filter(([name]) => name !== "Nadeem Hassan");
for (const member of currentTeam) {
    for (const value of member) {
        if (!about.includes(value)) errors.push(`About page is missing roster value: ${value}`);
    }
}

for (const field of ["image", "alt"]) {
    const count = (script.match(new RegExp(`\\n\\s*${field}: "[^"]+",`, "g")) || []).length;
    if (count !== productCount) errors.push(`Every product needs a ${field} value (found ${count} of ${productCount}).`);
}
for (const match of script.matchAll(/\n\s*image: "([^"]+)",/g)) {
    if (!existsSync(join(root, match[1]))) errors.push(`Product image is missing: ${match[1]}`);
}

const checkout = read("checkout.html");
if (!checkout.includes('id="paypal-button-container"') || !script.includes("loadPayPalSdk") || !script.includes("actions.order.capture")) {
    errors.push("PayPal sandbox checkout is incomplete.");
}
if (!read("order-confirmation.html").includes('id="confirmation-order-id"') || !script.includes("renderConfirmation")) {
    errors.push("Order confirmation page is incomplete.");
}

const blog = read("blog.html").toLowerCase();
if (!blog.includes("purpose") || !blog.includes("roadmap") && !blog.includes("going next")) {
    errors.push("Blog post must explain the website purpose and future direction.");
}

const blogSource = read("blog.html");
const blogPostCount = (blogSource.match(/class="team-blog-post"/g) || []).length;
if (blogPostCount !== 5) {
    errors.push(`Expected 5 individually authored team blog posts, found ${blogPostCount}.`);
}

const guidePosts = [...blogSource.matchAll(/<article class="team-blog-post guide-post" id="([^"]+)"[\s\S]*?<div class="team-post-content">([\s\S]*?)<\/div>/g)];
if (guidePosts.length !== 3) errors.push(`Expected 3 content-marketing blog posts, found ${guidePosts.length}.`);
for (const [, id, content] of guidePosts) {
    const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    if (words < 150 || words > 200) errors.push(`Blog post ${id} should be 150–200 words (found ${words}).`);
}

const shareButtonCount = (blogSource.match(/data-share-post=/g) || []).length;
if (shareButtonCount !== blogPostCount + guidePosts.length || !script.includes("setupShareButtons")) {
    errors.push(`Expected ${blogPostCount + guidePosts.length} working post share controls, found ${shareButtonCount}.`);
}

const marketing = read("marketing.html");
if (!marketing.includes('data-plan-element="audience"') || !marketing.includes('data-plan-element="message"')) {
    errors.push("Content marketing plan must identify the target audience and brand message.");
}
if ((marketing.match(/data-sample-post=/g) || []).length < 3) errors.push("Social strategy needs at least 3 sample posts.");
if ((marketing.match(/data-seo-check/g) || []).length < 8) errors.push("SEO checklist needs at least 8 verified checks.");

const strategy = read("strategy.html");
const commerceFeatureCount = (strategy.match(/data-commerce-feature=/g) || []).length;
const businessElementCount = (strategy.match(/data-business-element=/g) || []).length;
const technologyConceptCount = (strategy.match(/data-technology-concept=/g) || []).length;

if (commerceFeatureCount !== 8) {
    errors.push(`Expected all 8 e-commerce technology features, found ${commerceFeatureCount}.`);
}

if (businessElementCount !== 8) {
    errors.push(`Expected all 8 business-model elements, found ${businessElementCount}.`);
}

if (technologyConceptCount < 6) {
    errors.push(`Expected at least 6 Internet and web technology concepts, found ${technologyConceptCount}.`);
}

for (const requiredConcept of ["B2C", "sales revenue", "value chain", "client/server", "DNS", "HTTPS", "TCP/IP", "cloud hosting", "mobile-commerce"]) {
    if (!strategy.toLowerCase().includes(requiredConcept.toLowerCase())) {
        errors.push(`Strategy page is missing course concept: ${requiredConcept}`);
    }
}

for (const [name, username, studentId] of roster) {
    const authorMarker = `data-author="${name}"`;
    if (!blogSource.includes(authorMarker)) errors.push(`Blog is missing a complete post by ${name}.`);
    if (!blogSource.includes(username) || !blogSource.includes(studentId)) {
        errors.push(`Blog author details are incomplete for ${name}.`);
    }
}

const privacy = read("privacy.html");
if (!privacy.includes('id="clear-site-data"') || !script.includes("setupPrivacyControl")) {
    errors.push("Privacy controls are incomplete.");
}

const unexpectedFiles = readdirSync(root).filter(name => name === ".DS_Store");
if (unexpectedFiles.length) errors.push("Remove .DS_Store before publishing.");

if (errors.length) {
    console.error("Site validation failed:\n");
    errors.forEach(error => console.error(`- ${error}`));
    process.exit(1);
}

console.log(`Site validation passed: ${pages.length} pages, ${productCount} products with images and alt text, ${currentTeam.length} current group members, ${blogPostCount} launch posts and ${guidePosts.length} content-marketing posts with sharing, PayPal sandbox checkout and confirmation, on-page SEO tags, social share links, 8 e-commerce features, 8 business-model elements, technology architecture, and privacy controls verified.`);
