# Incinerator

![Incinerator of Reg](https://user-images.githubusercontent.com/1013641/42217043-b9d061e8-7efe-11e8-81cb-586f19f88df6.gif)

A PoC implementation of unused code elimination in runtime

## What's this?

It's a proof-of-concept implementation of unused code elemenation, which
means Incinerator checks if a part of code is actually used in *runtime* and
removes it if unused. For the time being, only function blocks are checked.

## Install

```shell
npm install incinerator
```

## How to use

Please run `incinerator` with actual runtime environment, for example,
`webpack --watch`.

```shell
incinerator src/
```

## Demo

The following is a link to the demo of an [example](example) with Chart.js,
where bundle size is reduced from **~400K** to **~80K**.

[![Youtube: Incinerator Demo](https://user-images.githubusercontent.com/1013641/42240220-8d0011b6-7f41-11e8-94b4-c2532bc192e4.png)](https://youtu.be/OjHFX_utqBM)

## How Incinerator works

I recommend reading [the code](index.js), as it's only ~200 lines long.

1. Tag every function with a unique ID
1. Check if a function is called in runtime via WebSocket
1. When finished, empty uncalled functions
1. Remove unused top-level variables to remove unused dependencies

Please also consider playing with an [example](example).

## License

[ISC](LICENSE)
