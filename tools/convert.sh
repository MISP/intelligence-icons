#!/usr/bin/bash

createsvg() {
  local d
  local svg
  for d in ../ai/*.ai; do
    svg=$(echo "$d" | sed 's/.ai/.svg/')
    pdf=$(echo "$d" | sed 's/.ai/.pdf/')
    output=$(echo "$svg" | sed 's/...//' | sed 's/\.ai/.svg/')
    output_pdf=$(echo "$pdf" | sed 's/...//' | sed 's/\.ai/.pdf/')
    echo "Convert AI to SVG $output ..."
    inkscape --export-text-to-path -f "$d" -l "../$output"
    # PDF export is handled by Illustrator export as Inkscape does not recognize the two artboards/pages in CLI mode
    # echo "Convert AI to PDF $output_pdf ..."
    # inkscape --export-text-to-path -f "$d" -A "../$output_pdf"
  done
}

if [ "$1" != "" ];then
  cd $1
fi

createsvg

