# Accessibility

I want everyone to be able to read and use luuk.network, whatever device,
browser, input method or assistive technology they use. Building accessible
websites is my work, and my own site should reflect that.

## What I aim for

My goal is to meet WCAG 2.2 at level AA. This is a goal, not a claim: the site
has not been formally evaluated.

- **Semantic HTML first.** Pages are static HTML built from native elements, so
  they keep the keyboard and screen reader behavior browsers already provide.
  JavaScript only enhances them.
- **Keyboard.** Skip links lead to the main content and to the navigation, and
  focused elements show a visible outline.
- **Screen readers.** Every page declares its language, so English and Dutch
  pages are read in the right voice. Decorative icons are hidden from screen
  readers, and links that open a new tab say so.
- **Motion.** Smooth scrolling and animations only run when you have not asked
  your system to reduce motion.
- **Language.** All content is available in English and Dutch.

## Browsers and known limitations

The site aims to work in current versions of Chrome, Edge, Firefox and Safari,
on desktop and on mobile. Some visual touches, such as the divider under the
sticky header and the fades on the carousel, only appear in browsers that
support them.

- The site only has a dark color scheme. If you need a light background, your
  browser's or system's high contrast or reader mode is the workaround for now.
- I have not tested the site in a structured way with assistive technologies,
  and it has not had an audit. There may be barriers I do not know about yet.

## Reporting a barrier

If something on the site gets in your way, I want to know. Please
[open an issue](https://github.com/slimluccii/luuk.network/issues/new/choose)
with the accessibility template. It helps to know:

- the page, and what you were trying to do
- what happened instead
- your browser, operating system and any assistive technology you use

Screenshots or recordings are welcome but never required. You never need to
tell me about a disability.

This is my personal website, and I don't have the time to work on it
continuously. I pick up issues when I can, and barriers that stop someone from
using the site come first.
