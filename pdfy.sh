#!/bin/sh
# Convert my CV website page to pdf
pandoc pages/CV.html -t gfm -o - | tail -n +3 | pandoc - -o docs/isaac_feldman_cv.pdf
