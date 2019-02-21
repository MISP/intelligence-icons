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
            //hideLayer('color');
            //showLayer('background');
            //alert(" Processing " + targetFileBase);
            exportPNGFiles('square', sourceDoc, targetFileBase);
            // export all sizes as simple
            //hideLayer('background');
            //showLayer('color');
            exportPNGFiles('simple', sourceDoc, targetFileBase);
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
    setActiveArtboardByName(targetType, sourceDoc);  // choose the right artboard
    for ( i = 0; i < pngSizes.length; i++) {
        targetFileSize = pngSizes[i];
        var targetFolder = targetBasePath + '/' + targetType + '_' + targetFileExt + '/' + targetFileSize;
        new Folder(targetFolder).create();
        var targetFullFilename = targetFolder + '/' + targetFileBase + '.' + targetFileExt;
        var targetFile = new File(targetFullFilename);
        sourceDoc.exportFile(targetFile, ExportType.PNG24, getPNGOptions(targetFileSize, sourceDoc));
        
    }
}

function hideLayer(layerName, sourceDoc) {
    sourceDoc.layers.getByName(layerName).visible = false;
}

function showLayer(layerName, sourceDoc) {
    sourceDoc.layers.getByName(layerName).visible = true;
}

function getPNGOptions(size, sourceDoc) {
    var artboardRect = sourceDoc.artboards[sourceDoc.artboards.getActiveArtboardIndex()].artboardRect;
    var artboardSize = artboardRect[2] - artboardRect[0];
    var pngExportOpts = new ExportOptionsPNG24();
    pngExportOpts.antiAliasing = true;
    pngExportOpts.artBoardClipping = true;
    // pngExportOpts.matte = true;
    // pngExportOpts.matteColor = 0, 0, 0;
    pngExportOpts.saveAsHTML = false;
    pngExportOpts.transparency = true;
    pngExportOpts.horizontalScale = 100.0/artboardSize*size;
    pngExportOpts.verticalScale = 100.0/artboardSize*size;
    return pngExportOpts;
}