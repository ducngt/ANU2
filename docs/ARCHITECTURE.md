# ANU2 v2.0 Architecture

## Upgrade rule

`V2.0 = v0.1.3 functional superset`

The role-aware operational workspace remains the user-facing model. SBBS is the compositional substrate underneath it.

## Runtime path

Human/User -> Working Context -> Component -> Assembly -> Agent Runtime -> Capability Resolver -> Smart Boxes/Smart Wires -> Policy/Authority -> Execution -> Evidence -> Audit -> University Memory -> Learning.

## First-class Smart Boxes

Identity, Context, Capability Registry, Knowledge, Evidence, Policy, Audit, Provenance, University Memory, Failure, Model Gateway, plus registries for Agents/Tools/Wires.

## Authority

Effective permission is constrained by identity, active role, tier, organization/data scope, capability, resource, action and policy. Role assignments are never automatically unioned.

## GitHub Pages boundary

BrowserStore and client-side authorization are reference implementations. Production deployment must move authoritative identity, scope checks, policy decisions, audit integrity and secret-bearing integrations to a backend.
