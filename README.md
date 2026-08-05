# R-102 Design Assistant

A dependency-free, embeddable preliminary design worksheet for ANSUL R-102 restaurant fire suppression systems.

## Safety and calculation scope

This is **design assistance only**. It does not select or certify nozzles, determine appliance coverage, validate distribution piping, or replace the latest ANSUL manual, product listings, applicable codes, AHJ requirements, or review by an ANSUL-trained authorised person.

The first version deliberately calculates only an auditable capacity balance:

```text
required flow points = sum(flow points entered for every hazard)
available flow points = controlled-manual tank capacity − design reserve
margin = available − required
```

The designer enters the hazard type and cooking-area dimensions. The tool filters the encoded appliance-specific, single-nozzle rules from ANSUL R-102 Manual Part No. 418087, Rev. 13, ranks compatible options by flow-point demand, and shows each option's allowable nozzle-tip height range. The selected rule, limits, height range, page and figure are retained in the audit export. Pipe length, fittings, elevation, detection and interfaces are captured but not automatically accepted.

Current suggestion coverage includes single-nozzle, appliance-specific rules for fryers without dripboards, unobstructed ranges, griddles, woks, and several char-broiler types. It does not automate multiple-nozzle modularisation, fryer dripboards, overlapping protection, listed model-specific applications, obstruction variants, nozzle positioning/aiming or distribution piping.

## Required inputs

- Project, site, designer, jurisdiction, design approach, manual part/revision/date
- Each supported appliance: tag, specific type and cooking dimensions
- A user-selected nozzle from the compatible Rev. 13 suggestions
- Tank/system model, controlled-manual flow-point capacity and reserve
- Distribution-pipe length, fittings and elevation for audit
- Duct, plenum, shutdown, manual actuation, detection and alarm-interface review flags

## Output

- Live capacity summary and deterministic validation list
- Local draft persistence in the browser
- Complete JSON audit export containing inputs, formula, results, validations, timestamp and approval status
- Print-friendly report / PDF

## Run locally

Open `index.html`, or serve the folder from any static host. No build step or external dependency is required.

## Deploy and embed in Notion

This project includes a GitHub Actions workflow that deploys the static site to GitHub Pages after every push to `main`. See `DEPLOYMENT.md` for the complete first-deployment and Notion embedding procedure.

For another static host:

1. Deploy these files to a static HTTPS host such as Cloudflare Pages, Netlify, Vercel or an internal server.
2. Ensure the host permits framing in Notion (`Content-Security-Policy: frame-ancestors https://www.notion.so https://*.notion.site` or an equivalent policy; do not send `X-Frame-Options: DENY/SAMEORIGIN`).
3. In Notion, add an `/embed` block and paste the public HTTPS URL.
4. Allow roughly 900–1,100 px height for comfortable use.

Important: browser storage belongs to the embedded origin and may be cleared. The exported JSON is the durable audit record. For production, pin the deployed app version and store approved exports in the project record.

## Recommended next phase

After an authorised designer supplies a licensed, current rule dataset, add a versioned rule library for nozzle/application limits and distribution-piping validation. Each rule should include jurisdiction, manual part number, revision/date, section/table, effective date and a checksum. Never silently carry rules between manual revisions.
