#!/usr/bin/bash

createsvg() {
  local d
  local svg
  for d in ../ai/*.ai; do
    svg=$(echo "$d" | sed 's/.ai/.svg/')
    echo "creating $svg ..."
    output=$(echo "$svg" | sed 's/...//' | sed 's/\.ai/.svg/')
    echo "$output"
    inkscape -f "$d" -l "../$output"
  done
}

if [ "$1" != "" ];then
  cd $1
fi

createsvg

