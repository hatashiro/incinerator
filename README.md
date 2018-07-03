# Incinerator

![Incinerator of Reg](https://user-images.githubusercontent.com/1013641/42217043-b9d061e8-7efe-11e8-81cb-586f19f88df6.gif)

A PoC implementation of unused code elimination in runtime

## What's this?

It's a proof-of-concept implementation of unused code elemenation, which
means Incinerator checks if a part of code is actually used in *runtime* and
remove unless it is. For the time being, only function blocks are checked.

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

[![Youtube: Incinerator Demo](https://user-images.githubusercontent.com/1013641/42218553-ff288950-7f03-11e8-9a1b-999a682c36de.png)](https://youtu.be/tj1S0QQOuAM)

## How Incinerator works

I recommend reading [the code](index.js), as it's only about 150 line long.

1. Tag every function with a unique ID
1. Check if a function is called in runtime via WebSocket
1. When finished, remove uncalled functions
1. Remove unused variables or undefined symbols manually

Please also consider playing with an [example](example).

## License

[ISC](LICENSE)
