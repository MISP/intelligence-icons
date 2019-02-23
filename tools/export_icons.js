/**********************************************************
Copyright Christophe Vandeplas <christophe@vandeplas.com>
License: CC-BY-SA

Documentation: 
- https://illustrator-scripting-guide.readthedocs.io/
- https://www.adobe.com/content/dam/acom/en/devnet/illustrator/pdf/Illustrator_Scripting_Reference_JavaScript_2014.pdf
*********************************************************/


// uncomment to suppress Illustrator warning dialogs
// app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

var pngSizes = [16, 32, 48, 56, 64, 72, 128, 256];

var destFolder, sourceFolder, files, fileType, targetBasePath;
// Select the source folder.
sourceFolder = Folder.selectDialog( 'Select the folder with Illustrator files you want to convert to PNG', '~' );
// If a valid folder is selected
if ( sourceFolder != null )
{
    files = new Array();
    fileType = prompt( 'Select type of Illustrator files to you want to process. Eg: *.ai', ' ' );
    // Get all files matching the pattern
    files = sourceFolder.getFiles( fileType );
    if ( files.length > 0 ) {
        // Get the destination to save the files
        targetBasePath = Folder.selectDialog( 'Select the folder where you want to save the converted PNG files.', '~' );
        for ( j = 0; j < files.length; j++ ) {
            var sourceDoc = app.open(files[j]);
            var fileName = sourceDoc.name;
            var targetFileBase = fileName.split('.').slice(0, -1).join('.');
            // export all sizes as square
            setActiveArtboardByName('square', sourceDoc);  // choose the right artboard
            exportPNGFiles('square', sourceDoc, targetFileBase);
            // FIXME exportSVGFile('square', sourceDoc, targetFileBase);

            // export all sizes as simple
            setActiveArtboardByName('simple', sourceDoc);  // choose the right artboard
            exportPNGFiles('simple', sourceDoc, targetFileBase);
            // FIXME exportSVGFile('simple', sourceDoc, targetFileBase);

            // PDF export has each artboard in a separate page
            exportPDFFile(sourceDoc, targetFileBase);
            // close without saving
            sourceDoc.close(SaveOptions.DONOTSAVECHANGES);
        }
        alert( 'Files are saved in ' + targetBasePath );
    }
    else  {
        alert( 'No matching files found' );
    }
}


function setActiveArtboardByName(artboardName, sourceDoc) {
    for (k = 0; k < sourceDoc.artboards.length; k++) {
        if (sourceDoc.artboards[k].name == artboardName){
            sourceDoc.artboards.setActiveArtboardIndex(k);
            return;
        }
    }
}

function exportPNGFiles(targetType, sourceDoc, targetFileBase) {
    var targetFileExt = 'png';
    for ( i = 0; i < pngSizes.length; i++) {
        targetSize = pngSizes[i];
        var targetFolder = targetBasePath + '/' + targetType + '_' + targetFileExt + '/' + targetSize;
        new Folder(targetFolder).create();
        var targetFullFilename = targetFolder + '/' + targetFileBase + '.' + targetFileExt;
        var targetFile = new File(targetFullFilename);
        var artboardRect = sourceDoc.artboards[sourceDoc.artboards.getActiveArtboardIndex()].artboardRect;
        var artboardSize = artboardRect[2] - artboardRect[0];

        var exportOpts = new ExportOptionsPNG24();
        exportOpts.antiAliasing = true;
        exportOpts.artBoardClipping = true;
        exportOpts.saveAsHTML = false;
        exportOpts.transparency = true;
        exportOpts.horizontalScale = 100.0/artboardSize*targetSize;
        exportOpts.verticalScale = 100.0/artboardSize*targetSize;
        sourceDoc.exportFile(targetFile, ExportType.PNG24, exportOpts);
        
    }
}

function exportSVGFile(targetType, sourceDoc, targetFileBase) {
    // This code is not good
    // See https://graphicdesign.stackexchange.com/questions/39505/illustrator-exporting-svg-viewbox-doesnt-match-artboard-size
    var targetFileExt = 'svg';
    var targetFolder = targetBasePath + '/' + targetType + '_' + targetFileExt;
    new Folder(targetFolder).create();
    var targetFullFilename = targetFolder + '/' + targetFileBase + '.' + targetFileExt;
    var targetFile = new File(targetFullFilename);

    var exportOpts = new ExportOptionsSVG();
    exportOpts.preserveEditability = true;
    exportOpts.embedAllFonts = true;
    exportOpts.embedRasterImages = true;
    exportOpts.fontType = SVGFontType.SVGFONT;
    exportOpts.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
    exportOpts.documentEncoding = SVGDocumentEncoding.UTF8;
    sourceDoc.exportFile(targetFile, ExportType.SVG, exportOpts);
}

function exportPDFFile(sourceDoc, targetFileBase) {
    var targetFileExt = 'pdf';
    var targetFolder = targetBasePath + '/' + targetFileExt;
    new Folder(targetFolder).create();
    var targetFullFilename = targetFolder + '/' + targetFileBase + '.' + targetFileExt;
    var targetFile = new File(targetFullFilename);

    var exportOpts = new PDFSaveOptions();
    exportOpts.preserveEditability = true;
    exportOpts.compatibility = PDFCompatibility.ACROBAT8;
    var flattenerOpts = new PrintFlattenerOptions();
    flattenerOpts.clipComplexRegions = true;
    flattenerOpts.convertTextToOutlines = true;

    exportOpts.flattenerOptions = flattenerOpts;
    sourceDoc.saveAs(targetFile, exportOpts);
}


function hideLayer(layerName, sourceDoc) {
    sourceDoc.layers.getByName(layerName).visible = false;
}

function showLayer(layerName, sourceDoc) {
    sourceDoc.layers.getByName(layerName).visible = true;
}
