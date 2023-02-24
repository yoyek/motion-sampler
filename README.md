# Motion-Sampler

Visual range cutter for social media videos, great for audio sampling and video shorts.

![motion-sampler1](https://user-images.githubusercontent.com/212794/221181769-b842fa67-8622-4a82-be17-bef7fe5aa48b.jpg)

### Build with
- [React](https://github.com/facebook/react "React.js") / [Next.js](https://github.com/vercel/next.js/ "Next.js")
- [Tailwind.css](https://github.com/tailwindlabs/tailwindcss "Tailwind.css")
- [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static "ffmpeg-static") and [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg "fluent-ffmpeg")
- [youtube-dl-exec](https://github.com/microlinkhq/youtube-dl-exec "youtube-dl-exec")

### Install

```
$ git clone https://github.com/yoyek/motion-sampler.git

$ yarn build
$ yarn start
```

### Notes
- Videos are downloaded in best quality to /storage/source folder
- All data is stored in localstorage, backend loads and cuts videos only
