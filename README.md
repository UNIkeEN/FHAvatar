# FHAvatar project website

Project page for **FHAvatar: Fast and High-Fidelity Reconstruction of Face-and-Hair Composable 3D Head Avatar from Few Casual Captures**.

- Website: https://unikeen.github.io/FHAvatar-website/
- Paper: https://arxiv.org/abs/2603.23345

## Development

React + TypeScript + Vite, with locally hosted Poppins fonts. Requires Node.js 24 (minimum 22.12).

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

The production site is static. Pushes to `main` build and deploy it through GitHub Actions to GitHub Pages. The Vite base path comes from `GITHUB_REPOSITORY`, so asset URLs work under the repository subdirectory.

## Content

- `src/App.tsx`: authors, paper text, sections, and citation.
- `src/results.json`: all rows of paper Table 1, grouped by input count. Rendered as an accessible HTML table.
- `src/index.css`: responsive layout and purple–pink theme inspired by the paper teaser.
- `public/assets/`: figures rendered from the author's original PDFs, plus the demonstration poster.
- `public/videos/fhavatar-demo.mp4`: original compressed research demonstration (loaded on demand).

The page links to the arXiv paper; no model-code release URL is assumed. Website source is linked separately in the footer.

## Attribution

Design references: [Nerfies](https://nerfies.github.io/) and [indoor-vln-website](https://github.com/UNIkeEN/indoor-vln-website). The website implementation follows the latter's React / TypeScript / Vite stack and local Poppins typography.

Paper and figures are attributed to Yujie Sun, Zhuoqiang Cai, Chaoyue Niu, Jianchuan Chen, Zhiwen Chen, Chengfei Lv, and Fan Wu, as published in [arXiv:2603.23345](https://arxiv.org/abs/2603.23345) under CC BY 4.0. Original video supplied by the author. Poppins is distributed under the SIL Open Font License; see `src/assets/fonts/poppins/OFL.txt`.
