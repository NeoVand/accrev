# Third-party notices

## Voicebook speech-engine implementation

Parts of the local speech worker, Supertonic adapter, resumable model download cache,
and Hugging Face fetch adapter are adapted from
[NeoVand/voicebook](https://github.com/NeoVand/voicebook), revision
`0024ef68ad7278e61985313d6c319b79896c8cf4`.

Copyright (c) 2026 NeoVand

Licensed under the MIT License:

> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

## Supertonic browser inference reference

- Purpose: four-session ONNX inference, text normalization, generation steps,
  model-level speaking pace, and voice-style loading.
- Source: [supertone-inc/supertonic](https://github.com/supertone-inc/supertonic)
- License: MIT for sample code.
- Model: [Supertone/supertonic-3](https://huggingface.co/Supertone/supertonic-3)
  at revision `3cadd1ee6394adea1bd021217a0e650ede09a323`.
- Model license: OpenRAIL-M. The app requires users to review and accept the
  model terms before starting the model download.

The model artifacts are downloaded by each user's browser and are not
redistributed in this repository.
