generate_md () {
        name=$(echo $1 | sed -e 's/ /-/g')
        md_output+="![$1](https://github.com/MISP/intelligence-icons/raw/master/square_png/128/$name.png) "
        md_output_simple+="![$1](https://github.com/MISP/intelligence-icons/raw/master/simple_png/128/$name.png) "
}

generate_json () {
        name=$(echo $1 | sed -e 's/ /-/g')
        json_output+=$(printf '{"name": "%s", "source": "%s", "pdf_format": "%s", "png_format_256": "%s"},' "${name}" "https://github.com/MISP/intelligence-icons/blob/master/ai/${name}.ai" "https://github.com/MISP/intelligence-icons/raw/master/pdf/${name}.pdf" "https://raw.githubusercontent.com/MISP/intelligence-icons/master/square_png/256/${name}.png")
}

for d in ../ai/*.ai; do
        filename=$(basename --  "${d}")
        name="${filename%.*}"
        generate_md "${name}"
        generate_json "${name}"
done

echo "### Square format"
echo ${md_output}
echo ""
echo "### Simple format"
echo ${md_output_simple}

x=$(echo ${json_output} | sed -e 's/,$//g')
a=$(echo "["${x}"]")
timestamp=$(date +%Y%m%d)
j=$(echo "{\"icons\": ${a}, \"version\": ${timestamp}, \"description\": \"Manifest file of MISP intelligence icons\"}")
echo "${j}" >../MANIFEST.json
cat ../MANIFEST.json | jq . >../MANIFEST.json.pp
mv ../MANIFEST.json.pp ../MANIFEST.json
