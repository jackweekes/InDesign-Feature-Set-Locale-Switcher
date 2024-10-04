//
// INDESIGN FEATURE SET LOCALE SWITCHER by JACK WEEKES
// 
// VERSION 2.1
//
// Script UI built using: ScriptUI Dialog Builder at: https://scriptui.joonas.me/
// Based on the findings of Dr Ken Lunde at: https://medium.com/@ken.lunde/adobe-indesign-tips-japanese-cjk-functionality-english-ui-redux-539528e295c6
//
const appVersion = "2.1";

if ($.os.slice(0,3) == "Mac") { // macOS
    var PREF_STATIC = "/Presets/applicationpreferences/indesign/applicationpreference.plist" // Location of the applicationpreference.plist file, not including the path to the application
    var appPreferenceFull = Folder(app.extractLabel("appPreferenceFolder_ST54RETY54")); // Gets the full applicationpreference.plist as saved in InDesign (if run previously).
    var userAbort = false;
    
    if (!appPreferenceFull.exists) { // can the applicationpreference.plist be found, if not, get the InDesing install location!
        appPreferenceFolder = Folder.selectDialog("Please select the folder where this version of InDesign is located");
        if (appPreferenceFolder !== null) {
            appPreferenceFull = File(appPreferenceFolder + PREF_STATIC);
            app.insertLabel("appPreferenceFolder_ST54RETY54", appPreferenceFull);
            appPreferenceFull.open('r', undefined, undefined);
            var configXML = appPreferenceFull.read();
            appPreferenceFull.close();
        } else {userAbort = true;}
    } else {
        appPreferenceFull.open('r', undefined, undefined);
        var configXML = appPreferenceFull.read();
        appPreferenceFull.close();
    }
} else if ($.os.slice(0,3) == "Win") { // Windows
    const mySaveFolder = $.getenv("APPDATA") + "\\Adobe\\InDesign\\Locale Script ST54RETY54\\"; // Folder path to save reg files in
    const myAppVersion = app.version.substring(0,2); // gets fist two digits of version number to use in filename and reg file
    const myFileNameRoman = myAppVersion + "_roman.reg";
    const myFileNameRtL = myAppVersion + "_rtl.reg";
    const myFileNameCJK = myAppVersion + "_cjk.reg";
    const myRegData = "Windows Registry Editor Version 5.00\n\n[HKEY_LOCAL_MACHINE\\SOFTWARE\\Adobe\\InDesign\\" + myAppVersion + ".0]\n\"Feature Set Locale Setting\"=dword:";
    const myRegDataRoman = myRegData + "00000100"; // 256
    const myRegDataRtL = myRegData + "00000103";   // 259
    const myRegDataCJK = myRegData + "00000101";   // 257

    const myRegFileRoman = File(mySaveFolder + myFileNameRoman);
    const myRegFileRtL = File(mySaveFolder + myFileNameRtL);
    const myRegFileCJK = File(mySaveFolder + myFileNameCJK);


    if (!mySaveFolder.exists) {
        Folder(mySaveFolder).create()
    }
    if (!myRegFileRoman.exists) {
        myRegFileRoman.open('w', undefined, undefined);
        myRegFileRoman.write(myRegDataRoman);
        myRegFileRoman.close();
    }
    if (!myRegFileRtL.exists) {
        myRegFileRtL.open('w', undefined, undefined);
        myRegFileRtL.write(myRegDataRtL);
        myRegFileRtL.close();
    }
    if (!myRegFileCJK.exists) {
        myRegFileCJK.open('w', undefined, undefined);
        myRegFileCJK.write(myRegDataCJK);
        myRegFileCJK.close();
    }

}

const permissionIssue = "Unable to edit the following file:\n\n" + appPreferenceFull + "\n\nEnsure you have write access and try again.";
const permissionIssueWin = "File didn't run, ensure you have the correct permissions (eg admin rights) and try again."

var originalConfigXML = configXML; //Used to see if the the plist was written to
var XML_Val;
if ($.os.slice(0,3) == "Mac") { // macOS
    if (!userAbort) {
        if (configXML == "") {
            alert("Error 001\n\n" + permissionIssue); //Please set permissions 
        } else {
            if (app.documents.length == 0) {
                configXML = new XML(configXML);
                XML_Val;
                if (configXML.dict.string > 0) {
                    XML_Val = configXML.dict.string;
                } else if (configXML.dict.integer > 0) {
                    XML_Val = configXML.dict.integer;
                } 
                dialogShow();
            } else {
                alert("Please close all documents and try again.");
            }   
        }
    }
} else if ($.os.slice(0,3) == "Win") { // Windows
    if (!userAbort) {
        if (app.documents.length == 0) {
            switch(app.featureSet) {
                case 1247899758:
                    XML_Val = 257;
                    break;
                case 1381265228:
                    XML_Val = 259;
                    break;
                default:
                   XML_Val = 256;
} 
            XML_Val
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
            dialog.text = "Feature Set Locale Switcher (" + appVersion + ")"; 
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
        
            if (XML_Val == 256) { // ROMAN
                rROM.enabled = false;
                rRTL.enabled = true;
                rRTL.value = true;
                rJPN.enabled = true;
            } else if (XML_Val == 257) { // JPN
                rROM.enabled = true;
                rROM.value = true;
                rRTL.enabled = true;
                rJPN.enabled = false;
            } else if (XML_Val == 259) { // RTL
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
                var proceedYesReally = confirm("Are you sure you want to change InDesign's feature set locale? \n\nIf you proceed InDesign will quit.\n\n You will need to relaunch InDesign manually.", true);
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
        if ($.os.slice(0,3) == "Mac") { // macOS
            var plistBase = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n";
            
            if (configXML.dict.string > 0) {
                configXML.dict.string = ver;
            } else if (configXML.dict.integer > 0) {
                configXML.dict.integer = ver;
            } 
            var newPlistConfigXML = plistBase + configXML.toXMLString();

            appPreferenceFull.open("W");
            appPreferenceFull.write(newPlistConfigXML);
            appPreferenceFull.close();

            if (newPlistConfigXML != originalConfigXML) {
                app.quit();
            } else {
                alert("Error 002\n\n" + permissionIssue);
            }
        } else if ($.os.slice(0,3) == "Win") { // Windows
            var myErrorRegCan = true;
            switch (ver) {
                case 257: // JPN
                    if(myRegFileCJK.execute()){
                        myErrorRegCan = false;
                    }
                    break;
                case 259: // RTL
                    if(myRegFileRtL.execute()){
                        myErrorRegCan = false;
                    }
                    break;
                default:  // Roman
                    if(myRegFileRoman.execute()){
                        myErrorRegCan = false;
                    }
            }

            if(myErrorRegCan) {
                alert("Error 003\n\n" + permissionIssueWin);
            } else {
                app.quit();
            }
        }
    }
