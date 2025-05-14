# Lessons Learned

- Eleventy configuration must return a configuration object rather than relying on deprecated setter methods like `setHtmlTemplateEngine` or `setTemplateFormats`. Attempts to use those methods resulted in `TypeError` errors.
- Forcing `templateFormats` to include only Liquid did not prevent the RSS plugin's internal "virtual templates" from failing due to Nunjucks defaults. The correct approach was to switch to the manual template method for the RSS feed.
- Liquid templates do not support Nunjucks tags such as `{% set %}`. Every occurrence of `{% set %}` in page or include files (e.g., `tags.liquid`, `blog.liquid`, `index.liquid`) had to be replaced with Liquid's `{% assign %}` syntax.
- Nunjucks `{% set %}` tags were replaced with Liquid `{% assign %}` tags in all templates. For example, in `content/index.liquid`, `{% set postsCount = collections.posts | length %}` was updated to `{% assign postsCount = collections.posts | length %}`.
- Arithmetic operations and slicing in Liquid require specific filters like `minus` and `slice`. For instance, `{% set postslist = collections.posts | head(-1 * numberOfLatestPostsToShow) %}` was updated to `{% assign postslist = collections.posts | slice: 0, numberOfLatestPostsToShow %}`.
- Include paths were updated to use `.liquid` extensions instead of `.njk` to match the new template format.
- Attempts to use non-standard plugin options like `templateConfig` inside the RSS plugin configuration were unsupported. Creating a dedicated Liquid feed template (`_includes/feed.liquid`) and manually adding the necessary Liquid filters (`dateToRfc3339`, `absoluteUrl`, `htmlBaseUrl`) resolved the feed build errors.
- Iterative testing and build attempts highlighted the importance of reading plugin documentation closely and validating each change step-by-step.
- Ensure that the `dir.input`, `dir.includes`, and `dir.layouts` settings in `eleventy.config.js` are correctly configured. Layout paths specified in front matter or data files are resolved _relative to_ the directory defined in `dir.layouts`. If `dir.layouts` is not explicitly set, it defaults to the value of `dir.includes`.
- If Eleventy incorrectly resolves layout paths by prepending the `dir.input` directory (e.g., an error like `Cannot find layout content/_includes/layouts/home.liquid` when `layout: "home.liquid"` was intended to point to `_includes/layouts/home.liquid`), this typically means `dir.layouts` needs to be explicitly defined. For example, set `dir.layouts: "_includes/layouts"` in `eleventy.config.js`. Subsequently, all layout references in front matter and data files must be relative to this path (e.g., `layout: "home.liquid"` for a file at `_includes/layouts/home.liquid`).
- Avoid redundant path segments in layout references. If `dir.layouts` is configured as `"_includes/layouts"`, a layout reference like `layout: "layouts/home.liquid"` would incorrectly attempt to find `_includes/layouts/layouts/home.liquid`. The correct reference in this scenario is `layout: "home.liquid"`.
- Clearing the Eleventy cache (e.g., deleting the `.cache` directory or using the `--clear-cache` CLI flag) generally does not resolve issues stemming from incorrect layout path configurations. Focus on systematically verifying `dir` settings in `eleventy.config.js` and layout values in front matter or data files.
- Investigate Eleventy's path resolution logic further by consulting official documentation if layout issues persist despite careful configuration.
- If Eleventy incorrectly resolves layout paths by prepending the `dir.input` directory (e.g., `content/_includes/layouts/home.liquid` instead of `_includes/layouts/home.liquid`), explicitly define `dir.layouts` in `eleventy.config.js` (e.g., `layouts: "_includes/layouts"`). Subsequently, update all layout references in front matter and data files to be relative to this new `dir.layouts` path (e.g., use `layout: "home.liquid"` if the file is at `_includes/layouts/home.liquid`).

# Bootstrap 5 Integration Plan

## Phase 1: Preparation

- [ ] Create a new git branch: `git checkout -b feature/bootstrap-integration`
- [ ] Document current styling and create screenshots for comparison
- [x] Install Bootstrap dependencies:
  ```bash
  npm i bootstrap@5.3.6
  ```

## Phase 2: Configure Bootstrap Integration

- [x] Update eleventy.config.js:

  - [x] Add passthrough copy for Bootstrap JS files
  - [x] Configure CSS bundling to include Bootstrap styles

- [x] Create a custom Bootstrap import file in `/css/bootstrap.css`:
  ```css
  /* Import Bootstrap components as needed */
  @import "../node_modules/bootstrap/scss/bootstrap.scss";
  ```

## Phase 3: Update Base Layout

- [x] Modify `_includes/layouts/base.liquid`:
  - [x] Add Bootstrap CSS by including it in the head:
    ```html
    <link rel="stylesheet" href="/css/bootstrap.css" />
    ```
  - [x] Add required Bootstrap JS imports before the closing body tag:
    ```html
    <script src="/js/bootstrap.bundle.min.js"></script>
    ```
  - [x] Add viewport meta tag (if not already present):
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ```
  - [x] Apply Bootstrap container structure to main content area

## Phase 4: Create Bootstrap Components

- [x] Create Bootstrap component includes in `_includes/components/`:
  - [x] `navbar.liquid` - Responsive navigation menu
  - [x] `card.liquid` - For blog post listings
  - [x] `pagination.liquid` - For blog pagination
  - [x] `footer.liquid` - Site footer with Bootstrap styling
  - [x] `sidebar.liquid` - Optional sidebar for blog layout
  - [x] `button.liquid` - Reusable button component
  - [x] `form.liquid` - Form component with Bootstrap styling

## Phase 5: Update Template Structure

- [x] Update layout files with Bootstrap classes:

  - [x] Convert `_includes/layouts/base.liquid` to use Bootstrap grid
  - [x] Update `_includes/layouts/home.liquid` with Bootstrap components
  - [x] Modify `_includes/layouts/post.liquid` for Bootstrap styling
  - [x] Update `_includes/postslist.liquid` to use Bootstrap cards

- [x] Update page templates:
  - [x] Apply Bootstrap container/row/column structure
  - [x] Add responsive breakpoints where appropriate
  - [x] Ensure proper spacing using Bootstrap spacing utilities
  - [x] wrapp <main> in <div class="container-lg">…</div> so you get sensible max‑width without changing every template.
  - [x] Namespace your partials—e.g. \_includes/components/bootstrap-navbar.liquid—to make future plugin replacements easier.
  - [x] For buttons, build variants (btn-primary, btn-outline, etc.) into a single button.liquid with a type parameter.

## Phase 6: Add Bootstrap Components

- [x] Implement responsive navigation:

  - [x] Convert existing nav to Bootstrap navbar
  - [x] Add collapsible mobile menu
  - [x] Style active states and hover effects

- [x] Implement blog post cards:

  - [x] Convert post list to Bootstrap cards
  - [x] Add featured image support
  - [x] Style metadata with Bootstrap utilities

- [x] Add additional components:

  - [x] Alerts for special messages
  - [x] Breadcrumb navigation
  - [x] Badge components for tags
  - [x] Pagination controls

  ```

  ```

## Phase 8: Optimize for Performance

- [x] Configure Bootstrap bundle:

  - [x] Include only necessary Bootstrap components
  - [x] Minimize unused CSS with PurgeCSS
  - [x] Configure Eleventy to process SCSS directly

- [x] Lazy load non-critical resources:
  - [x] Add lazy loading to images
  - [x] Defer non-critical JavaScript
  - [x] Use async loading for web fonts

## Phase 10: Documentation & Cleanup

- [ ] Document Bootstrap integration:

  - [ ] Update README.md with Bootstrap information
  - [ ] Document custom components and usage examples
  - [ ] Provide theme customization instructions

- [ ] Clean up project:
  - [ ] Remove unused CSS and JS files
  - [ ] Organize SCSS files properly
  - [ ] Document class naming conventions

## Plan to Fix Layout Path Issue

### Problem

The error `You’re trying to use a layout that does not exist: content/_includes/layouts/home.liquid (via layout: layouts/home.liquid)` indicates Eleventy is incorrectly resolving the layout path by looking inside the `content` (input) directory. Layout paths should be resolved relative to the project root, based on the `dir.includes` and `dir.layouts` configuration.

### Steps to Fix

1.  **Update `eleventy.config.js` Settings**:

    - Ensure `dir.input` is correctly set (e.g., `"content"`).
    - Ensure `dir.includes` is correctly set (e.g., `"_includes"`).
    - **Explicitly set `dir.layouts` to point to your layouts subfolder within `_includes`**. For example, if your layouts are in `_includes/layouts/`, set `layouts: "_includes/layouts"`.

    Example `eleventy.config.js`:

    ```javascript
    export default function (eleventyConfig) {
    	// ... other configurations ...
    	return {
    		// ... other return values ...
    		dir: {
    			input: "content",
    			includes: "_includes",
    			data: "_data", // ensure this is also correct if used
    			layouts: "_includes/layouts", // Explicitly define the layouts directory
    			output: "_site",
    		},
    		// ... other return values ...
    	};
    }
    ```

2.  **Update Layout References in Front Matter and Data Files**:

    - After setting `dir.layouts` as above (e.g., to `"_includes/layouts"`), all layout references in front matter, `.11tydata.js` files, etc., must be **relative to this `dir.layouts` path**.
    - For a layout file located at `_includes/layouts/home.liquid`, the reference should become `layout: "home.liquid"`.
    - For a layout file at `_includes/layouts/subdir/another.liquid`, it should be `layout: "subdir/another.liquid"`.
    - **Do not** use `layouts/home.liquid` if `dir.layouts` already points to `_includes/layouts`.

    Example in a template's front matter:

    ```yaml
    ---
    layout: home.liquid # Assuming home.liquid is in _includes/layouts/
    title: My Page
    ---
    ```

3.  **Update Global/Directory Data Files**:

    - Specifically review `content/content.11tydata.js` (and any other `*.11tydata.js` files).
    - Update the `layout` property according to the rule in Step 2.

    Example `content/content.11tydata.js`:

    ```javascript
    export default {
    	layout: "home.liquid", // Assuming home.liquid is in _includes/layouts/
    };
    ```

4.  **Clear Cache and Rebuild**:

    - Delete the `.cache` directory manually: `rm -rf .cache`.
    - Run `npx eleventy` to rebuild the site.

5.  **Test and Validate**:

    - Verify that the build completes without errors.
    - Check the output to ensure layouts are applied correctly.

6.  **Document the Fix**:
    - Add a note in the `README.md` or project documentation about the correct way to reference layouts, especially emphasizing the relationship between `dir.layouts` and the paths used in front matter/data files.

### Additional Notes

- The key is that layout paths specified in templates/data files are resolved _relative to_ the directory specified in `dir.layouts`. If `dir.layouts` is not set, it defaults to `dir.includes`.
- Avoid redundant path segments. If `dir.layouts` is `_includes/layouts`, then `layout: "home.liquid"` correctly points to `_includes/layouts/home.liquid`. Using `layout: "layouts/home.liquid"` would incorrectly point to `_includes/layouts/layouts/home.liquid`.
- If issues persist, double-check all paths and ensure the `eleventy.config.js` is correctly returning the configuration object.

### Next Steps

- Implement the above plan step by step.
- Test after each change to isolate and resolve the issue.

# Advice from Eleventy expert

Eleventy’s default behavior is to resolve both your `_includes` and `layouts` directories **relative** to whatever you’ve set as your `input` folder. That’s why—even though you pointed `dir.includes` and `dir.layouts` “up” into your project root—Eleventy keeps looking under `content/_includes/layouts`. To place your layouts truly outside of `content`, you have two main approaches:

1. **Use the newer `directories` option** (v3.0.0+), which lets you specify project‑root‑relative paths for all folders, not just ones under `input` ([Eleventy][1]).
2. **Stick with `dir` but nest your includes/layouts inside `content`**, or symlink them there—anything outside will always be prefixed by `content` ([Eleventy][2]).

Below is configuration and debugging advice to get your layouts resolving at `/_includes/layouts/home.liquid` when referencing `layout: "home.liquid"`.

---

## 1. Recommended Configuration

### A. Legacy `dir` (relative to `input`)

```js
// .eleventy.js
module.exports = function (eleventyConfig) {
	return {
		dir: {
			// ⚠️ Relative to your input directory
			input: "content",
			includes: "_includes", // → content/_includes
			layouts: "_includes/layouts", // → content/_includes/layouts
			data: "_data",
			output: "_site",
		},
	};
};
```

- **Why it fails**: Eleventy **always** prepends your `input` folder to `dir.includes` and `dir.layouts` ([Eleventy][2]).
- **When to use**: If you’re comfortable keeping `_includes` and `layouts` inside your content folder.

### B. Modern `directories` (project‑root‑relative)

```js
// .eleventy.js
const path = require("path");

module.exports = function (eleventyConfig) {
	return {
		// Project‑root relative normalized paths
		directories: {
			input: "content",
			includes: "./_includes/", // root/_includes
			layouts: "./_includes/layouts/", // root/_includes/layouts
			data: "./_data/",
			output: "_site",
		},
	};
};
```

- **Key benefit**: Paths are interpreted from your **project root**, not from `content` ([Eleventy][1]).
- **Result**: A `layout: "home.liquid"` lookup now resolves to `/{projectRoot}/_includes/layouts/home.liquid` as desired.

---

## 2. Absolute OS Paths

If you need to point to an arbitrary folder on your filesystem (outside the project tree), you can supply absolute paths via Node’s `path.resolve()`:

```js
// .eleventy.js
const path = require("path");

module.exports = function (eleventyConfig) {
	return {
		directories: {
			input: "content",
			includes: path.resolve(__dirname, "shared/_includes"),
			layouts: path.resolve(__dirname, "shared/_includes/layouts"),
			data: path.resolve(__dirname, "_globalData"),
			output: "_site",
		},
	};
};
```

- Eleventy will honor these **absolute** paths and won’t prepend `content` ([Eleventy][1]).

---

## 3. Debugging Path Resolution

When Eleventy can’t find a layout, it’s invaluable to see exactly **which** directories it thinks it’s using:

1. **Enable debug mode**

   ```bash
   DEBUG=Eleventy* npx eleventy --dryrun
   ```

   This prints out your resolved `input`, `includes`, `layouts`, `data`, and `output` directories, along with the search globs and matched templates ([Eleventy][3]).

2. **Check `.eleventy.js` export**

   - Make sure you’re returning your config object (not mutating it) if you use `directories`.
   - Confirm there are no typos in your paths or in the `layout:` front‑matter key (e.g. extension mistakes) ([W3Things][4]).

3. **Use a Directory Data File**
   You can also place a `content/.11tydata.js` with

   ```js
   export default { layout: "home.liquid" };
   ```

   to force a default layout for all files under `content` ([Eleventy][5]).

---

## 4. Eleventy Docs & Further Reading

- **Layout Resolution**: [https://www.11ty.dev/docs/layouts](https://www.11ty.dev/docs/layouts) ([W3Things][4])
- **Configuration API**: [https://www.11ty.dev/docs/config](https://www.11ty.dev/docs/config) ([Eleventy][2])
- **Debugging**: [https://www.11ty.dev/docs/debugging](https://www.11ty.dev/docs/debugging) ([Eleventy][3])

With the above configuration, Eleventy will correctly locate your `home.liquid` layout in the project‑root `_includes/layouts` folder when you reference `layout: "home.liquid"`.

[1]: https://www.11ty.dev/docs/data-eleventy-supplied/?utm_source=chatgpt.com "Eleventy Supplied Data"
[2]: https://www.11ty.dev/docs/config/?utm_source=chatgpt.com "Configuration — Eleventy"
[3]: https://www.11ty.dev/docs/debugging/?utm_source=chatgpt.com "Debug Mode — Eleventy"
[4]: https://w3things.com/blog/eleventy-layouts-and-templates/?utm_source=chatgpt.com "Eleventy Layout and Template Files: A Complete Guide - W3Things"
[5]: https://v1-0-0.11ty.dev/docs/config/?utm_source=chatgpt.com "Configuration—Eleventy, a simpler static site generator."
