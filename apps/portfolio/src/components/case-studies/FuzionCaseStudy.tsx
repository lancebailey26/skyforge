'use client';

import Link from 'next/link';
import {
  CaseStudyCallout,
  CaseStudyDiagram,
  CaseStudyImage,
  CaseStudySection,
} from './CaseStudyBlocks';
import { metadata } from '@/app/work/fuzion/metadata';

const REPRESENTATIVE_NOTE =
  'Fuzion and the AI mapper were separate projects that shipped together. This write-up focuses on Fuzion — the integration workspace — and how it brought AI-assisted mapping into everyday product workflows. The original Tranztec source code is proprietary.';

const DATA_FLOW_DIAGRAM = `External system (TMS / ERP / telematics)
  ↓  incoming transform
Platform record (canonical schema)
  ↓  outgoing transform
External system

Each connection:
  ├─ which data types flow (Driver, Trip, Order, …)
  ├─ direction per type (in / out / bidirectional / read-only)
  └─ mapping rules at each boundary`;

const WORKSPACE_DIAGRAM = `Fuzion workspace
├─ Home          → "Is everything running?"
├─ Data          → every record on the platform, filterable by type and origin
├─ Logs          → structured detail, related events, AI plain-English summaries
├─ Users         → workspace roles (Admin / User / View only)
├─ Connections   → per-system integration config
│    ├─ Data Flow  → rules per data type; opens AI mapper for a type + direction
│    └─ Settings   → auth, protocol, logging
└─ Onboarding    → five-step first-run setup → review screen`;

const USER_WORKFLOW_DIAGRAM = `New customer
  ↓
Onboarding (pick TMS, credentials, configure data flow)
  ↓
Connection live on Fuzion
  ↓
Need to adjust a mapping?
  ↓
Open connection → Data Flow → pick data type + direction
  ↓
AI mapper (separate project, embedded in Fuzion)
  → describe the change in plain language
  → review what the AI changed
  → publish when satisfied
  ↓
No hand-written transform code required for most changes`;

const HIGHLIGHTS = [
  'Integration workspace for connecting external systems to the Tranztec platform',
  'Brought AI-assisted mapping into a product non-coders could actually use',
  'Six surfaces: Home, Data, Logs, Users, Connections, and Onboarding',
  'Connections as the hub — data flow config with per-type mapping entry points',
  'Implementation time dropped from over a week to under a day',
  'Substantial frontend contribution across the production React app',
];

export function FuzionCaseStudy() {
  return (
    <>
      <div className="case-study-intro">
        <CaseStudyCallout>
          <p>{REPRESENTATIVE_NOTE}</p>
        </CaseStudyCallout>

        {metadata.referenceUrl ? (
          <p className="case-study-meta-bar">
            <a href={metadata.referenceUrl} target="_blank" rel="noopener noreferrer">
              {metadata.referenceLabel ?? 'External reference'}
            </a>
          </p>
        ) : null}
      </div>

      <CaseStudySection id="overview" title="Overview">
        <p>
          Fuzion is Tranztec&apos;s integration workspace — the product customers use to connect external systems (TMS,
          telematics, ERPs) to the Tranztec platform. Before Fuzion, standing up a new integration meant an implementer
          hand-coding field mappings and transformation logic, often for more than a week. Fuzion changed who could do
          that work and how fast they could do it.
        </p>
        <p>
          The product&apos;s bet was not just speed. It was access. By embedding AI-assisted mapping into a structured
          workspace — with clear connection setup, observable data flow, and guardrails around publishing changes — Fuzion
          gave end users a path to handle integration work without writing code. Marketing, support, and operations staff
          could read integration state and make basic mapping changes. Implementers kept deep control when they needed it,
          but they were no longer the only people who could touch a connection.
        </p>
        <p>
          <strong>Anthony Pietramala</strong> designed Fuzion. I worked extensively on the production React application —
          workspace surfaces, connection flows, and the integration points where AI tooling met everyday product UI.
        </p>
        <ul className="case-study-highlights" aria-label="Project highlights">
          {HIGHLIGHTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CaseStudySection>

      <CaseStudySection id="problem" title="The Problem">
        <p>
          Tranztec&apos;s legacy integration product worked, but it was slow and expert-heavy. Connecting a new system
          meant reading two schemas, writing transformation code field by field, and routing every change through people
          who understood the underlying mapping layer. Customers depended on Tranztec implementers for work that, in
          practice, blocked their own teams from self-serving.
        </p>
        <p>
          Leadership&apos;s mandate was direct: bring implementation time down. The product answer was a workspace where
          integrations were visible, configurable, and — critically — where mapping changes could be described in plain
          language instead of hand-authored code.
        </p>
      </CaseStudySection>

      <CaseStudySection id="how-it-worked" title="How Fuzion Worked">
        <p>
          Fuzion is organized around a <strong>workspace</strong>. A customer&apos;s external systems connect through
          individual <strong>connections</strong>, each with its own configuration for what data moves in which direction.
          The data model treats every connection as three layers: data coming in from the external system, data living on
          the platform, and data going back out. Mapping rules sit at those boundaries, per data type — Driver, Trip,
          Order, Truck, Location, and so on.
        </p>
        <CaseStudyDiagram title="Data flow per connection">{DATA_FLOW_DIAGRAM}</CaseStudyDiagram>
        <CaseStudyDiagram title="Workspace layout">{WORKSPACE_DIAGRAM}</CaseStudyDiagram>
        <p>
          Six surfaces made that model usable day to day:
        </p>
        <ul>
          <li>
            <strong>Home</strong> — connection health, log volume by data type, recent activity. Answers &ldquo;is
            everything running?&rdquo; at a glance.
          </li>
          <li>
            <strong>Data</strong> — every record on the platform across connections. Filter by data type and origin;
            trace a record back to its source system.
          </li>
          <li>
            <strong>Logs</strong> — structured detail panels with related-event filters, plus AI-generated plain-English
            summaries that explain what a log entry actually means.
          </li>
          <li>
            <strong>Users</strong> — workspace member management with role-based access (Admin, User, View only).
          </li>
          <li>
            <strong>Connections</strong> — the heart of the product. Each connection has a Data Flow tab (per-type rules
            and mapping entry points) and a Settings tab (auth, protocol, logging).
          </li>
          <li>
            <strong>Onboarding</strong> — a five-step first-run flow: account, TMS selection, credentials, data flow
            configuration, and a review screen with edit links back to any step.
          </li>
        </ul>
        <p>
          Connection navigation lived on the connection screen itself — Data Flow and Settings as top tabs — rather than
          buried in the sidebar. Usability testing showed new users looked for navigation inside the screen they were
          already on; putting tabs there made the product easier to learn without blocking experienced implementers.
        </p>
      </CaseStudySection>

      <CaseStudySection id="ai-workflow" title="Bringing AI Into the Workflow">
        <p>
          The <strong>AI mapper was a separate project</strong> from Fuzion. Fuzion did not invent the mapping AI — it
          integrated that capability into the connection workflow so users could reach it from the product they were
          already in. Inside a connection, on the Data Flow tab, each data type and direction had an entry point into the
          mapper. That is how AI became part of the day-to-day integration experience rather than a standalone tool.
        </p>
        {metadata.imageUrl ? (
          <CaseStudyImage
            src={metadata.imageUrl}
            alt="Fuzion AI mapper — source and target schemas with natural-language mapping"
            caption="The AI mapper at the center of Fuzion’s connection workflow — designed by Anthony Pietramala"
          />
        ) : null}
        <CaseStudyDiagram title="From onboarding to AI-assisted mapping">{USER_WORKFLOW_DIAGRAM}</CaseStudyDiagram>
        <p>
          The mapper workflow, from a user&apos;s perspective: pick a data type and direction, see the source and target
          schemas side by side, describe the change you want in natural language, review what the AI proposed, and publish
          when you are satisfied. Changes stayed in draft until publish. Version history let you revert. An AI/Code toggle
          let implementers drop into the underlying transform when they wanted to verify or hand-edit — the AI augmented
          expertise; it did not replace it.
        </p>
        <p>
          That combination is what made non-coders viable. People who had never written integration code could navigate
          Fuzion, open a connection, understand what data was flowing, and use the mapper to make straightforward changes.
          They were not doing the deep edge-case work an implementer does, but they could read state, ask for a change in
          plain language, and see exactly what moved before anything went live. Usability tests with marketing, sales, and
          support staff confirmed that — a meaningful expansion of who could participate in integration work.
        </p>
        <p>
          AI showed up in Fuzion beyond mapping, too. Log entries could get plain-English summaries so operators did not
          need to parse raw payloads to understand what happened. The product&apos;s identity was AI-assisted
          throughout — but the mapper integration was the piece that directly collapsed the old code-writing bottleneck.
        </p>
      </CaseStudySection>

      <CaseStudySection id="role" title="My Role">
        <p>
          I spent a lot of time on Fuzion&apos;s frontend — turning the designed workspace into shippable UI across
          connection screens, data-flow configuration, onboarding, dashboard and observability surfaces, and the points
          where users entered and left the embedded AI mapper.
        </p>
        <ul>
          <li>Built and refined workspace surfaces — Home, Data, Logs, Connections, Onboarding, Users</li>
          <li>Implemented connection data-flow screens and per-type mapping entry points into the AI mapper</li>
          <li>Shipped connection-scoped tab navigation (Data Flow / Settings) from usability A/B results</li>
          <li>Integrated AI-generated log summaries and related-event filtering in the Logs experience</li>
          <li>Worked in Tranztec&apos;s next-gen monorepo on the shared UI Kit component foundation</li>
        </ul>
        <p>
          The AI mapper itself was owned by a separate team. My contribution was making sure Fuzion presented it clearly
          — users always knew which connection, data type, and direction they were editing, and could move between
          workspace context and AI-assisted mapping without losing the thread.
        </p>
      </CaseStudySection>

      <CaseStudySection id="impact" title="Impact">
        <blockquote className="case-study-impact-quote">
          For integrations the team built on Fuzion, implementation time dropped from over a week to under a day. Internal
          sessions and customer demos went well. The product delivered on speed — and on opening integration work to
          people who had never touched mapping code before.
        </blockquote>
        <ul>
          <li>Implementation time collapsed for teams building integrations on Fuzion</li>
          <li>Non-technical users could navigate the workspace and make basic mapping changes in usability tests</li>
          <li>Implementers could direct and verify AI output instead of hand-authoring every transform from scratch</li>
          <li>Customers with large legacy deployments faced high switching cost to migrate — adoption lagged despite the product working well (see Reflection)</li>
        </ul>
      </CaseStudySection>

      <CaseStudySection id="reflection" title="Reflection">
        <p>
          Fuzion&apos;s product lesson, for me, is about meeting users where they are. The legacy workflow assumed
          implementers and code. Fuzion assumed a workspace — connections you can see, data you can trace, logs you can
          read, and AI you can talk to when a mapping needs to change. Embedding the mapper (a separate project) inside
          that structure is what made AI feel like part of the job, not a bolt-on.
        </p>
        <p>
          The adoption story was harder. Fuzion launched in late 2025 and worked as designed, but most customers did not
          switch. Rebuilding every legacy connection by hand to try the new system was a bet-the-business decision, not a
          pilot. That is a rollout constraint as much as a product one — and it is the main thing I would push to address
          earlier on a replacement platform: lower the cost of trying it.
        </p>
        <p className="case-study-reflection">
          For design research, mapper UX rationale, and the full &ldquo;Launch Death&rdquo; narrative — including the AI
          mapper as its own design centerpiece — see{' '}
          <a href={metadata.referenceUrl} target="_blank" rel="noopener noreferrer">
            Anthony Pietramala&apos;s case study
          </a>
          .
        </p>
        <p className="case-study-footer-nav">
          <Link href="/#reference">← Back to reference work</Link>
        </p>
      </CaseStudySection>
    </>
  );
}
