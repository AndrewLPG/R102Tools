# Deploy with GitHub Pages

This repository is ready for automatic deployment as a static GitHub Pages site.

## First deployment

1. Create an empty GitHub repository. A public repository is simplest for a publicly embeddable tool.
2. From this folder, connect and push the prepared project:

   ```sh
   git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. In the GitHub repository, open **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Open **Actions** and confirm that “Deploy static site to GitHub Pages” succeeds.

The resulting URL normally has this form:

```text
https://YOUR-ACCOUNT.github.io/YOUR-REPOSITORY/
```

Every later push to `main` automatically publishes the current `index.html`, `styles.css`, and `app.js`.

## Embed in Notion

1. Open the deployed URL directly and confirm it loads.
2. In Notion, add an `/embed` block.
3. Paste the GitHub Pages URL and choose **Embed link**.
4. Resize the block to approximately 900–1,100 px high.

If Notion displays a link instead of the interactive page, the host is preventing cross-origin framing. GitHub Pages does not support repository-defined custom response headers. In that case, use the same repository with Cloudflare Pages, Netlify, or Vercel and configure an explicit `Content-Security-Policy` that permits your Notion workspace or `https://www.notion.so` as a `frame-ancestor`.

## Release checklist

- Confirm the deployed revision matches the intended source commit.
- Test the public URL in a private browser window.
- Test JSON export and print/PDF output.
- Keep the safety warning and qualified-person review gate visible.
- Record the deployed commit ID with every approved design audit.
- Do not add proprietary ANSUL manual content to a public repository.
