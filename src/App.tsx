import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Check, Copy, FileText, Play, Quote } from 'lucide-react'
import { SiArxiv } from 'react-icons/si'
import results from './results.json'
import figures from './figures.json'
import ablationResults from './ablation.json'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
const sections = [['overview', 'Overview'], ['abstract', 'Abstract'], ['video', 'Video'], ['method', 'Method'], ['results', 'Results'], ['applications', 'Applications'], ['citation', 'Citation']]
const authors = [
  { name: 'Yujie Sun', affiliation: '1,2*', href: 'https://unikeen.github.io/' },
  { name: 'Zhuoqiang Cai', affiliation: '1,2*' },
  { name: 'Chaoyue Niu', affiliation: '1†' },
  { name: 'Jianchuan Chen', affiliation: '2' },
  { name: 'Zhiwen Chen', affiliation: '2' },
  { name: 'Chengfei Lv', affiliation: '2' },
  { name: 'Fan Wu', affiliation: '1' },
]
const bibtex = `@inproceedings{Sun_2026_CVPR,
  title   = {FHAvatar: Fast and High-Fidelity Reconstruction of
             Face-and-Hair Composable 3D Head Avatar from Few Casual Captures},
  author  = {Sun, Yujie and Cai, Zhuoqiang and Niu, Chaoyue and
             Chen, Jianchuan and Chen, Zhiwen and Lv, Chengfei and Wu, Fan},
  booktitle = {Proceedings of the IEEE/CVF Conference on
               Computer Vision and Pattern Recognition (CVPR)},
  month   = {June},
  year    = {2026},
  pages   = {4132--4144}
}`

type FigureName = keyof typeof figures

function Figure({ name, alt, eager = false }: { name: FigureName; alt: string; eager?: boolean }) {
  const { width, height, caption } = figures[name]
  return <figure className={`paper-figure figure-${name}`}>
    <a href={asset(`assets/${name}.png`)} target="_blank" rel="noreferrer" aria-label={`View full-size figure: ${alt}`}>
      <img src={asset(`assets/${name}.png`)} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </a>
    <figcaption>{caption}</figcaption>
  </figure>
}

function ExpandableFigure({ title, name, alt, description, children }: { title: string; name: FigureName; alt: string; description?: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <details className="result-disclosure" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>{title}<span className="disclosure-icon" aria-hidden="true">+</span></summary>
    {open && <div className="disclosure-content">
      {description && <p className="section-intro">{description}</p>}
      {children}
      <Figure name={name} alt={alt} eager />
    </div>}
  </details>
}

function AblationTable() {
  return <div className="table-scroll ablation-table" tabIndex={0} role="region" aria-label="Ablation study results">
    <table>
      <caption>Table 2. Ablation Study.</caption>
      <thead><tr>{['Method', 'PSNR ↑', 'SSIM ↑', 'LPIPS ↓'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody>{ablationResults.map(([method, ...metrics]) => <tr key={method} className={method === 'Full' ? 'ours' : ''}>
        <th scope="row">{method}</th>{metrics.map((value, index) => <td key={index}>{value}</td>)}
      </tr>)}</tbody>
    </table>
  </div>
}

function ResultsTable() {
  const [frames, setFrames] = useState<keyof typeof results>('6')
  const rows = results[frames]
  return <>
    <div className="table-controls" role="group" aria-label="Number of input frames">
      <span>Input frames</span>
      {(['1', '3', '6', '16'] as const).map(value => <button key={value} aria-pressed={frames === value} onClick={() => setFrames(value)}>{value}</button>)}
    </div>
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Reconstruction benchmark results, scroll horizontally on small screens">
      <table>
        <caption>Reconstruction from {frames} input {frames === '1' ? 'frame' : 'frames'} · Table 1 in the paper</caption>
        <thead><tr>{['Method', 'PSNR ↑', 'SSIM ↑', 'LPIPS ↓', 'AKD ↓', 'CSIM ↑', 'Time ↓', 'FPS ↑'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row[0]} className={row[0].startsWith('Ours') ? 'ours' : ''}>{row.map((cell, index) => index === 0 ? <th key={index} scope="row">{cell.replace('Ours', 'FHAvatar')}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <p className="table-note">Evaluation on an NVIDIA RTX 4090 (24 GB). Modeling time excludes driving-parameter estimation; FPS measures animation rendering. ↑ Higher is better. ↓ Lower is better. All values are reported in the paper.</p>
  </>
}

function App() {
  const [active, setActive] = useState('overview')
  const [copyStatus, setCopyStatus] = useState('Copy BibTeX')
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) })
    }, { rootMargin: '-10% 0px -55% 0px', threshold: 0 })
    sections.forEach(([id]) => { const node = document.getElementById(id); if (node) observer.observe(node) })
    return () => { observer.disconnect(); clearTimeout(copyTimer.current) }
  }, [])
  async function copyCitation() {
    try { await navigator.clipboard.writeText(bibtex); setCopyStatus('Copied!') }
    catch { setCopyStatus('Select and copy the text below') }
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopyStatus('Copy BibTeX'), 3000)
  }
  return <>
    <a className="skip-link" href="#abstract">Skip to content</a>
    <nav className="section-nav" aria-label="Page sections">
      {sections.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'location' : undefined}><span className="nav-line" /><span className="nav-label">{label}</span></a>)}
    </nav>
    <main>
      <section id="overview" className="hero" aria-labelledby="project-title">
        <div className="container">
          <h1 id="project-title"><span className="project-name"><strong>FH</strong><span>Avatar</span></span>: Fast and High-Fidelity Reconstruction of Face-and-Hair Composable 3D Head Avatar from Few Casual Captures</h1>
          <p className="venue">CVPR 2026</p>
          <div className="authors">{authors.map(author => <span className="author" key={author.name}>{author.href ? <a href={author.href}>{author.name}</a> : <span>{author.name}</span>}<sup>{author.affiliation}</sup></span>)}</div>
          <p className="affiliations"><span><sup>1</sup> Shanghai Jiao Tong University</span><span><sup>2</sup> Alibaba Group</span></p>
          <p className="author-notes">* Intern at Alibaba Group. <span>† Corresponding author.</span></p>
          <nav className="project-links" aria-label="Project resources">
            <a className="pill primary" href="https://arxiv.org/pdf/2603.23345"><FileText size={17} /> Paper <ArrowUpRight size={14} /></a>
            <a className="pill" href="https://arxiv.org/abs/2603.23345"><SiArxiv size={19} /> arXiv</a>
            <a className="pill" href="#video"><Play size={17} /> Video</a>
            <a className="pill" href="#citation"><Quote size={17} /> BibTeX</a>
          </nav>
          <div className="teaser"><Figure name="teaser" eager alt="FHAvatar reconstructs separate face and hair components from casual phone captures, enabling animation, hairstyle transfer and stylized editing." /></div>
          <div className="highlights">
            <div><strong>Few captures</strong><span>Flexible views & expressions</span></div>
            <div><strong>Face + hair</strong><span>Explicitly composable Gaussians</span></div>
            <div><strong>Real-time</strong><span>Novel-view & expression animation</span></div>
          </div>
        </div>
      </section>

      <section id="abstract" className="section shaded" aria-labelledby="abstract-title"><div className="reading-width">
        <h2 id="abstract-title">Abstract</h2>
        <p>We present <strong>FHAvatar</strong>, a novel framework for reconstructing 3D Gaussian avatars with composable face and hair components from an arbitrary number of views. Unlike previous approaches that couple facial and hair representations within a unified modeling process, we explicitly decouple two components in texture space by representing the face with <strong>planar Gaussians</strong> and the hair with <strong>strand-based Gaussians</strong>. To overcome the limitations of existing methods that rely on dense multi-view captures or costly per-identity optimization, we propose an aggregated transformer backbone to learn geometry-aware cross-view priors and head-hair structural coherence from multi-view datasets, enabling effective and efficient feature extraction and fusion from few casual captures. Extensive quantitative and qualitative experiments demonstrate that FHAvatar achieves state-of-the-art reconstruction quality from only a few observations of new identities within minutes, while supporting real-time animation, convenient hairstyle transfer, and stylized editing, broadening the accessibility and applicability of digital avatar creation.</p>
      </div></section>

      <section id="video" className="section" aria-labelledby="video-title"><div className="container">
        <h2 id="video-title">Video Presentation</h2>
        <p className="section-intro">From casual captures to expressive, editable 3D head avatars.</p>
        <video className="demo-video" controls playsInline preload="none" poster={asset('assets/video-poster.jpg')} aria-label="FHAvatar research demonstration">
          <source src={asset('videos/fhavatar-demo.mp4')} type="video/mp4" />
          Your browser does not support embedded video. <a href={asset('videos/fhavatar-demo.mp4')}>Download the demonstration.</a>
        </video>
      </div></section>

      <section id="method" className="section shaded" aria-labelledby="method-title"><div className="container">
        <h2 id="method-title">Method</h2>
        <p className="section-intro">An aggregated transformer brings arbitrary views together. Two dedicated branches reconstruct face and hair in UV space.</p>
        <Figure name="pipeline" alt="Architecture of FHAvatar: image and geometry tokenization, aggregated transformer, and separate face and strand-based hair Gaussian decoders." />
        <div className="method-steps">
          <div><span className="step-number">01</span><h3>Feature Tokenizer</h3><p>Image features, a template head mesh, and hair priors encode appearance and geometry from a variable number of casual images.</p></div>
          <div><span className="step-number">02</span><h3>Multi-View Fusion and Gaussian Decoding</h3><p>Cross-view attention fuses the observations. Dedicated decoders preserve the distinct geometry of facial surfaces and hair strands.</p></div>
          <div><span className="step-number">03</span><h3>Optional Fast Refinement</h3><p>Optional fast refinement recovers identity-specific details. The resulting Gaussians follow the head mesh for real-time animation.</p></div>
        </div>
      </div></section>

      <section id="results" className="section" aria-labelledby="results-title"><div className="container">
        <h2 id="results-title">Main Results</h2>
        <p className="section-intro">Novel identities, viewpoints, and expressions—from single images to multiple casual captures.</p>
        <Figure name="comparison" alt="Qualitative reconstruction comparison between FHAvatar, LAM, GAGAvatar, DiffusionRig, FlashAvatar, GaussianAvatars and MeGA, alongside ground truth." />
        <h3 className="subsection-title">Quantitative Results</h3>
        <ResultsTable />
        <div className="additional-results">
          <ExpandableFigure title="Incremental Reconstruction" name="input-views"
            description="A single model handles different input counts. Additional observations progressively reveal finer facial details."
            alt="PSNR and SSIM versus the number of input frames, with facial detail comparisons for 3 and 10 frames." />
          <ExpandableFigure title="Ablation Study" name="ablation"
            alt="Comparisons without the hair branch, finetuning, or region loss, alongside the full model and ground truth.">
            <AblationTable />
          </ExpandableFigure>
        </div>
      </div></section>

      <section id="applications" className="section shaded" aria-labelledby="applications-title"><div className="container">
        <h2 id="applications-title">More Applications</h2>
        <p className="section-intro">Explicit face–hair separation and UV-space binding make avatars easy to personalize.</p>
        <div className="applications-grid">
          <article><h3>Hairstyle Transferring</h3><p>Compose one avatar’s face with another’s hair while retaining the target identity and animation controls.</p><Figure name="hair-transfer" alt="Hairstyle transfer between reconstructed avatars of different identities." /></article>
          <article><h3>Convenient Face Stylize Editing</h3><p>Edit the 2D texture map to customize the 3D avatar, without running reconstruction again.</p><Figure name="stylized-editing" alt="Texture edits producing face paint and stylized appearances that remain consistent across views." /></article>
        </div>
        <h3 className="subsection-title">Cases of Challenging Hairstyles</h3>
        <Figure name="hairstyles" alt="Additional FHAvatar reconstruction examples with long, wavy and curly hair." />
      </div></section>

      <section id="citation" className="section" aria-labelledby="citation-title"><div className="reading-width">
        <div className="citation-heading"><h2 id="citation-title">BibTeX</h2><button className="copy-button" onClick={copyCitation}>{copyStatus === 'Copied!' ? <Check size={16} /> : <Copy size={16} />}<span aria-live="polite">{copyStatus}</span></button></div>
        <pre><code>{bibtex}</code></pre>
      </div></section>
    </main>
    <footer><p>Page design inspired by <a href="https://nerfies.github.io/">Nerfies</a>. <a href="https://github.com/UNIkeEN/FHAvatar">Website source</a>.</p><p><a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p></footer>
  </>
}

export default App
