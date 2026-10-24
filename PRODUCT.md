# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no build step, no dependencies (confirmed by the user). Served locally through a `.bat` that starts Python's `http.server`; published publicly through GitHub Pages. The user publishes the repo themselves; this project ships the local git repo ready to push plus instructions.

## Users

People who scan a QR code with their phone (primary) and open the page on a mobile browser, plus desktop visitors following the public GitHub link. They arrive curious about GTA VI's launch and about how the page itself was made.

## Product Purpose

A fan-made, GTA VI launch-themed one-page site whose content describes the page itself: how it was built, its responsive behavior, its hover and animation system, how it is served (local `.bat`) and published (GitHub Pages), and how the QR code reaches it. Success: a phone visitor scanning the QR understands within seconds what the page is and enjoys the motion; a desktop visitor sees professional hover craft.

## Positioning

A self-documenting page: the launch theme is the costume, the page's own construction is the subject.

## Capabilities and Constraints

- Mobile-first and fully responsive; QR scan is the main entry.
- The page includes a QR code pointing to its own public GitHub Pages URL (URL configurable in one place; the GitHub username is not known yet).
- Professional hovers and animations; must respect `prefers-reduced-motion`.
- Unofficial fan project: no Rockstar Games logos, trademarks used as branding, or official artwork. Must state it is not affiliated with Rockstar Games or Take-Two.
- Launch facts limited to publicly announced information (release date November 19, 2026; PS5 and Xbox Series X|S; state of Leonida / Vice City; protagonists Lucia and Jason). Assumption from public announcements, to verify.

## Brand Commitments

User-pinned (2026-10-24): Vice City at night ambience in the spirit of the official GTA VI website (rockstargames.com/VI), without its logo, key art or character likeness. Content mixes the official-site structure (Vice City, Leonida places, Lucia & Jason, countdown) with how each part of the page was built.

## Evidence on Hand

No official assets. Six original images generated with Higgsfield for this page (img/, prompts in img/*.webp.json); people only from behind. No testimonials, stats, or pre-order claims may be invented.

## Product Principles

1. The page explains itself honestly; every technical claim on it is true of its own code.
2. Phone first: the QR visitor's experience is the bar.
3. Motion is material, never noise; reduced-motion users get the full content.
4. Fan homage, never impersonation.
