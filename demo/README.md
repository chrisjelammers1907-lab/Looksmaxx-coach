# CHARETT standalone demo

For direct browser access, **[open the published CHARETT demo](https://chrisjelammers1907-lab.github.io/Looksmaxx-coach/)**. That website was verified without a login in Chrome at desktop and mobile sizes; choose **Skip for now** to start testing.

This folder contains the interactive fictional demo as one HTML file. App code, editorial images, fonts and license notices are embedded. No personal PDFs, photos, routines, secrets or health profile are included. The original application source is unchanged.

To open on a personal computer:

1. On the GitHub branch containing this folder, choose **Code → Download ZIP**.
2. Extract the archive completely.
3. Open the `demo` folder.
4. Open `CHARETT-demo.html` with Chrome or Edge.
5. Choose **Skip for now** in the app.

There is no Node.js or package installation. The standalone export uses hash routes so navigation does not require a backend. AI, shopping, visualization and social activity remain labelled local simulations. Personal uploads stay in tab memory, with the same limited fictional-state persistence as the main app.

Verification: the single file was tested in Chromium at desktop and mobile sizes using a local file-serving HTTP endpoint, with all supplementary resource requests blocked. All eight topics, route reloads, wardrobe editing, comments, simulated rich-card sharing and reviewed coach proposals worked without browser errors or additional asset requests. Direct `file://` navigation is blocked by the managed test browser policy, so opening by double-click was not claimed as tested.
