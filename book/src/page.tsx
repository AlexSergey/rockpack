import type { ReactElement } from 'react';

import { useEffect } from 'react';

import img from '../readme_assets/rockpack_starter_1.v8.png';
import Github from './assets/github.component.svg';
import LogoComponent from './assets/logo.component.svg';
import * as styles from './assets/styles/page.module.scss';
import { Code } from './code';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import codeCreateExample from './code-samples/create.example';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import codeInstallationExample from './code-samples/installation.example';

export const Page = (): ReactElement => {
  const hash = window?.location?.hash;

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash);

      if (element) {
        element.scrollIntoView({ behavior: 'instant' });
      }
    }
  }, [hash]);

  return (
    <div className={styles.page}>
      <div>
        <LogoComponent />
        <a className={styles.github} href="https://github.com/AlexSergey/rockpack" rel="noreferrer" target="_blank">
          <Github />
        </a>
        <p>
          <strong>Rockpack</strong> is a zero-configuration toolkit for building React applications — with full support
          for <strong>Server-Side Rendering (SSR)</strong>, bundling, linting, and testing. In minutes, you can have a
          modern React app with production-ready quality gates, preconfigured tooling, and built-in support for
          AI-assisted development.
        </p>
        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Zero-config setup</strong>: Scaffold a complete React app with a single command.
          </li>
          <li>
            <strong>SSR out of the box</strong>: Universal rendering with hydration and a Node.js server, no manual
            configuration needed.
          </li>
          <li>
            <strong>Production-ready quality gates</strong>: Enforced ESLint, Prettier, TypeScript, and Jest conventions
            from day one.
          </li>
          <li>
            <strong>Test coverage included</strong>: Every project template ships with a configured Jest setup, so
            AI-generated code is validated immediately — before it ever reaches code review.
          </li>
          <li>
            <strong>AI-first development</strong>: Preconfigured <code>CLAUDE.md</code> with strict quality rules and
            cost-saving conventions makes working with AI tools like Claude Code fast, reliable, and economical.
          </li>
          <li>
            <strong>Extensible</strong>: Customize Webpack, ESLint, or Jest without ejecting.
          </li>
        </ul>
      </div>

      <div>
        <h2>AI-Assisted Development</h2>
        <p>
          Rockpack is designed to make AI-assisted development <strong>safe, fast, and cost-efficient</strong>.
        </p>
        <p>
          Beyond tooling, Rockpack establishes a <strong>baseline architecture</strong> — consistent project structure,
          naming conventions, and module boundaries — that AI models can reason about reliably. A well-structured
          codebase dramatically improves the quality of AI-generated code because the model has clear patterns to follow
          and fewer ambiguous decisions to make.
        </p>
        <p>
          The combination of a defined architecture, test coverage, strict quality gates, and a well-tuned{' '}
          <code>CLAUDE.md</code> means AI tools like Claude Code can contribute to your codebase without introducing
          regressions or inconsistencies.
        </p>
        <p>
          The <code>CLAUDE.md</code> configuration is optimized for:
        </p>
        <ul>
          <li>
            <strong>Minimal context usage</strong> — rules guide the AI to read only what is relevant, reducing token
            consumption
          </li>
          <li>
            <strong>Cost-efficient workflows</strong> — targeted test runs instead of full-suite scans for isolated
            changes
          </li>
          <li>
            <strong>Architecture consistency</strong> — the AI preserves existing patterns instead of introducing
            unnecessary abstractions
          </li>
          <li>
            <strong>Safe incremental changes</strong> — small, predictable diffs that are easy to review
          </li>
          <li>
            <strong>Quality enforcement</strong> — ESLint, TypeScript strict mode, and Jest act as automated reviewers
            on every AI-generated change
          </li>
        </ul>
      </div>

      <h2 id="#getting_started">Getting Started</h2>
      <p>
        The easiest way to start is using the{' '}
        <a href="https://github.com/AlexSergey/rockpack/tree/master/packages/starter">@rockpack/starter</a> CLI. It
        scaffolds a fully configured project in a single command and supports the following application types:
      </p>

      <ul>
        <li>React SPA — client-side app with Webpack, TypeScript, ESLint, and Jest</li>
        <li>React SPA + SSR — universal app with server-side rendering and hydration</li>
        <li>React Component — NPM-ready component with TypeScript declarations</li>
        <li>UMD Library — framework-agnostic library for NPM</li>
      </ul>

      <p>1. Installation:</p>

      <Code code={codeInstallationExample as string} language="bash" />

      <p>2. Creating an app:</p>

      <Code code={codeCreateExample as string} language="bash" />

      <p>3. Select the type of application and the required modules:</p>

      <img alt="Rockpack CLI" className="flexible-image" src={img} style={{ width: '100%' }} />

      <div>License MIT, {new Date().getFullYear()}</div>
    </div>
  );
};
