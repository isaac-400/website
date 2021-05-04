#!/bin/sh
# Convert my CV website page to pdf
rm -rf docs/isaac_feldman_cv.pdf
pandoc pages/CV.html -t gfm -o - | tail -n +3 | pandoc - -V linkcolor:blue -V geometry:margin=3cm -V fontsize=12pt -V mainfont="IBM Plex Serif"  -V monofont="IBM Plex Mono" --pdf-engine=xelatex -o docs/isaac_feldman_cv.pdf
