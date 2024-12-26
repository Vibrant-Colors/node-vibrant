---
id: getColorDiffStatus
title: getColorDiffStatus
---

# Function: getColorDiffStatus()

```ts
function getColorDiffStatus(d): string
```

Gets a string to describe the meaning of the color diff. Used in tests.

Delta E  | Perception                             | Returns
-------- | -------------------------------------- | -----------
<= 1.0   | Not perceptible by human eyes.         | `"Perfect"`
1 - 2    | Perceptible through close observation. | `"Close"`
2 - 10   | Perceptible at a glance.               | `"Good"`
11 - 49  | Colors are more similar than opposite  | `"Similar"`
50 - 100 | Colors are exact opposite              | `Wrong`

## Parameters

### d

`number`

## Returns

`string`

## Defined in

[converter.ts:210](https://github.com/Vibrant-Colors/node-vibrant/blob/main/packages/vibrant-color/src/converter.ts#L210)
