const colors = require('tailwindcss/colors')

export const rangeColors = [
  {
    name: 'lime',
    base: colors.lime['500'],
    dark: colors.lime['700'],
    black: colors.lime['900'],
  },
  {
    name: 'emerald',
    base: colors.emerald['500'],
    dark: colors.emerald['700'],
    black: colors.emerald['900'],
  },
  {
    name: 'cyan',
    base: colors.cyan['500'],
    dark: colors.cyan['700'],
    black: colors.cyan['900'],
  },
  {
    name: 'blue',
    base: colors.blue['500'],
    dark: colors.blue['700'],
    black: colors.blue['900'],
  },
  {
    name: 'violet',
    base: colors.violet['500'],
    dark: colors.violet['700'],
    black: colors.violet['900'],
  },
  {
    name: 'fuchsia',
    base: colors.fuchsia['500'],
    dark: colors.fuchsia['700'],
    black: colors.fuchsia['900'],
  },
  {
    name: 'rose',
    base: colors.rose['500'],
    dark: colors.rose['700'],
    black: colors.rose['900'],
  },
  {
    name: 'amber',
    base: colors.amber['500'],
    dark: colors.amber['700'],
    black: colors.amber['900'],
  },
]

export function getColorByName(name) {
  return rangeColors.find(c => c.name === name)
}

export function getNextColor(prevName) {
  if (!prevName) return rangeColors[0]
  const prevIdx = rangeColors.findIndex(c => c.name === prevName) || 0
  return rangeColors[prevIdx+1] || rangeColors[0]
}

export function getNextRangeColor(ranges) {
  if (!ranges || !ranges.length) return rangeColors[0].name
  const lastRange = ranges.reduce((a,b) => a.y > b.y ? a : b)
  const lastColorName = lastRange.color
  return getNextColor(lastColorName).name
}
