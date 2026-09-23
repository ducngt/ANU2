# ANU2 v2.0 architecture

## Core distinction

ANU Manifesto = institutional operating principles and constraints.
SBBS Manifesto = software composition model.

## SBBS primitives

1. Smart Box: a capability boundary with stable contract and replaceable implementation.
2. Smart Wire: a typed/policy-aware connection between boxes.
3. Assembly: orchestration of boxes/wires for a business outcome.
4. Component: presentation and human interaction.

## Current reference boxes

- SBBox-Identity
- SBBox-CapabilityRegistry
- SBBox-WireRegistry
- SBBox-Policy
- SBBox-Audit

## Current assembly

- AdminGovernance Assembly

## Required next boxes for institutional parity

- Knowledge, Evidence, Data Trust, Provenance, University Memory
- Agent Runtime, Model Gateway, Decision, Handoff/Failure, Learning/Evolution

## Authority invariant

Capability and Authority are evaluated independently. `SYSTEM_ADMIN` is platform authority and is not sufficient for institutional decision approval.
