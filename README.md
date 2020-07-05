# InDesign-Feature-Set-Locale-Switcher-macOS
This script enables quick switching between Roman, right to left and Japanese feature sets within InDesign on macOS.

I reccomend installing this script into the Community Scripts folder in InDesign to ensure it is available within all feature sets, the defualt location for InDesign 2020 is:
```
/Applications/Adobe InDesign 2020/Scripts/Community/Scripts Panel
```

To run the script you need Read & Write permission on InDesign's "applicationpreference.plist" file, the default location for InDesign 2020 is: 
```
/Applications/Adobe InDesign 2020/Presets/applicationpreferences/indesign/
```

1. To grant Read & Write access right click on "applicationpreference.plist" and select "Get Info".
2. Click on the padlock in the bottom left had side to allow changes.
3. Click the plus (+) icon.
4. Select your username and click on "Select".
5. Click on the menu under "Privilege" next to your username and select "Read & Write".
6. Done, you can close the "Get Info" window and start InDesign.

For a backgound on how this script works, check out Dr Ken Lunde's post on [Medium](https://medium.com/@ken.lunde/adobe-indesign-tips-japanese-cjk-functionality-english-ui-redux-539528e295c6).
