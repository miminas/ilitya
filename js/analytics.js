/* ilitya prototype — visitor analytics (Microsoft Clarity)
   Session recordings, heatmaps, click/scroll tracking.

   Setup (one time):
   1. Create a free project at https://clarity.microsoft.com
      with the GitHub Pages URL as the site.
   2. Paste the project ID below (Settings → Overview → Project ID),
      commit and push. Recordings appear within a few minutes of a visit. */

var CLARITY_PROJECT_ID = ""; /* e.g. "abc1de2fgh" */

(function (c, l, a, r, i, t, y) {
  if (!i) return;
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r);
  t.async = 1;
  t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", CLARITY_PROJECT_ID);
