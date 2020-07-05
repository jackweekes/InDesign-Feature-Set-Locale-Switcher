//
// INDESIGN FEATURE SET LOCALE SWITCHER by JACK WEEKES
// 
// VERSION 1.0 
//
// Script UI built using: ScriptUI Dialog Builder at: https://scriptui.joonas.me/
// Based on the findings of Dr Ken Lunde at: https://medium.com/@ken.lunde/adobe-indesign-tips-japanese-cjk-functionality-english-ui-redux-539528e295c6
//


if ($.os.slice(0,3) == "Mac") { // Only runs on macOS
    var PREF_STATIC = "/Presets/applicationpreferences/indesign/applicationpreference.plist" // Location of the applicationpreference.plist file, not including the path to the application
    
    var appPreferenceFull = Folder(app.extractLabel("appPreferenceFolder_ST54RETY54")); // Gets the full applicationpreference.plist as saved in InDesign (if run previously).
    var userAbort = false;
    
    if (!appPreferenceFull.exists) { // can the applicationpreference.plist be found, if not, get the InDesing install location!
        appPreferenceFolder = Folder.selectDialog();
        if (appPreferenceFolder !== null) {
            appPreferenceFull = File(appPreferenceFolder + PREF_STATIC);
            app.insertLabel("appPreferenceFolder_ST54RETY54", appPreferenceFull);
            appPreferenceFull.open('r', undefined, undefined);
            var configXML = appPreferenceFull.read();
            appPreferenceFull.close();
        } else {userAbort = true;}
    }
    
    if (!userAbort) {
        if (configXML == "") {
            alert("Unable to edit \"applicationpreference.plist\", ensure you have write access and try again."); //Please set permissions 
        } else {
            if (app.documents.length == 0) {
                configXML = new XML(configXML);
                dialogShow();
            } else {
                alert("Please close all documents and try again.");
            }   
        }
    }
    
    function dialogShow() {
        // DIALOG
        // ======
        var dialog = new Window("dialog"); 
            dialog.text = "Feature Set Locale Switcher "; 
            dialog.orientation = "row"; 
            dialog.alignChildren = ["center","center"]; 
            dialog.spacing = 10; 
            dialog.margins = 16; 
        
        // PFEATURESET
        // ===========
        var pFeatureSet = dialog.add("panel", undefined, undefined, {name: "pFeatureSet"}); 
            pFeatureSet.text = "Feature Set"; 
            pFeatureSet.orientation = "column"; 
            pFeatureSet.alignChildren = ["left","top"]; 
            pFeatureSet.spacing = 10; 
            pFeatureSet.margins = 10; 
        
        var rROM = pFeatureSet.add("radiobutton", undefined, undefined, {name: "rROM"}); 
            rROM.text = "Roman"; 
             
        
        var rRTL = pFeatureSet.add("radiobutton", undefined, undefined, {name: "rRTL"}); 
            rRTL.text = "Right to Left"; 
        
        var rJPN = pFeatureSet.add("radiobutton", undefined, undefined, {name: "rJPN"}); 
            rJPN.text = "Japanese"; 
        
            if (configXML.dict.string == 256) { // ROMAN
                rROM.enabled = false;
                rRTL.enabled = true;
                rRTL.value = true;
                rJPN.enabled = true;
            } else if (configXML.dict.string == 257) { // JPN
                rROM.enabled = true;
                rROM.value = true;
                rRTL.enabled = true;
                rJPN.enabled = false;
            } else if (configXML.dict.string == 259) { // RTL
                rROM.enabled = true;
                rROM.value = true;
                rRTL.enabled = false;
                rJPN.enabled = true;
            } else { // OTHER
                rROM.enabled = true;
                rROM.value = true;
                rRTL.enabled = true;
                rJPN.enabled = true;
            }
        
        
        // GRPBUTTONS1
        // ===========
        var grpButtons1 = dialog.add("group", undefined, {name: "grpButtons1"}); 
            grpButtons1.orientation = "column"; 
            grpButtons1.alignChildren = ["left","center"]; 
            grpButtons1.spacing = 10; 
            grpButtons1.margins = 0; 
        
        var okButton1 = grpButtons1.add("button", undefined, undefined, {name: "OK"}); 
            okButton1.text = "OK"; 
            okButton1.preferredSize.width = 70; 
            //okButton1.enabled = false;
        
        var cancelButton1 = grpButtons1.add("button", undefined, undefined, {name: "Cancel"}); 
            cancelButton1.text = "Cancel"; 
            cancelButton1.preferredSize.width = 70; 
        
        var updateLocale = dialog.show();
            if (updateLocale == 1) {
                var proceedYesReally = confirm("Are you sure you want to change InDesign's feature set locale? \n\nIf you proceed InDesign will quit.\n\n You will need to relauch InDesign manually.", true);
                if (proceedYesReally == true) {
                    if (rROM.value == true) { // ROMAN
                        saveLocale(256);  
                    } else if (rJPN.value == true) { // JPN
                        saveLocale(257); 
                    } else if (rRTL.value == true) { // RTL 
                        saveLocale(259);    
                    } 
                }
            }
    }
    
    function saveLocale(ver) {
        configXML.dict.string = ver;
        appPreferenceFull.open("W");
        appPreferenceFull.write(configXML.toXMLString());
        appPreferenceFull.close();
        app.quit();
    }
} else {
    alert("This script only works with macOS, Sorry!");
}