# mq-portal

A custom element to re-arrange the DOM based on media queries

## Rationale

Because MS Edge doesn't support `display: contents` sufficiently yet, using
`display: grid` and `display: flex` are insufficient to get a two-column layout
where the parts interleave on mobile but have no vertical gaps on larger
screens — a variation on the CSS Masonry problem.

This gives us the ability to rearrange the DOM declaratively and restore it
(with some caveats) when the query no longer applies.

## Use

Import this module, then

```html
<mq-portal media="(max-width: 640px)" match=".target"></mq-portal>

Some other content

<div class="target">
This moves
</div>
```

Below 640px width, the DOM looks like this:

```html
<mq-portal media="(max-width: 640px)" match=".target">
    <div class="target">
    This moves
    </div>
</mq-portal>

Some other content
```
