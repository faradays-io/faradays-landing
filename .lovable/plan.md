

## Align CTA content with Testimonial blockquote

The testimonial blockquote sits in a `max-w-[820px]` centered container, while the CTA section uses a `max-w-[1200px]` outer container with a `max-w-[720px]` inner wrapper. This causes misalignment.

### Change

In `src/components/CtaSection.tsx`, update the outer container's `max-w` from `1200px` to `820px` to match the testimonial section's container width, and remove the inner `max-w-[720px]` wrapper (keeping the flex column layout on the outer div or adjusting accordingly).

Specifically:
- Line 11: Change `max-w-[1200px]` to `max-w-[820px]`
- Line 12: Remove `max-w-[720px]` from the inner div (content will naturally fill the 820px container, matching the blockquote width)

