# LandingUK Agent Guidelines

## Purpose

- Build the Sainsbury's Magazine festive 2026 Errazuriz book-club competition landing in this folder (duplicated from `../LandingUK/`).
- Treat the existing MAX landing at `../Landing Page MAX/` as the implementation reference; do not edit that sibling project.
- Keep the user-facing campaign copy in English, even when discussing implementation notes in Spanish.

## Product Requirements

- Use `https://www.errazuriz.com/estate` as the content reference: preserve the wine section and its product information.
- Replace the Estate page header/hero with the supplied reading image treatment, while keeping the rest of the Estate storytelling coherent.
- Remove the “Find Our Wines” section and replace it with the competition form pattern used by the MAX landing at `https://vivir-a-lo-max.vercel.app/`.
- Competition message: “Bring Errazuriz to your book club! Discover Great Stories with Great Wine”.
- Prize copy must state: one case (6 x 75cl) of Errazuriz Gran Reserva Chardonnay, one case (6 x 75cl) of Errazuriz Gran Reserva Pinot Noir, and a set of 6 Errazuriz branded wine glasses.
- Form fields: first name, surname, email address, required Terms & Conditions consent, and optional Errazuriz marketing-email opt-in.

## Assets And Legal Source

- Hero and Estate images are already processed in `assets/` (copied from LandingUK).
- Treat `Recursos/Errazuriz_Book_Club_Prize_Draw_TCs_Sainsburys_Magazine_Festive_2026.pdf` (published as `assets/sainsburys-terms.pdf`) as the authoritative competition terms source. Link the terms from the required consent control and relevant footer/legal area.
- The DOCX with the same name is an editable companion, but the final PDF controls published legal text.
- Do not invent eligibility, dates, privacy language, winner selection, or submission handling. Extract them from the PDF or make the missing dependency explicit before launch.

## Implementation Conventions

- Start by inspecting the MAX files and its form submission approach before choosing a framework or adding dependencies.
- Keep the landing deployable as a small static site unless the repository gains an established build system; avoid adding infrastructure without need.
- Preserve accessible labels, keyboard navigation, visible validation, responsive image sizing, and UK spelling/currency.
- Reuse the MAX form flow only after checking its endpoint/configuration. Never commit secrets or silently point Estate entries at an unapproved production sheet.
- When a command or toolchain is introduced, document the install, build, and test commands in the project README.

## Verification

- Test the form for required fields, invalid email, both checkbox states, terms-link access, and successful/error submission states.
- Check the hero, Estate image, wine section, and form at mobile and desktop widths; confirm images do not distort or overlap text.
- Validate that legal copy matches the authoritative PDF and that no “Find Our Wines” section remains.